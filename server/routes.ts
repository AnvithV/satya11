import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { analyzeDocument, analyzeDocumentByStage, checkFactualClaim, editingStages, type EditingStage } from "./services/aiAnalysis";
import { insertDocumentSchema, insertAnalysisResultSchema } from "@shared/schema";
import multer from "multer";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Document routes (authentication bypassed for demo)
  app.get("/api/documents", async (req: any, res) => {
    try {
      const userId = "demo-user";
      const documents = await storage.getUserDocuments(userId);
      res.json(documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  app.get("/api/documents/:id", async (req: any, res) => {
    try {
      const document = await storage.getDocument(req.params.id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      // Skip ownership validation for demo
      res.json(document);
    } catch (error) {
      console.error("Error fetching document:", error);
      res.status(500).json({ message: "Failed to fetch document" });
    }
  });

  app.post("/api/documents", async (req: any, res) => {
    try {
      const userId = "demo-user";
      const documentData = insertDocumentSchema.parse({
        ...req.body,
        userId,
        wordCount: req.body.content?.split(/\s+/).length || 0,
      });
      
      const document = await storage.createDocument(documentData);
      res.json(document);
    } catch (error) {
      console.error("Error creating document:", error);
      res.status(500).json({ message: "Failed to create document" });
    }
  });

  app.put("/api/documents/:id", async (req: any, res) => {
    try {
      const document = await storage.getDocument(req.params.id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      // Skip ownership check for demo
      const updates = {
        ...req.body,
        wordCount: req.body.content ? req.body.content.split(/\s+/).length : (document as any).wordCount,
      };
      
      const updatedDocument = await storage.updateDocument(req.params.id, updates);
      res.json(updatedDocument);
    } catch (error) {
      console.error("Error updating document:", error);
      res.status(500).json({ message: "Failed to update document" });
    }
  });

  app.delete("/api/documents/:id", async (req: any, res) => {
    try {
      const document = await storage.getDocument(req.params.id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      // Skip ownership check for demo
      await storage.deleteDocument(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting document:", error);
      res.status(500).json({ message: "Failed to delete document" });
    }
  });

  // File upload route
  app.post("/api/upload", upload.single('file'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const userId = "demo-user";
      const filename = req.file.originalname;
      const title = filename.replace(/\.[^/.]+$/, ""); // Remove extension
      
      // Extract text content based on file type
      let content = '';
      const fileExtension = filename.toLowerCase().split('.').pop();
      
      if (fileExtension === 'pdf') {
        try {
          const pdfParse = await import('pdf-parse');
          const pdfData = await pdfParse.default(req.file.buffer);
          content = pdfData.text;
        } catch (error) {
          console.error('PDF parsing error:', error);
          content = `Unable to extract text from PDF file: ${filename}. Please upload a text file (.txt) or contact support for assistance.`;
        }
      } else if (fileExtension === 'txt') {
        content = req.file.buffer.toString('utf-8');
      } else {
        // For other file types, provide a helpful error message
        content = `File type .${fileExtension} is not supported. Please upload a text file (.txt) or PDF file (.pdf) for analysis.`;
      }

      const documentData = insertDocumentSchema.parse({
        title,
        content,
        userId,
        wordCount: content.split(/\s+/).length,
        status: "uploaded",
        currentStage: "copy-editors",
        stagesCompleted: [],
        tags: [] // Initialize with empty tags array
      });
      
      const document = await storage.createDocument(documentData);
      res.json(document);
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  // Get editing stages info
  app.get("/api/editing-stages", (req, res) => {
    res.json(editingStages);
  });

  // Analysis routes - new stage-specific route
  app.post("/api/documents/:id/analyze/:stage", async (req: any, res) => {
    try {
      const { stage } = req.params;
      const document = await storage.getDocument(req.params.id);
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      // Skip ownership check for demo
      
      // Validate editing stage
      if (!editingStages[stage as EditingStage]) {
        return res.status(400).json({ message: "Invalid editing stage" });
      }

      // Update document status and current stage
      await storage.updateDocument(req.params.id, { 
        status: `${stage}-reviewing`,
        currentStage: stage
      });

      // Clear existing analysis results for this stage
      await storage.deleteAnalysisResultsByStage(req.params.id, stage);

      // Perform AI analysis for specific stage
      const analysis = await analyzeDocumentByStage({
        content: (document as any).content,
        title: (document as any).title,
        documentId: (document as any).id,
        editingStage: stage as EditingStage,
      });

      // Save analysis results
      for (const result of analysis.results) {
        await storage.createAnalysisResult({
          ...result,
          documentId: (document as any).id,
          editingStage: stage
        });
      }

      // Update document status to completed for this stage
      const completedStages = (document as any).stagesCompleted || [];
      if (!completedStages.includes(stage)) {
        completedStages.push(stage);
      }
      
      await storage.updateDocument(req.params.id, { 
        status: "uploaded",
        stagesCompleted: completedStages
      });

      res.json({
        summary: analysis.summary,
        confidence: analysis.confidence,
        stage: stage,
        completedStages: completedStages
      });
    } catch (error) {
      console.error("Error analyzing document:", error);
      await storage.updateDocument(req.params.id, { status: "uploaded" });
      res.status(500).json({ message: "Failed to analyze document" });
    }
  });

  // Legacy analysis route (for backward compatibility)
  app.post("/api/documents/:id/analyze", async (req: any, res) => {
    try {
      const document = await storage.getDocument(req.params.id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      // Skip ownership check for demo

      // Update document status to analyzing
      await storage.updateDocument(req.params.id, { status: "copy-editing" });

      // Clear existing analysis results
      await storage.deleteAnalysisResults(req.params.id);

      // Perform AI analysis
      const analysis = await analyzeDocument({
        content: (document as any).content,
        title: (document as any).title,
        documentId: (document as any).id,
      });

      // Save analysis results
      for (const result of analysis.results) {
        await storage.createAnalysisResult({
          ...result,
          documentId: (document as any).id
        });
      }

      // Update document status to completed
      await storage.updateDocument(req.params.id, { status: "completed" });

      res.json({
        summary: analysis.summary,
        confidence: analysis.confidence,
      });
    } catch (error) {
      console.error("Error analyzing document:", error);
      // Update document status back to draft on error
      await storage.updateDocument(req.params.id, { status: "uploaded" });
      res.status(500).json({ message: "Failed to analyze document" });
    }
  });

  app.get("/api/documents/:id/analysis", async (req: any, res) => {
    try {
      const { stage } = req.query;
      const document = await storage.getDocument(req.params.id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      // Skip ownership check for demo
      
      const results = await storage.getDocumentAnalysis(req.params.id, stage as string);
      res.json(results);
    } catch (error) {
      console.error("Error fetching analysis:", error);
      res.status(500).json({ message: "Failed to fetch analysis" });
    }
  });

  app.put("/api/analysis/:id/dismiss", async (req: any, res) => {
    try {
      const updatedResult = await storage.dismissAnalysisResult(req.params.id);
      res.json(updatedResult);
    } catch (error) {
      console.error("Error dismissing analysis result:", error);
      res.status(500).json({ message: "Failed to dismiss flag" });
    }
  });

  app.put("/api/analysis/:id/apply-fix", async (req: any, res) => {
    try {
      const updatedResult = await storage.applyAnalysisResultFix(req.params.id);
      res.json(updatedResult);
    } catch (error) {
      console.error("Error applying fix:", error);
      res.status(500).json({ message: "Failed to apply fix" });
    }
  });

  app.put("/api/analysis/:id/resolve", async (req: any, res) => {
    try {
      const updatedResult = await storage.updateAnalysisResult(req.params.id, { 
        isResolved: true 
      });
      res.json(updatedResult);
    } catch (error) {
      console.error("Error resolving analysis result:", error);
      res.status(500).json({ message: "Failed to resolve issue" });
    }
  });

  // Fact-checking route
  app.post("/api/fact-check", async (req: any, res) => {
    try {
      const { claim, context } = req.body;
      const result = await checkFactualClaim(claim, context);
      res.json(result);
    } catch (error) {
      console.error("Error fact-checking:", error);
      res.status(500).json({ message: "Failed to fact-check claim" });
    }
  });

  // Document tags management
  app.put("/api/documents/:id/tags", async (req: any, res) => {
    try {
      const { tags } = req.body;
      const document = await storage.getDocument(req.params.id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      // Skip ownership check for demo
      const updatedDocument = await storage.updateDocument(req.params.id, { tags });
      res.json(updatedDocument);
    } catch (error) {
      console.error("Error updating document tags:", error);
      res.status(500).json({ message: "Failed to update tags" });
    }
  });

  return createServer(app);
}