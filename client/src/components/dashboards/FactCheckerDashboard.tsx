import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Database,
  ExternalLink,
  Target,
  TrendingUp,
  Globe,
  Calendar,
  User,
  DollarSign
} from "lucide-react";
import { Link } from "wouter";
import type { Document } from "@shared/schema";

interface FactCheckerDashboardProps {
  documents: Document[];
}

export default function FactCheckerDashboard({ documents }: FactCheckerDashboardProps) {
  const [selectedTool, setSelectedTool] = useState("claim-checker");
  const [searchQuery, setSearchQuery] = useState("");

  const flaggedDocuments = documents.filter(doc => 
    doc.status === "completed" && Math.random() > 0.7 // Simulating flagged content
  );

  const verifiedDocuments = documents.filter(doc => 
    doc.status === "published"
  );

  const factCheckTools = [
    {
      id: "claim-checker",
      title: "Claim Verification",
      description: "Verify factual claims against trusted sources",
      icon: <Search className="w-5 h-5" />,
      color: "bg-red-50 border-red-200"
    },
    {
      id: "source-validator",
      title: "Source Validator",
      description: "Check credibility of cited sources",
      icon: <Database className="w-5 h-5" />,
      color: "bg-blue-50 border-blue-200"
    },
    {
      id: "quote-verifier",
      title: "Quote Verification",
      description: "Validate quotes and attributions",
      icon: <Target className="w-5 h-5" />,
      color: "bg-green-50 border-green-200"
    },
    {
      id: "data-checker",
      title: "Statistics Checker",
      description: "Verify numbers, dates, and statistics",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "bg-purple-50 border-purple-200"
    }
  ];

  const trustedSources = [
    { name: "Reuters", status: "verified", reliability: 95 },
    { name: "AP News", status: "verified", reliability: 94 },
    { name: "BBC", status: "verified", reliability: 92 },
    { name: "NPR", status: "verified", reliability: 90 },
    { name: "The Guardian", status: "verified", reliability: 88 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Search className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Fact-Checker Dashboard</h2>
            <p className="text-red-100">Verify names, dates, statistics, and quotes</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold">{flaggedDocuments.length}</div>
            <div className="text-sm text-red-100">Claims Flagged</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold">{verifiedDocuments.length}</div>
            <div className="text-sm text-red-100">Verified Articles</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold">97%</div>
            <div className="text-sm text-red-100">Accuracy Rate</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold">24</div>
            <div className="text-sm text-red-100">Sources Today</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fact-Checking Tools */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="w-5 h-5" />
                <span>Verification Tools</span>
              </CardTitle>
              <CardDescription>
                Advanced fact-checking and source verification tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedTool} onValueChange={setSelectedTool} className="space-y-4">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                  {factCheckTools.map((tool) => (
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

                {factCheckTools.map((tool) => (
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
                        {tool.id === "claim-checker" && (
                          <>
                            <Input
                              placeholder="Enter claim or statement to verify..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              data-testid="input-claim"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <Button 
                                className="bg-red-600 hover:bg-red-700"
                                data-testid="button-verify-claim"
                              >
                                <Search className="w-4 h-4 mr-2" />
                                Verify Claim
                              </Button>
                              <Button variant="outline" data-testid="button-bulk-check">
                                Bulk Check
                              </Button>
                            </div>
                          </>
                        )}

                        {tool.id === "source-validator" && (
                          <>
                            <Input
                              placeholder="Enter URL or source name..."
                              data-testid="input-source"
                            />
                            <div className="space-y-3">
                              <Button 
                                className="w-full bg-red-600 hover:bg-red-700"
                                data-testid="button-validate-source"
                              >
                                <Database className="w-4 h-4 mr-2" />
                                Validate Source
                              </Button>
                              <div className="text-sm space-y-2">
                                <div className="font-medium">Quick Checks:</div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div className="flex items-center space-x-1">
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                    <span>Domain Authority</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                    <span>SSL Certificate</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <AlertTriangle className="w-3 h-3 text-yellow-500" />
                                    <span>Bias Rating</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                    <span>Factual Accuracy</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        {tool.id === "quote-verifier" && (
                          <>
                            <Textarea
                              placeholder="Enter quote and attribution..."
                              className="min-h-[80px]"
                              data-testid="textarea-quote"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <Button 
                                className="bg-red-600 hover:bg-red-700"
                                data-testid="button-verify-quote"
                              >
                                <Target className="w-4 h-4 mr-2" />
                                Verify Quote
                              </Button>
                              <Button variant="outline" data-testid="button-search-original">
                                Find Original
                              </Button>
                            </div>
                          </>
                        )}

                        {tool.id === "data-checker" && (
                          <>
                            <div className="grid grid-cols-3 gap-2">
                              <Input placeholder="Number/Statistic" data-testid="input-statistic" />
                              <Input placeholder="Date" data-testid="input-date" />
                              <Input placeholder="Source" data-testid="input-stat-source" />
                            </div>
                            <Button 
                              className="w-full bg-red-600 hover:bg-red-700"
                              data-testid="button-check-data"
                            >
                              <TrendingUp className="w-4 h-4 mr-2" />
                              Check Data Point
                            </Button>
                            <div className="text-xs text-gray-600">
                              <p>Common data sources: Census, Federal Reserve, WHO, UN, etc.</p>
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

        {/* Sidebar with trusted sources and flagged content */}
        <div className="space-y-6">
          {/* Trusted Sources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>Trusted Sources</span>
              </CardTitle>
              <CardDescription>
                Verified news sources and databases
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {trustedSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">{source.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Progress value={source.reliability} className="w-12 h-2" />
                    <span className="text-xs text-gray-500">{source.reliability}%</span>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full">
                <ExternalLink className="w-4 h-4 mr-2" />
                Manage Sources
              </Button>
            </CardContent>
          </Card>

          {/* Flagged Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <span>Flagged Content</span>
              </CardTitle>
              <CardDescription>
                Content requiring fact-check review
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {flaggedDocuments.length > 0 ? (
                flaggedDocuments.slice(0, 3).map((doc) => (
                  <Link key={doc.id} href={`/editor/${doc.id}`}>
                    <div className="p-3 border border-yellow-200 bg-yellow-50 rounded-lg hover:bg-yellow-100 cursor-pointer transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm line-clamp-1">{doc.title}</h4>
                        <Badge variant="outline" className="text-yellow-600">
                          Flagged
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600">
                        <p>• 3 unverified claims</p>
                        <p>• 1 questionable source</p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
                  <p className="text-sm">All content verified</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Reference */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Verification Checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <User className="w-3 h-3" />
                <span>Verify person names and titles</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-3 h-3" />
                <span>Check dates and timelines</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-3 h-3" />
                <span>Validate financial figures</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-3 h-3" />
                <span>Confirm location details</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}