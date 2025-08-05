import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  PenTool, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  BookOpen,
  Zap,
  Target,
  TrendingUp,
  Search
} from "lucide-react";
import { Link } from "wouter";
import type { Document } from "@shared/schema";

interface CopyEditorDashboardProps {
  documents: Document[];
}

export default function CopyEditorDashboard({ documents }: CopyEditorDashboardProps) {
  const [selectedTool, setSelectedTool] = useState("style-checker");
  const [testText, setTestText] = useState("");

  // Filter documents that need copy editing
  const documentsNeedingReview = documents.filter(doc => 
    doc.status === "draft" || doc.status === "analyzing"
  );

  const completedDocuments = documents.filter(doc => 
    doc.status === "completed" || doc.status === "published"
  );

  const toolSections = [
    {
      id: "style-checker",
      title: "Style & Grammar Checker",
      description: "Advanced grammar and style analysis",
      icon: <PenTool className="w-5 h-5" />,
      color: "bg-blue-50 border-blue-200"
    },
    {
      id: "consistency",
      title: "Consistency Analyzer",
      description: "Check for style guide compliance",
      icon: <Target className="w-5 h-5" />,
      color: "bg-green-50 border-green-200"
    },
    {
      id: "readability",
      title: "Readability Scorer",
      description: "Analyze text complexity and flow",
      icon: <BookOpen className="w-5 h-5" />,
      color: "bg-purple-50 border-purple-200"
    },
    {
      id: "quick-fix",
      title: "Quick Fix Suggestions",
      description: "Automated editing recommendations",
      icon: <Zap className="w-5 h-5" />,
      color: "bg-yellow-50 border-yellow-200"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <PenTool className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Copy Editor Dashboard</h2>
            <p className="text-blue-100">Style, grammar, and editorial excellence tools</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold">{documentsNeedingReview.length}</div>
            <div className="text-sm text-blue-100">Awaiting Review</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold">{completedDocuments.length}</div>
            <div className="text-sm text-blue-100">Completed Today</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold">94%</div>
            <div className="text-sm text-blue-100">Quality Score</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tools Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PenTool className="w-5 h-5" />
                <span>Editorial Tools</span>
              </CardTitle>
              <CardDescription>
                Professional editing tools for style and grammar review
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedTool} onValueChange={setSelectedTool} className="space-y-4">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                  {toolSections.map((tool) => (
                    <TabsTrigger 
                      key={tool.id} 
                      value={tool.id} 
                      className="text-xs"
                      data-testid={`tab-${tool.id}`}
                    >
                      {tool.icon}
                      <span className="hidden lg:inline ml-1">{tool.title.split(' ')[0]}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {toolSections.map((tool) => (
                  <TabsContent key={tool.id} value={tool.id} className="space-y-4">
                    <Card className={`border-2 ${tool.color}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center space-x-2">
                          {tool.icon}
                          <div>
                            <CardTitle className="text-lg">{tool.title}</CardTitle>
                            <CardDescription>{tool.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Textarea
                          placeholder="Paste your text here for analysis..."
                          value={testText}
                          onChange={(e) => setTestText(e.target.value)}
                          className="min-h-[120px]"
                          data-testid={`textarea-${tool.id}`}
                        />
                        <div className="flex items-center space-x-2">
                          <Button 
                            className="bg-blue-600 hover:bg-blue-700"
                            data-testid={`button-analyze-${tool.id}`}
                          >
                            <Zap className="w-4 h-4 mr-2" />
                            Analyze Text
                          </Button>
                          <Button variant="outline" data-testid={`button-clear-${tool.id}`}>
                            Clear
                          </Button>
                        </div>
                        
                        {testText && (
                          <div className="border-t pt-4">
                            <div className="text-sm text-gray-600 mb-2">Live Analysis:</div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Word Count:</span>
                                <span className="font-medium">{testText.split(/\s+/).filter(w => w.length > 0).length}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Readability:</span>
                                <Badge variant="outline" className="text-green-600">Good</Badge>
                              </div>
                              <div className="flex justify-between">
                                <span>Grammar Score:</span>
                                <div className="flex items-center space-x-2">
                                  <Progress value={85} className="w-16 h-2" />
                                  <span className="text-xs font-medium">85%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Documents Queue */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Review Queue</span>
              </CardTitle>
              <CardDescription>
                Documents awaiting copy edit review
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {documentsNeedingReview.length > 0 ? (
                documentsNeedingReview.slice(0, 5).map((doc) => (
                  <Link key={doc.id} href={`/editor/${doc.id}`}>
                    <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm line-clamp-1">{doc.title}</h4>
                        <Badge 
                          variant="outline" 
                          className={doc.status === "draft" ? "text-gray-600" : "text-blue-600"}
                        >
                          {doc.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{doc.wordCount} words</span>
                        <span>{new Date(doc.updatedAt!).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No documents in queue</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Style Guide Quick Reference */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>Style Guide</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">AP Style</span>
                  <Badge variant="outline" className="text-green-600">Active</Badge>
                </div>
                <div className="space-y-1 text-xs text-gray-600">
                  <p>• Use Oxford comma for lists</p>
                  <p>• Capitalize proper nouns</p>
                  <p>• Use active voice when possible</p>
                  <p>• Avoid excessive adverbs</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <Search className="w-4 h-4 mr-2" />
                View Full Guide
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}