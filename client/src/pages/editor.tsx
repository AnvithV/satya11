import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Home,
  PenTool,
  Search,
  Shield,
  Scale,
  Archive,
  Play,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  X,
  AlertTriangle,
  Info,
  ExternalLink,
  Loader2
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

interface AnalysisResult {
  id: string;
  editingStage: string;
  type: "critical" | "warning" | "suggestion" | "verified";
  category: string;
  message: string;
  suggestion: string | null;
  startIndex: number;
  endIndex: number;
  confidence: number;
  severity: "low" | "medium" | "high" | "critical";
  isResolved: boolean;
  isDismissed: boolean;
  appliedFix: boolean;
}

interface EditingStage {
  name: string;
  description: string;
  colorClass: string;
  icon: string;
}

const stageIcons = {
  "copy-editors": PenTool,
  "fact-checkers": Search,
  "standards-ethics": Shield,
  "legal": Scale,
  "archivists": Archive,
};

const typeColors = {
  critical: "bg-red-50 text-red-800 border-red-200",
  warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
  suggestion: "bg-blue-50 text-blue-800 border-blue-200",
  verified: "bg-green-50 text-green-800 border-green-200",
};

const severityColors = {
  low: "border-l-gray-400",
  medium: "border-l-yellow-400", 
  high: "border-l-orange-400",
  critical: "border-l-red-500",
};

export default function Editor() {
  const { id } = useParams<{ id: string }>();
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [highlightedResults, setHighlightedResults] = useState<AnalysisResult[]>([]);
  const [expandedFlags, setExpandedFlags] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();

  const { data: document, isLoading: documentLoading } = useQuery<Document>({
    queryKey: [`/api/documents/${id}`],
    enabled: !!id,
  });

  const { data: editingStages = {} } = useQuery<Record<string, EditingStage>>({
    queryKey: ["/api/editing-stages"],
  });

  const { data: analysisResults = [], refetch: refetchAnalysis } = useQuery<AnalysisResult[]>({
    queryKey: [`/api/documents/${id}/analysis`, selectedStage],
    queryFn: () => apiRequest(`/api/documents/${id}/analysis?stage=${selectedStage || ''}`),
    enabled: !!id && !!selectedStage,
  });

  const analyzeMutation = useMutation({
    mutationFn: async (stage: string) => {
      return apiRequest(`/api/documents/${id}/analyze/${stage}`, {
        method: 'POST',
      });
    },
    onSuccess: () => {
      refetchAnalysis();
      queryClient.invalidateQueries({ queryKey: [`/api/documents/${id}`] });
    },
  });

  const dismissMutation = useMutation({
    mutationFn: async (resultId: string) => {
      return apiRequest(`/api/analysis/${resultId}/dismiss`, {
        method: 'PUT',
      });
    },
    onSuccess: () => {
      refetchAnalysis();
    },
  });

  const applyFixMutation = useMutation({
    mutationFn: async (resultId: string) => {
      return apiRequest(`/api/analysis/${resultId}/apply-fix`, {
        method: 'PUT',
      });
    },
    onSuccess: () => {
      refetchAnalysis();
    },
  });

  // Update highlighted results when analysis changes
  useEffect(() => {
    if (selectedStage && analysisResults.length > 0) {
      setHighlightedResults(analysisResults);
    } else {
      setHighlightedResults([]);
    }
  }, [selectedStage, analysisResults]);

  const handleStageSelect = (stageKey: string) => {
    if (selectedStage === stageKey) {
      setSelectedStage(null);
      setHighlightedResults([]);
    } else {
      setSelectedStage(stageKey);
    }
  };

  const handleAnalyze = () => {
    if (selectedStage) {
      analyzeMutation.mutate(selectedStage);
    }
  };

  const highlightText = (content: string, results: AnalysisResult[]) => {
    if (results.length === 0) return content;

    const sortedResults = [...results].sort((a, b) => a.startIndex - b.startIndex);
    let highlightedContent = "";
    let lastIndex = 0;

    sortedResults.forEach((result, index) => {
      // Add text before this highlight
      highlightedContent += content.slice(lastIndex, result.startIndex);
      
      // Add highlighted text
      const highlightedText = content.slice(result.startIndex, result.endIndex);
      const colorClass = typeColors[result.type] || "bg-gray-50 text-gray-800 border-gray-200";
      
      highlightedContent += `<span 
        class="cursor-pointer rounded px-1 border-2 ${colorClass} hover:opacity-80 transition-opacity" 
        data-result-id="${result.id}"
        title="${result.message}"
      >${highlightedText}</span>`;
      
      lastIndex = result.endIndex;
    });

    // Add remaining text
    highlightedContent += content.slice(lastIndex);
    
    return highlightedContent;
  };

  const toggleFlagExpansion = (flagId: string) => {
    const newExpanded = new Set(expandedFlags);
    if (newExpanded.has(flagId)) {
      newExpanded.delete(flagId);
    } else {
      newExpanded.add(flagId);
    }
    setExpandedFlags(newExpanded);
  };

  if (documentLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Document not found</h2>
          <p className="text-gray-600 mb-4">The document you're looking for doesn't exist.</p>
          <Link href="/">
            <Button>
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{document.title}</h1>
                <p className="text-sm text-gray-600">
                  {document.wordCount?.toLocaleString()} words
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Editing Stages Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Editing Stages</CardTitle>
                <CardDescription>
                  Select a stage to review specific aspects of your document
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(editingStages).map(([key, stage]) => {
                  const Icon = stageIcons[key as keyof typeof stageIcons];
                  const isCompleted = document.stagesCompleted?.includes(key);
                  const isSelected = selectedStage === key;
                  const isAnalyzing = analyzeMutation.isPending && selectedStage === key;
                  
                  return (
                    <div key={key} className="space-y-2">
                      <Button
                        variant={isSelected ? "default" : "outline"}
                        className={`w-full justify-start text-left h-auto p-3 ${
                          isSelected ? "" : "hover:bg-gray-50"
                        }`}
                        onClick={() => handleStageSelect(key)}
                      >
                        <div className="flex items-center space-x-3 w-full">
                          <Icon className="w-5 h-5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-medium truncate">{stage.name}</span>
                              {isCompleted && (
                                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                              )}
                            </div>
                          </div>
                        </div>
                      </Button>
                      
                      {isSelected && (
                        <div className="ml-8 space-y-2">
                          <p className="text-xs text-gray-600">{stage.description}</p>
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={handleAnalyze}
                            disabled={isAnalyzing}
                          >
                            {isAnalyzing ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Play className="w-4 h-4 mr-2" />
                            )}
                            Use {stage.name} Agent
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Document Content</CardTitle>
                {selectedStage && (
                  <Alert>
                    <Info className="w-4 h-4" />
                    <AlertDescription>
                      Click on highlighted text to see detailed analysis
                    </AlertDescription>
                  </Alert>
                )}
              </CardHeader>
              <CardContent>
                <div 
                  className="prose max-w-none whitespace-pre-wrap leading-relaxed text-gray-900"
                  dangerouslySetInnerHTML={{
                    __html: selectedStage ? highlightText(document.content, highlightedResults) : document.content
                  }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Analysis Results Sidebar */}
          <div className="lg:col-span-1">
            {selectedStage && analysisResults.length > 0 && (
              <Card className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-hidden flex flex-col">
                <CardHeader className="flex-shrink-0">
                  <CardTitle className="text-lg">Analysis Results</CardTitle>
                  <CardDescription>
                    {analysisResults.length} issues found
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto space-y-3">
                  {analysisResults.map(result => {
                    const isExpanded = expandedFlags.has(result.id);
                    const typeIcon = {
                      critical: AlertTriangle,
                      warning: AlertTriangle,
                      suggestion: Info,
                      verified: CheckCircle2,
                    }[result.type];

                    const TypeIcon = typeIcon || Info;

                    return (
                      <div
                        key={result.id}
                        className={`border-l-4 ${severityColors[result.severity]} bg-white border border-gray-200 rounded-r p-3`}
                      >
                        <Collapsible>
                          <CollapsibleTrigger asChild>
                            <Button
                              variant="ghost"
                              className="w-full p-0 h-auto justify-between hover:bg-transparent"
                              onClick={() => toggleFlagExpansion(result.id)}
                            >
                              <div className="flex items-start space-x-2 text-left">
                                <TypeIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <Badge variant="outline" className={`${typeColors[result.type]} text-xs mb-1`}>
                                    {result.type}
                                  </Badge>
                                  <p className="text-sm font-medium text-gray-900 line-clamp-2">
                                    {result.message}
                                  </p>
                                </div>
                              </div>
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4 flex-shrink-0" />
                              ) : (
                                <ChevronRight className="w-4 h-4 flex-shrink-0" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-3 space-y-3">
                            <div className="text-sm text-gray-600">
                              <p className="font-medium">Category: {result.category}</p>
                              <p>Confidence: {result.confidence}%</p>
                              <p>Severity: {result.severity}</p>
                            </div>
                            
                            {result.suggestion && (
                              <div className="bg-blue-50 p-3 rounded border border-blue-200">
                                <p className="text-sm font-medium text-blue-900 mb-1">Suggestion:</p>
                                <p className="text-sm text-blue-800">{result.suggestion}</p>
                              </div>
                            )}
                            
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => dismissMutation.mutate(result.id)}
                                disabled={dismissMutation.isPending}
                              >
                                <X className="w-3 h-3 mr-1" />
                                Dismiss
                              </Button>
                              
                              {result.suggestion && (
                                <Button
                                  size="sm"
                                  onClick={() => applyFixMutation.mutate(result.id)}
                                  disabled={applyFixMutation.isPending}
                                >
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Apply Fix
                                </Button>
                              )}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}
            
            {selectedStage && analysisResults.length === 0 && !analyzeMutation.isPending && (
              <Card>
                <CardContent className="p-6 text-center">
                  <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    No issues found for this editing stage
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}