import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Scale, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Shield,
  Copyright,
  Clock,
  Eye,
  TrendingUp,
  BookOpen,
  Gavel,
  Lock
} from "lucide-react";
import { Link } from "wouter";
import type { Document } from "@shared/schema";

interface LegalDashboardProps {
  documents: Document[];
}

export default function LegalDashboard({ documents }: LegalDashboardProps) {
  const [selectedTool, setSelectedTool] = useState("defamation-checker");
  const [legalText, setLegalText] = useState("");

  const legalRiskDocs = documents.filter(doc => 
    doc.status === "completed" && Math.random() > 0.85 // Simulating legal risk content
  );

  const clearedDocuments = documents.filter(doc => 
    doc.status === "published"
  );

  const legalTools = [
    {
      id: "defamation-checker",
      title: "Defamation Risk",
      description: "Identify potentially defamatory statements",
      icon: <Gavel className="w-5 h-5" />,
      color: "bg-red-50 border-red-200"
    },
    {
      id: "copyright-scanner",
      title: "Copyright Scanner",
      description: "Check for copyright violations",
      icon: <Copyright className="w-5 h-5" />,
      color: "bg-blue-50 border-blue-200"
    },
    {
      id: "embargo-checker",
      title: "Embargo Compliance",
      description: "Verify embargo and timing restrictions",
      icon: <Clock className="w-5 h-5" />,
      color: "bg-yellow-50 border-yellow-200"
    },
    {
      id: "privacy-scanner",
      title: "Privacy Protection",
      description: "Identify potential privacy violations",
      icon: <Lock className="w-5 h-5" />,
      color: "bg-purple-50 border-purple-200"
    }
  ];

  const riskCategories = [
    { type: "Defamation", level: "Low", score: 12, color: "text-green-600" },
    { type: "Copyright", level: "Medium", score: 35, color: "text-yellow-600" },
    { type: "Privacy", level: "Low", score: 8, color: "text-green-600" },
    { type: "Contempt", level: "Very Low", score: 2, color: "text-green-600" },
    { type: "Trademark", level: "Low", score: 15, color: "text-green-600" }
  ];

  const legalGuidelines = [
    "Verify all factual claims about individuals",
    "Obtain proper permissions for copyrighted material",
    "Respect embargo dates and timing restrictions",
    "Protect privacy of non-public figures",
    "Avoid statements that could be seen as accusations",
    "Document all sources and permissions"
  ];

  const embargoAlerts = [
    { title: "Tech Conference Results", date: "2024-01-15 9:00 AM", status: "active" },
    { title: "Financial Report Q4", date: "2024-01-18 4:00 PM", status: "upcoming" },
    { title: "Government Announcement", date: "2024-01-20 12:00 PM", status: "upcoming" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Scale className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Legal Department Dashboard</h2>
            <p className="text-gray-300">Defamation, copyright, embargo, and legal risk management</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold">{legalRiskDocs.length}</div>
            <div className="text-sm text-gray-300">Legal Flags</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold">{clearedDocuments.length}</div>
            <div className="text-sm text-gray-300">Legal Cleared</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold">98%</div>
            <div className="text-sm text-gray-300">Compliance Rate</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold">3</div>
            <div className="text-sm text-gray-300">Active Embargos</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Legal Analysis Tools */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Scale className="w-5 h-5" />
                <span>Legal Risk Analysis</span>
              </CardTitle>
              <CardDescription>
                Comprehensive legal risk assessment and compliance tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedTool} onValueChange={setSelectedTool} className="space-y-4">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                  {legalTools.map((tool) => (
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

                {legalTools.map((tool) => (
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
                        {tool.id === "defamation-checker" && (
                          <>
                            <Textarea
                              placeholder="Enter text to check for potential defamation risks..."
                              value={legalText}
                              onChange={(e) => setLegalText(e.target.value)}
                              className="min-h-[120px]"
                              data-testid="textarea-defamation"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <Button 
                                className="bg-gray-800 hover:bg-gray-900"
                                data-testid="button-check-defamation"
                              >
                                <Gavel className="w-4 h-4 mr-2" />
                                Check Risk
                              </Button>
                              <Button variant="outline" data-testid="button-legal-advice">
                                Get Legal Advice
                              </Button>
                            </div>
                            {legalText && (
                              <div className="border-t pt-4 space-y-3">
                                <div className="text-sm font-medium text-gray-700">Legal Risk Assessment:</div>
                                <div className="space-y-2">
                                  {riskCategories.map((category, index) => (
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
                          </>
                        )}

                        {tool.id === "copyright-scanner" && (
                          <>
                            <Input
                              placeholder="Enter content URL or text to scan..."
                              data-testid="input-copyright"
                            />
                            <div className="space-y-3">
                              <Button 
                                className="w-full bg-gray-800 hover:bg-gray-900"
                                data-testid="button-scan-copyright"
                              >
                                <Copyright className="w-4 h-4 mr-2" />
                                Scan for Copyright
                              </Button>
                              <div className="text-sm space-y-2">
                                <div className="font-medium">Quick Checks:</div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div className="flex items-center space-x-1">
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                    <span>Original Content</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <AlertTriangle className="w-3 h-3 text-yellow-500" />
                                    <span>Image Rights</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                    <span>Quote Attribution</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                    <span>Fair Use Compliance</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        {tool.id === "embargo-checker" && (
                          <>
                            <div className="space-y-3">
                              <Input
                                placeholder="Search for embargo information..."
                                data-testid="input-embargo"
                              />
                              <Button 
                                className="w-full bg-gray-800 hover:bg-gray-900"
                                data-testid="button-check-embargo"
                              >
                                <Clock className="w-4 h-4 mr-2" />
                                Check Embargo Status
                              </Button>
                              <div className="border-t pt-3">
                                <div className="text-sm font-medium mb-2">Active Embargos:</div>
                                <div className="space-y-2">
                                  {embargoAlerts.map((embargo, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                                      <div>
                                        <div className="font-medium">{embargo.title}</div>
                                        <div className="text-gray-600">{embargo.date}</div>
                                      </div>
                                      <Badge 
                                        variant="outline" 
                                        className={embargo.status === "active" ? "text-red-600" : "text-yellow-600"}
                                      >
                                        {embargo.status}
                                      </Badge>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        {tool.id === "privacy-scanner" && (
                          <>
                            <Textarea
                              placeholder="Enter content to scan for privacy concerns..."
                              className="min-h-[100px]"
                              data-testid="textarea-privacy"
                            />
                            <Button 
                              className="w-full bg-gray-800 hover:bg-gray-900"
                              data-testid="button-scan-privacy"
                            >
                              <Lock className="w-4 h-4 mr-2" />
                              Scan Privacy Risk
                            </Button>
                            <div className="text-xs text-gray-600 space-y-1">
                              <p>• Checks for personal information disclosure</p>
                              <p>• Identifies minors and protected individuals</p>
                              <p>• Verifies consent for private details</p>
                              <p>• Reviews GDPR/CCPA compliance</p>
                            </div>
                          </>
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
          {/* Legal Risk Queue */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span>Legal Review Queue</span>
              </CardTitle>
              <CardDescription>
                Content flagged for legal review
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {legalRiskDocs.length > 0 ? (
                legalRiskDocs.slice(0, 3).map((doc) => (
                  <Link key={doc.id} href={`/editor/${doc.id}`}>
                    <div className="p-3 border border-red-200 bg-red-50 rounded-lg hover:bg-red-100 cursor-pointer transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm line-clamp-1">{doc.title}</h4>
                        <Badge variant="outline" className="text-red-600">
                          High Risk
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600">
                        <p>• Potential defamation risk</p>
                        <p>• Copyright concerns</p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
                  <p className="text-sm">All content cleared</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Legal Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>Legal Guidelines</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {legalGuidelines.map((guideline, index) => (
                <div key={index} className="flex items-start space-x-2 text-xs">
                  <div className="w-1.5 h-1.5 bg-gray-600 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span className="text-gray-700">{guideline}</span>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-4">
                <Scale className="w-4 h-4 mr-2" />
                Legal Resources
              </Button>
            </CardContent>
          </Card>

          {/* Compliance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Compliance Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Defamation Risk:</span>
                  <div className="flex items-center space-x-1">
                    <Progress value={95} className="w-12 h-2" />
                    <span className="text-xs text-gray-500">Low</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Copyright Compliance:</span>
                  <div className="flex items-center space-x-1">
                    <Progress value={88} className="w-12 h-2" />
                    <span className="text-xs text-gray-500">Good</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Privacy Protection:</span>
                  <div className="flex items-center space-x-1">
                    <Progress value={97} className="w-12 h-2" />
                    <span className="text-xs text-gray-500">High</span>
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