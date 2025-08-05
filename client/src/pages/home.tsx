import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { 
  FileText, 
  Home as HomeIcon, 
  Upload,
  PenTool,
  Search,
  Shield,
  Scale,
  Archive,
  Plus,
  Clock
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface Document {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  status: string;
  currentStage: string;
  stagesCompleted: string[];
  createdAt: string;
  updatedAt: string;
}

const stageIcons = {
  "copy-editors": PenTool,
  "fact-checkers": Search,
  "standards-ethics": Shield,
  "legal": Scale,
  "archivists": Archive,
};

const stageColors = {
  "copy-editors": "bg-blue-50 text-blue-700 border-blue-200",
  "fact-checkers": "bg-green-50 text-green-700 border-green-200", 
  "standards-ethics": "bg-purple-50 text-purple-700 border-purple-200",
  "legal": "bg-red-50 text-red-700 border-red-200",
  "archivists": "bg-amber-50 text-amber-700 border-amber-200",
};

export default function Home() {
  const queryClient = useQueryClient();

  const { data: documents = [], isLoading, error } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
    retry: (failureCount, error: any) => {
      // Don't retry if it's an auth error
      if (error?.status === 401) {
        window.location.href = '/api/login';
        return false;
      }
      return failureCount < 3;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (response.status === 401) {
        window.location.href = '/api/login';
        throw new Error('Authentication required');
      }
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadMutation.mutate(file);
    }
  };

  const getStageDisplay = (document: Document) => {
    const Icon = stageIcons[document.currentStage as keyof typeof stageIcons];
    const colorClass = stageColors[document.currentStage as keyof typeof stageColors];
    
    const completedCount = document.stagesCompleted?.length || 0;
    const totalStages = 5;
    
    return {
      Icon,
      colorClass,
      stageName: document.currentStage.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      progress: `${completedCount}/${totalStages} stages complete`
    };
  };

  // Handle authentication redirect
  if (error && (error as any)?.status === 401) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Authentication required</p>
          <Button onClick={() => window.location.href = '/api/login'}>
            Sign In with Replit
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <HomeIcon className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Final Frontier AI</h1>
                <p className="text-sm text-gray-600">Editorial Quality Assurance Platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept=".txt,.doc,.docx,.pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button 
                  asChild
                  disabled={uploadMutation.isPending}
                  className="cursor-pointer"
                >
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    {uploadMutation.isPending ? "Uploading..." : "Upload Document"}
                  </span>
                </Button>
              </label>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
                  <p className="text-sm text-gray-600">Total Documents</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {documents.filter(d => d.status === "uploaded").length}
                  </p>
                  <p className="text-sm text-gray-600">Ready for Review</p>
                </div>
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {documents.filter(d => d.status === "completed").length}
                  </p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
                <Shield className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {documents.reduce((sum, d) => sum + (d.wordCount || 0), 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Total Words</p>
                </div>
                <PenTool className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Documents Grid */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Documents</h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : documents.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center space-y-4">
              <FileText className="w-12 h-12 text-gray-400" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">No documents yet</h3>
                <p className="text-gray-600">Upload your first document to get started with AI-powered editorial review.</p>
              </div>
              <label htmlFor="file-upload">
                <Button asChild className="cursor-pointer">
                  <span>
                    <Plus className="w-4 h-4 mr-2" />
                    Upload Document
                  </span>
                </Button>
              </label>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map(document => {
              const stageInfo = getStageDisplay(document);
              return (
                <Link key={document.id} href={`/document/${document.id}`}>
                  <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 group">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                            {document.title}
                          </CardTitle>
                          <CardDescription>
                            {document.wordCount?.toLocaleString()} words • {" "}
                            {new Date(document.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <stageInfo.Icon className="w-5 h-5 text-gray-400" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {document.content.substring(0, 120)}...
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <Badge 
                            variant="outline" 
                            className={`${stageInfo.colorClass} border`}
                          >
                            <stageInfo.Icon className="w-3 h-3 mr-1" />
                            {stageInfo.stageName}
                          </Badge>
                          
                          <span className="text-xs text-gray-500">
                            {stageInfo.progress}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}