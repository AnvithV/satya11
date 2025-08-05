import {
  users,
  documents,
  analysisResults,
  type User,
  type UpsertUser,
  type Document,
  type InsertDocument,
  type AnalysisResult,
  type InsertAnalysisResult,
} from "@shared/schema";
import { randomUUID } from "crypto";

// Interface for storage operations
export interface IStorage {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Document operations
  createDocument(document: InsertDocument): Promise<Document>;
  getDocument(id: string): Promise<Document | undefined>;
  getUserDocuments(userId: string): Promise<Document[]>;
  updateDocument(id: string, updates: Partial<InsertDocument>): Promise<Document>;
  deleteDocument(id: string): Promise<boolean>;
  
  // Analysis operations
  createAnalysisResult(result: InsertAnalysisResult): Promise<AnalysisResult>;
  getDocumentAnalysis(documentId: string): Promise<AnalysisResult[]>;
  updateAnalysisResult(id: string, updates: Partial<InsertAnalysisResult>): Promise<AnalysisResult>;
  deleteAnalysisResults(documentId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private documents: Map<string, Document>;
  private analysisResults: Map<string, AnalysisResult>;

  constructor() {
    this.users = new Map();
    this.documents = new Map();
    this.analysisResults = new Map();
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = this.users.get(userData.id!);
    const user: User = {
      ...userData,
      id: userData.id || randomUUID(),
      createdAt: existingUser?.createdAt || new Date(),
      updatedAt: new Date(),
    } as User;
    
    this.users.set(user.id, user);
    return user;
  }

  // Document operations
  async createDocument(documentData: InsertDocument): Promise<Document> {
    const id = randomUUID();
    const document: Document = {
      ...documentData,
      id,
      status: documentData.status || "draft",
      wordCount: documentData.wordCount || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.documents.set(id, document);
    return document;
  }

  async getDocument(id: string): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async getUserDocuments(userId: string): Promise<Document[]> {
    return Array.from(this.documents.values())
      .filter(doc => doc.userId === userId)
      .sort((a, b) => b.updatedAt!.getTime() - a.updatedAt!.getTime());
  }

  async updateDocument(id: string, updates: Partial<InsertDocument>): Promise<Document> {
    const existing = this.documents.get(id);
    if (!existing) {
      throw new Error("Document not found");
    }
    
    const updated: Document = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    
    this.documents.set(id, updated);
    return updated;
  }

  async deleteDocument(id: string): Promise<boolean> {
    // Also delete associated analysis results
    const results = Array.from(this.analysisResults.values())
      .filter(result => result.documentId === id);
    
    results.forEach(result => this.analysisResults.delete(result.id));
    
    return this.documents.delete(id);
  }

  // Analysis operations
  async createAnalysisResult(resultData: InsertAnalysisResult): Promise<AnalysisResult> {
    const id = randomUUID();
    const result: AnalysisResult = {
      ...resultData,
      id,
      suggestion: resultData.suggestion || null,
      confidence: resultData.confidence || 0,
      isResolved: resultData.isResolved || false,
      createdAt: new Date(),
    };
    
    this.analysisResults.set(id, result);
    return result;
  }

  async getDocumentAnalysis(documentId: string): Promise<AnalysisResult[]> {
    return Array.from(this.analysisResults.values())
      .filter(result => result.documentId === documentId)
      .sort((a, b) => a.startIndex - b.startIndex);
  }

  async updateAnalysisResult(id: string, updates: Partial<InsertAnalysisResult>): Promise<AnalysisResult> {
    const existing = this.analysisResults.get(id);
    if (!existing) {
      throw new Error("Analysis result not found");
    }
    
    const updated: AnalysisResult = {
      ...existing,
      ...updates,
    };
    
    this.analysisResults.set(id, updated);
    return updated;
  }

  async deleteAnalysisResults(documentId: string): Promise<boolean> {
    const results = Array.from(this.analysisResults.values())
      .filter(result => result.documentId === documentId);
    
    results.forEach(result => this.analysisResults.delete(result.id));
    return true;
  }
}

export const storage = new MemStorage();
