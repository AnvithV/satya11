import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Save, 
  Download, 
  Share, 
  Brain, 
  CheckCircle,
  AlertTriangle, 
  XCircle,
  Sparkles
} from "lucide-react";
import type { Document, AnalysisResult } from "@shared/schema";

interface DocumentEditorProps {
  document: Document | null;
  analysisResults: AnalysisResult[];
  onUpdateDocument: (updates: { title?: string; content?: string; status?: string }) => void;
  onAnalyzeDocument: () => void;
  isUpdating: boolean;
  isAnalyzing: boolean;
  isLoading: boolean;
}

export default function DocumentEditor({
  document,
  analysisResults,
  onUpdateDocument,
  onAnalyzeDocument,
  isUpdating,
  isAnalyzing,
  isLoading
}: DocumentEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  // Update local state when document changes
  useEffect(() => {
    if (document) {
      setTitle(document.title);
      setContent(document.content);
      setHasUnsavedChanges(false);
    }
  }, [document]);

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges && document) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = setTimeout(() => {
        onUpdateDocument({ title, content });
        setHasUnsavedChanges(false);
      }, 2000);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [title, content, hasUnsavedChanges, document, onUpdateDocument]);

  // Apply highlighting to content
  const applyHighlighting = (text: string): string => {
    if (!analysisResults.length) return text;

    let highlightedText = text;
    const highlights: Array<{ start: number; end: number; type: string; id: string }> = [];

    // Sort analysis results by start index to avoid overlapping issues
    const sortedResults = [...analysisResults].sort((a, b) => a.startIndex - b.startIndex);

    sortedResults.forEach((result) => {
      if (result.startIndex < text.length && result.endIndex <= text.length) {
        highlights.push({
          start: result.startIndex,
          end: result.endIndex,
          type: result.type,
          id: result.id
        });
      }
    });

    // Apply highlights from end to start to maintain correct indices
    for (let i = highlights.length - 1; i >= 0; i--) {
      const highlight = highlights[i];
      const beforeText = highlightedText.substring(0, highlight.start);
      const highlightedContent = highlightedText.substring(highlight.start, highlight.end);
      const afterText = highlightedText.substring(highlight.end);
      
      const className = getHighlightClass(highlight.type);
      highlightedText = `${beforeText}<span class="${className}" data-result-id="${highlight.id}" title="Click to view details">${highlightedContent}</span>${afterText}`;
    }

    return highlightedText;
  };

  const getHighlightClass = (type: string): string => {
    switch (type) {
      case "critical": return "bg-red-200 hover:bg-red-300 cursor-pointer rounded px-1";
      case "suggestion": return "bg-yellow-200 hover:bg-yellow-300 cursor-pointer rounded px-1";
      case "verified": return "bg-green-200 hover:bg-green-300 cursor-pointer rounded px-1";
      case "style": return "bg-blue-200 hover:bg-blue-300 cursor-pointer rounded px-1";
      default: return "bg-gray-200 hover:bg-gray-300 cursor-pointer rounded px-1";
    }
  };

  const getAnalysisSummary = () => {
    const summary = {
      critical: analysisResults.filter(r => r.type === "critical").length,
      suggestions: analysisResults.filter(r => r.type === "suggestion").length,
      verified: analysisResults.filter(r => r.type === "verified").length,
    };
    return summary;
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setHasUnsavedChanges(true);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setHasUnsavedChanges(true);
  };

  const handleSaveNow = () => {
    if (document && hasUnsavedChanges) {
      onUpdateDocument({ title, content });
      setHasUnsavedChanges(false);
    }
  };

  const handlePublish = () => {
    if (document) {
      onUpdateDocument({ status: "published" });
    }
  };

  const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
  const summary = getAnalysisSummary();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading document...</p>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center max-w-md">
          <Brain className="mx-auto h-16 w-16 text-gray-400 mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Final Frontier AI</h2>
          <p className="text-gray-600 mb-6">
            Select a document from the sidebar or create a new one to start your AI-powered editorial review.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 text-left">
            <h3 className="font-semibold text-gray-900 mb-2">What we analyze:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Grammar and clarity</li>
              <li>• Fact-checking and verification</li>
              <li>• Tone and bias detection</li>
              <li>• Style guide compliance</li>
              <li>• Legal and PR risk assessment</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Editor Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <Input
            value={title}
            onChange={handleTitleChange}
            className="text-lg font-semibold border-none px-0 focus:ring-0 bg-transparent"
            placeholder="Document title..."
            data-testid="input-document-title"
          />
          
          <div className="flex items-center space-x-2">
            {hasUnsavedChanges ? (
              <Badge variant="outline" className="text-orange-600">
                <Save className="w-3 h-3 mr-1" />
                Unsaved
              </Badge>
            ) : (
              <Badge variant="outline" className="text-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                Auto-saved
              </Badge>
            )}
            
            {document.status === "analyzing" && (
              <Badge variant="outline" className="text-blue-600">
                <Brain className="w-3 h-3 mr-1 animate-pulse" />
                Analyzing
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-600">
            Words: <span className="font-medium" data-testid="text-word-count">{wordCount}</span>
          </div>
          
          {hasUnsavedChanges && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSaveNow}
              disabled={isUpdating}
              data-testid="button-save-now"
            >
              <Save className="w-4 h-4 mr-2" />
              {isUpdating ? "Saving..." : "Save Now"}
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm"
            data-testid="button-export"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          
          <Button 
            size="sm" 
            onClick={handlePublish}
            className="bg-primary hover:bg-blue-700"
            data-testid="button-publish"
          >
            <Share className="w-4 h-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      {/* Analysis Summary Bar */}
      {analysisResults.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium text-red-700">
                  {summary.critical} Critical
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-yellow-700">
                  {summary.suggestions} Suggestions
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-700">
                  {summary.verified} Verified
                </span>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onAnalyzeDocument}
              disabled={isAnalyzing}
              data-testid="button-reanalyze"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isAnalyzing ? "Analyzing..." : "Re-analyze"}
            </Button>
          </div>
        </div>
      )}

      {/* Editor Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <Textarea
            value={content}
            onChange={handleContentChange}
            placeholder="Start writing your article here..."
            className="min-h-[600px] text-base leading-relaxed resize-none border-none focus:ring-0 p-0 bg-transparent"
            data-testid="textarea-content"
          />
          
          {/* Highlighted overlay for showing analysis results */}
          {analysisResults.length > 0 && (
            <div 
              ref={contentRef}
              className="absolute inset-0 pointer-events-none text-base leading-relaxed whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: applyHighlighting(content) }}
              style={{ top: '0', left: '0', padding: 'inherit' }}
            />
          )}
        </div>
      </div>

      {/* Analysis Trigger */}
      {analysisResults.length === 0 && document.status !== "analyzing" && (
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <Brain className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Ready for AI Analysis?
            </h3>
            <p className="text-gray-600 mb-4">
              Get comprehensive feedback on grammar, style, fact-checking, and more.
            </p>
            <Button 
              onClick={onAnalyzeDocument}
              disabled={isAnalyzing}
              className="bg-primary hover:bg-blue-700"
              data-testid="button-analyze"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isAnalyzing ? "Analyzing..." : "Analyze Document"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
