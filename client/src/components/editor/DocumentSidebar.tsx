import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import UploadArea from "./UploadArea";
import { 
  Upload, 
  Search, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Brain,
  Home
} from "lucide-react";
import { Link } from "wouter";
import type { Document } from "@shared/schema";

interface DocumentSidebarProps {
  selectedDocument: Document | null;
  onDocumentSelect: (document: Document) => void;
  onCreateDocument: (title: string, content: string) => void;
  isCreating: boolean;
}

export default function DocumentSidebar({ 
  selectedDocument, 
  onDocumentSelect, 
  onCreateDocument,
  isCreating 
}: DocumentSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  const { data: documents, isLoading } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
  });

  const filteredDocuments = documents?.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "analyzing": return "bg-blue-100 text-blue-800";
      case "draft": return "bg-gray-100 text-gray-800";
      case "published": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="w-3 h-3" />;
      case "analyzing": return <Brain className="w-3 h-3 animate-pulse" />;
      case "draft": return <FileText className="w-3 h-3" />;
      case "published": return <CheckCircle2 className="w-3 h-3" />;
      default: return <FileText className="w-3 h-3" />;
    }
  };

  const handleNewDocument = () => {
    onCreateDocument("Untitled Document", "Start writing your article here...");
  };

  return (
    <aside className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Brain className="text-white text-sm" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Final Frontier</h1>
              <p className="text-xs text-gray-600">Editorial AI</p>
            </div>
          </div>
          
          <Link href="/">
            <Button variant="ghost" size="sm" data-testid="button-home">
              <Home className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button 
            className="w-full bg-primary hover:bg-blue-700" 
            onClick={handleNewDocument}
            disabled={isCreating}
            data-testid="button-new-document"
          >
            <FileText className="w-4 h-4 mr-2" />
            {isCreating ? "Creating..." : "New Document"}
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => setShowUpload(!showUpload)}
            data-testid="button-upload"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload File
          </Button>
        </div>

        {/* Upload Area */}
        {showUpload && (
          <div className="mt-4">
            <UploadArea 
              onUploadSuccess={(document: Document) => {
                onDocumentSelect(document);
                setShowUpload(false);
              }}
            />
          </div>
        )}
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-documents"
          />
        </div>
      </div>

      {/* Document List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Recent Documents</h3>
          <span className="text-sm text-gray-500">{filteredDocuments.length}</span>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-3 border border-gray-200 rounded-lg animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-2 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : filteredDocuments.length > 0 ? (
          <div className="space-y-2">
            {filteredDocuments.map((doc) => (
              <Card
                key={doc.id}
                className={`p-3 cursor-pointer transition-colors hover:bg-gray-50 ${
                  selectedDocument?.id === doc.id ? 'ring-2 ring-primary bg-blue-50' : ''
                }`}
                onClick={() => onDocumentSelect(doc)}
                data-testid={`card-document-${doc.id}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm text-gray-900 line-clamp-2" data-testid={`text-document-title-${doc.id}`}>
                    {doc.title}
                  </h4>
                  <Badge 
                    variant="secondary" 
                    className={`ml-2 text-xs ${getStatusColor(doc.status)} flex items-center space-x-1`}
                    data-testid={`badge-document-status-${doc.id}`}
                  >
                    {getStatusIcon(doc.status)}
                    <span>{doc.status}</span>
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span data-testid={`text-document-date-${doc.id}`}>
                    {new Date(doc.updatedAt!).toLocaleDateString()}
                  </span>
                  <span data-testid={`text-document-words-${doc.id}`}>
                    {doc.wordCount} words
                  </span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="mx-auto h-8 w-8 text-gray-400 mb-3" />
            <p className="text-sm text-gray-600">
              {searchQuery ? "No documents found" : "No documents yet"}
            </p>
            {searchQuery && (
              <Button 
                variant="link" 
                onClick={() => setSearchQuery("")}
                className="text-primary text-sm"
                data-testid="button-clear-search"
              >
                Clear search
              </Button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
