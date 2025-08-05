import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import DocumentSidebar from "@/components/editor/DocumentSidebar";
import DocumentEditor from "@/components/editor/DocumentEditor";
import AnalysisPanel from "@/components/editor/AnalysisPanel";
import type { Document, AnalysisResult } from "@shared/schema";

export default function Editor() {
  const params = useParams();
  const documentId = params.id;
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [analysisVisible, setAnalysisVisible] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Fetch document if ID is provided
  const { data: document, isLoading: documentLoading } = useQuery<Document>({
    queryKey: ["/api/documents", documentId],
    enabled: !!documentId && isAuthenticated,
  });

  // Fetch analysis results for the document
  const { data: analysisResults, isLoading: analysisLoading } = useQuery<AnalysisResult[]>({
    queryKey: ["/api/documents", documentId, "analysis"],
    enabled: !!documentId && isAuthenticated,
  });

  // Set selected document when data loads
  useEffect(() => {
    if (document) {
      setSelectedDocument(document);
    }
  }, [document]);

  // Create new document mutation
  const createDocumentMutation = useMutation({
    mutationFn: async (data: { title: string; content: string }) => {
      const response = await apiRequest("POST", "/api/documents", data);
      return response.json();
    },
    onSuccess: (newDocument) => {
      setSelectedDocument(newDocument);
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({
        title: "Success",
        description: "Document created successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create document",
        variant: "destructive",
      });
    },
  });

  // Update document mutation
  const updateDocumentMutation = useMutation({
    mutationFn: async (data: { id: string; title?: string; content?: string; status?: string }) => {
      const { id, ...updates } = data;
      const response = await apiRequest("PUT", `/api/documents/${id}`, updates);
      return response.json();
    },
    onSuccess: (updatedDocument) => {
      setSelectedDocument(updatedDocument);
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/documents", updatedDocument.id] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update document",
        variant: "destructive",
      });
    },
  });

  // Analyze document mutation
  const analyzeDocumentMutation = useMutation({
    mutationFn: async (docId: string) => {
      const response = await apiRequest("POST", `/api/documents/${docId}/analyze`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents", documentId, "analysis"] });
      queryClient.invalidateQueries({ queryKey: ["/api/documents", documentId] });
      toast({
        title: "Analysis Complete",
        description: "Document analysis has been completed",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to analyze document",
        variant: "destructive",
      });
    },
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleCreateDocument = (title: string, content: string) => {
    createDocumentMutation.mutate({ title, content });
  };

  const handleUpdateDocument = (updates: { title?: string; content?: string; status?: string }) => {
    if (selectedDocument) {
      updateDocumentMutation.mutate({ id: selectedDocument.id, ...updates });
    }
  };

  const handleAnalyzeDocument = () => {
    if (selectedDocument) {
      analyzeDocumentMutation.mutate(selectedDocument.id);
    }
  };

  const handleDocumentSelect = (doc: Document) => {
    setSelectedDocument(doc);
    window.history.pushState({}, '', `/editor/${doc.id}`);
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <DocumentSidebar
        selectedDocument={selectedDocument}
        onDocumentSelect={handleDocumentSelect}
        onCreateDocument={handleCreateDocument}
        isCreating={createDocumentMutation.isPending}
      />

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Editor */}
        <div className="flex-1">
          <DocumentEditor
            document={selectedDocument}
            analysisResults={analysisResults || []}
            onUpdateDocument={handleUpdateDocument}
            onAnalyzeDocument={handleAnalyzeDocument}
            isUpdating={updateDocumentMutation.isPending}
            isAnalyzing={analyzeDocumentMutation.isPending}
            isLoading={documentLoading}
          />
        </div>

        {/* Analysis Panel */}
        {analysisVisible && selectedDocument && (
          <AnalysisPanel
            document={selectedDocument}
            analysisResults={analysisResults || []}
            isLoading={analysisLoading}
            onClose={() => setAnalysisVisible(false)}
            onAnalyze={handleAnalyzeDocument}
            isAnalyzing={analyzeDocumentMutation.isPending}
          />
        )}
      </div>

      {/* Toggle Analysis Panel Button */}
      {!analysisVisible && selectedDocument && (
        <button
          onClick={() => setAnalysisVisible(true)}
          className="fixed right-4 top-1/2 transform -translate-y-1/2 bg-primary text-white p-3 rounded-l-lg shadow-lg hover:bg-blue-700 transition-colors"
          data-testid="button-show-analysis"
        >
          <span className="sr-only">Show Analysis</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
    </div>
  );
}
