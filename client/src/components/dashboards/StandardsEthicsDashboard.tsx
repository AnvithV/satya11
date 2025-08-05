import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Eye,
  Scale,
  Users,
  Globe,
  TrendingUp,
  BookOpen,
  Target,
  Zap
} from "lucide-react";
import { Link } from "wouter";
import type { Document } from "@shared/schema";

interface StandardsEthicsDashboardProps {
  documents: Document[];
}

export default function StandardsEthicsDashboard({ documents }: StandardsEthicsDashboardProps) {
  const [selectedTool, setSelectedTool] = useState("bias-detector");
  const [analysisText, setAnalysisText] = useState("");

  const flaggedForBias = documents.filter(doc => 
    doc.status === "completed" && Math.random() > 0.8 // Simulating bias-flagged content
  );

  const approvedDocuments = documents.filter(doc => 
    doc.status === "published"
  );

  const ethicsTools = [
    {
      id: "bias-detector",
      title: "Bias Detection",
      description: "Identify potential bias and prejudice",
      icon: <Eye className="w-5 h-5" />,
      color: "bg-orange-50 border-orange-200"
    },
    {
      id: "sensitivity-checker",
      title: "Sensitivity Analysis",
      description: "Check for sensitive content and language",
      icon: <Shield className="w-5 h-5" />,
      color: "bg-purple-50 border-purple-200"
    },
    {
      id: "neutrality-scorer",
      title: "Political Neutrality",
      description: "Analyze political balance and neutrality",
      icon: <Scale className="w-5 h-5" />,
      color: "bg-blue-50 border-blue-200"
    },
    {
      id: "inclusive-language",
      title: "Inclusive Language",
      description: "Promote inclusive and accessible language",
      icon: <Users className="w-5 h-5" />,
      color: "bg-green-50 border-green-200"
    }
  ];

  const biasCategories = [
    { type: "Political", level: "Low", score: 15, color: "text-green-600" },
    { type: "Cultural", level: "Medium", score: 45, color: "text-yellow-600" },
    { type: "Gender", level: "Low", score: 8, color: "text-green-600" },
    { type: "Religious", level: "Low", score: 12, color: "text-green-600" },
    { type: "Racial", level: "Very Low", score: 3, color: "text-green-600" }
  ];

  const ethicsGuidelines = [
    "Avoid loaded or inflammatory language",
    "Present multiple perspectives fairly",
    "Use person-first language when appropriate",
    "Check for cultural sensitivity",
    "Ensure balanced representation",
    "Verify sources for potential conflicts of interest"
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Standards & Ethics Dashboard</h2>
            <p className="text-purple-100">Bias detection, sensitivity, and political neutrality</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold">{flaggedForBias.length}</div>
            <div className="text-sm text-purple-100">Bias Alerts</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold">{approvedDocuments.length}</div>
            <div className="text-sm text-purple-100">Ethics Approved</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold">91%</div>
            <div className="text-sm text-purple-100">Neutrality Score</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold">7</div>
            <div className="text-sm text-purple-100">Reviews Today</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ethics Analysis Tools */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Ethics Analysis Tools</span>
              </CardTitle>
              <CardDescription>
                Advanced tools for bias detection and ethical content review
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedTool} onValueChange={setSelectedTool} className="space-y-4">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                  {ethicsTools.map((tool) => (
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

                {ethicsTools.map((tool) => (
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
                          placeholder="Paste text for ethics analysis..."
                          value={analysisText}
                          onChange={(e) => setAnalysisText(e.target.value)}
                          className="min-h-[120px]"
                          data-testid={`textarea-${tool.id}`}
                        />
                        
                        <div className="flex items-center space-x-2">
                          <Button 
                            className="bg-purple-600 hover:bg-purple-700"
                            data-testid={`button-analyze-${tool.id}`}
                          >
                            <Zap className="w-4 h-4 mr-2" />
                            Analyze Content
                          </Button>
                          <Button variant="outline" data-testid={`button-clear-${tool.id}`}>
                            Clear
                          </Button>
                        </div>

                        {analysisText && tool.id === "bias-detector" && (
                          <div className="border-t pt-4 space-y-3">
                            <div className="text-sm font-medium text-gray-700">Bias Analysis Results:</div>
                            <div className="space-y-2">
                              {biasCategories.map((category, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium">{category.type}</span>
                                    <Badge variant="outline" className={category.color}>
                                      {category.level}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Progress value={category.score} className="w-16 h-2" />
                                    <span className="text-xs text-gray-500">{category.score}%</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {analysisText && tool.id === "sensitivity-checker" && (
                          <div className="border-t pt-4">
                            <div className="text-sm font-medium text-gray-700 mb-2">Sensitivity Check:</div>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>No offensive language detected</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>Cultural sensitivity: Good</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                <span>Consider more inclusive alternatives for 2 terms</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {analysisText && tool.id === "neutrality-scorer" && (
                          <div className="border-t pt-4">
                            <div className="text-sm font-medium text-gray-700 mb-2">Political Neutrality:</div>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Overall Score:</span>
                                <div className="flex items-center space-x-2">
                                  <Progress value={87} className="w-20 h-2" />
                                  <span className="text-sm font-medium">87%</span>
                                </div>
                              </div>
                              <div className="text-xs text-gray-600">
                                <p>• Balanced coverage detected</p>
                                <p>• No strong partisan language</p>
                                <p>• Multiple viewpoints represented</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {analysisText && tool.id === "inclusive-language" && (
                          <div className="border-t pt-4">
                            <div className="text-sm font-medium text-gray-700 mb-2">Inclusivity Score:</div>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Language Inclusivity:</span>
                                <div className="flex items-center space-x-2">
                                  <Progress value={92} className="w-20 h-2" />
                                  <span className="text-sm font-medium">92%</span>
                                </div>
                              </div>
                              <div className="text-xs text-gray-600">
                                <p>✓ Person-first language used appropriately</p>
                                <p>✓ Gender-neutral alternatives suggested</p>
                                <p>✓ Accessible language maintained</p>
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

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Flagged Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <span>Ethics Review Queue</span>
              </CardTitle>
              <CardDescription>
                Content flagged for ethical review
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {flaggedForBias.length > 0 ? (
                flaggedForBias.slice(0, 3).map((doc) => (
                  <Link key={doc.id} href={`/editor/${doc.id}`}>
                    <div className="p-3 border border-orange-200 bg-orange-50 rounded-lg hover:bg-orange-100 cursor-pointer transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm line-clamp-1">{doc.title}</h4>
                        <Badge variant="outline" className="text-orange-600">
                          Review
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600">
                        <p>• Potential bias detected</p>
                        <p>• Sensitivity review needed</p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
                  <p className="text-sm">All content approved</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ethics Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>Ethics Guidelines</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {ethicsGuidelines.map((guideline, index) => (
                <div key={index} className="flex items-start space-x-2 text-xs">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span className="text-gray-700">{guideline}</span>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-4">
                <BookOpen className="w-4 h-4 mr-2" />
                Full Guidelines
              </Button>
            </CardContent>
          </Card>

          {/* Diversity Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Diversity Metrics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Source Diversity:</span>
                  <div className="flex items-center space-x-1">
                    <Progress value={78} className="w-12 h-2" />
                    <span className="text-xs text-gray-500">78%</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Perspective Balance:</span>
                  <div className="flex items-center space-x-1">
                    <Progress value={85} className="w-12 h-2" />
                    <span className="text-xs text-gray-500">85%</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Inclusive Language:</span>
                  <div className="flex items-center space-x-1">
                    <Progress value={92} className="w-12 h-2" />
                    <span className="text-xs text-gray-500">92%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}