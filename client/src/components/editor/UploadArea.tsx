import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileText, Upload, X, CheckCircle } from "lucide-react";
import type { Document } from "@shared/schema";

interface UploadAreaProps {
  onUploadSuccess: (document: Document) => void;
}

export default function UploadArea({ onUploadSuccess }: UploadAreaProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      try {
        const response = await apiRequest("POST", "/api/upload", formData);
        const document = await response.json();
        
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        return document;
      } catch (error) {
        clearInterval(progressInterval);
        setUploadProgress(0);
        throw error;
      }
    },
    onSuccess: (document: Document) => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      onUploadSuccess(document);
      setUploadProgress(0);
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    },
    onError: (error) => {
      setUploadProgress(0);
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
        description: "Failed to upload file",
        variant: "destructive",
      });
    },
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const allowedTypes = [
      'text/plain',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/markdown'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Error",
        description: "Only .txt, .docx, and .md files are supported",
        variant: "destructive",
      });
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB
      toast({
        title: "Error", 
        description: "File size must be less than 10MB",
        variant: "destructive",
      });
      return;
    }
    
    uploadMutation.mutate(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  if (uploadMutation.isPending) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-gray-600 mb-2">Uploading file...</p>
          <Progress value={uploadProgress} className="w-full" />
          <p className="text-xs text-gray-500 mt-2">{uploadProgress}%</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
        dragActive 
          ? 'border-primary bg-blue-50' 
          : 'border-gray-300 hover:border-primary hover:bg-gray-50'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={handleClick}
      data-testid="upload-area"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.docx,.md"
        onChange={handleFileSelect}
        className="hidden"
        data-testid="input-file"
      />
      
      <FileText className="mx-auto h-8 w-8 text-gray-400 mb-3" />
      <p className="text-sm text-gray-600 mb-1">
        Drag & drop your article here
      </p>
      <p className="text-xs text-gray-400 mb-4">
        Supports .docx, .txt, .md files (max 10MB)
      </p>
      
      <Button variant="outline" size="sm" data-testid="button-browse">
        <Upload className="w-4 h-4 mr-2" />
        Browse Files
      </Button>
    </div>
  );
}
