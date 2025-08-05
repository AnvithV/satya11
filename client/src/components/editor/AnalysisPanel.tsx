import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  X, 
  Brain, 
  AlertCircle, 
  Lightbulb, 
  CheckCircle, 
  Book, 
  Sparkles,
  ExternalLink,
  Check,
  Download
} from "lucide-react";
import type { Document, AnalysisResult } from "@shared/schema";

interface AnalysisPanelProps {
  document: Document;
  analysisResults: AnalysisResult[];
  isLoading: boolean;
  onClose: () => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export default function AnalysisPanel({
  document,
  analysisResults,
  isLoading,
  onClose,
  onAnalyze,
  isAnalyzing
}: AnalysisPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const resolveIssueMutation = useMutation({
    mutationFn: async (resultId: string) => {
      const response = await apiRequest("PUT", `/api/analysis/${resultId}/resolve`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents", document.id, "analysis"] });
      toast({
        title: "Issue Resolved",
        description: "The issue has been marked as resolved",
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
        description: "Failed to resolve issue",
        variant: "destructive",
      });
    },
  });

  const getSummary = () => {
    const critical = analysisResults.filter(r => r.type === "critical" && !r.isResolved).length;
    const suggestions = analysisResults.filter(r => r.type === "suggestion" && !r.isResolved).length;
    const verified = analysisResults.filter(r => r.type === "verified").length;
    const total = analysisResults.length;
    
    return { critical, suggestions, verified, total };
  };

  const getFilteredResults = () => {
    if (selectedCategory === "all") return analysisResults;
    return analysisResults.filter(result => result.type === selectedCategory);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "critical": return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "suggestion": return <Lightbulb className="w-4 h-4 text-yellow-500" />;
      case "verified": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "style": return <Book className="w-4 h-4 text-blue-500" />;
      default: return <Brain className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "critical": return "border-red-200 bg-red-50";
      case "suggestion": return "border-yellow-200 bg-yellow-50";
      case "verified": return "border-green-200 bg-green-50";
      case "style": return "border-blue-200 bg-blue-50";
      default: return "border-gray-200 bg-gray-50";
    }
  };

  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 90) return { label: "Very High", color: "text-green-600" };
    if (confidence >= 70) return { label: "High", color: "text-blue-600" };
    if (confidence >= 50) return { label: "Medium", color: "text-yellow-600" };
    return { label: "Low", color: "text-red-600" };
  };

  const handleResolveIssue = (resultId: string) => {
    resolveIssueMutation.mutate(resultId);
  };

  const summary = getSummary();
  const filteredResults = getFilteredResults();
  const overallConfidence = analysisResults.length > 0 
    ? Math.round(analysisResults.reduce((acc, r) => acc + (r.confidence || 0), 0) / analysisResults.length)
    : 0;

  return (
    <aside className="w-96 bg-gray-50 border-l border-gray-200 flex flex-col">
      {/* Panel Header */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">AI Analysis</h3>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onAnalyze}
              disabled={isAnalyzing}
              data-testid="button-reanalyze-panel"
            >
              <Sparkles className="w-4 h-4 mr-1" />
              {isAnalyzing ? "Analyzing..." : "Re-analyze"}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              data-testid="button-close-analysis"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Analysis Summary */}
        {summary.total > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600" data-testid="text-critical-count">
                {summary.critical}
              </div>
              <div className="text-xs text-gray-600">Critical</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600" data-testid="text-suggestions-count">
                {summary.suggestions}
              </div>
              <div className="text-xs text-gray-600">Suggestions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600" data-testid="text-verified-count">
                {summary.verified}
              </div>
              <div className="text-xs text-gray-600">Verified</div>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {["all", "critical", "suggestion", "verified", "style"].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex-1 text-xs py-1 px-2 rounded transition-colors ${
                selectedCategory === category
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              data-testid={`button-filter-${category}`}
            >
              {category === "all" ? "All" : category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Analysis Results */}
      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredResults.length > 0 ? (
          <div className="space-y-4">
            {filteredResults.map((result) => {
              const confidenceLevel = getConfidenceLevel(result.confidence || 0);
              
              return (
                <Card 
                  key={result.id} 
                  className={`${getTypeColor(result.type)} ${result.isResolved ? 'opacity-60' : ''}`}
                  data-testid={`card-analysis-${result.id}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(result.type)}
                        <CardTitle className="text-sm font-medium capitalize">
                          {result.category}
                        </CardTitle>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {result.confidence && (
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${confidenceLevel.color}`}
                            data-testid={`badge-confidence-${result.id}`}
                          >
                            {result.confidence}%
                          </Badge>
                        )}
                        
                        {result.isResolved && (
                          <Badge variant="outline" className="text-green-600 text-xs">
                            <Check className="w-3 h-3 mr-1" />
                            Resolved
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-700" data-testid={`text-message-${result.id}`}>
                      {result.message}
                    </p>
                    
                    {result.suggestion && (
                      <div className="bg-white/50 rounded p-3 border">
                        <p className="text-xs font-medium text-gray-600 mb-1">Suggestion:</p>
                        <p className="text-sm text-gray-700" data-testid={`text-suggestion-${result.id}`}>
                          {result.suggestion}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-2">
                        {result.type === "verified" && (
                          <Button 
                            variant="link" 
                            size="sm" 
                            className="p-0 text-xs text-blue-600"
                            data-testid={`button-view-source-${result.id}`}
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            View Source
                          </Button>
                        )}
                      </div>
                      
                      {!result.isResolved && result.type !== "verified" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResolveIssue(result.id)}
                          disabled={resolveIssueMutation.isPending}
                          className="text-xs"
                          data-testid={`button-resolve-${result.id}`}
                        >
                          <Check className="w-3 h-3 mr-1" />
                          {resolveIssueMutation.isPending ? "Resolving..." : "Resolve"}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : analysisResults.length === 0 ? (
          <div className="text-center py-12">
            <Brain className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Analysis Yet
            </h3>
            <p className="text-gray-600 mb-4 text-sm">
              Run AI analysis to get comprehensive feedback on your document.
            </p>
            <Button 
              onClick={onAnalyze}
              disabled={isAnalyzing}
              className="bg-primary hover:bg-blue-700"
              data-testid="button-start-analysis"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isAnalyzing ? "Analyzing..." : "Start Analysis"}
            </Button>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 text-sm">
              No {selectedCategory} issues found
            </p>
            <Button 
              variant="link" 
              onClick={() => setSelectedCategory("all")}
              className="text-primary text-sm"
              data-testid="button-show-all"
            >
              Show all results
            </Button>
          </div>
        )}
      </ScrollArea>

      {/* AI Confidence Score */}
      {summary.total > 0 && (
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">AI Confidence</span>
              </div>
              <span className="text-sm font-bold" data-testid="text-overall-confidence">
                {overallConfidence}%
              </span>
            </div>
            
            <Progress value={overallConfidence} className="h-2" />
            
            <p className="text-xs text-gray-600">
              Based on analysis of similar articles and trusted sources
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {summary.total > 0 && (
        <div className="p-4 bg-white border-t border-gray-200 space-y-2">
          <Button 
            variant="outline" 
            className="w-full"
            data-testid="button-export-analysis"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Analysis Report
          </Button>
        </div>
      )}
    </aside>
  );
}
