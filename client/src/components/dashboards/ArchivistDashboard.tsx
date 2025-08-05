import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Archive, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Search,
  BookOpen,
  Calendar,
  Database,
  History,
  GitBranch,
  Layers
} from "lucide-react";
import { Link } from "wouter";
import type { Document } from "@shared/schema";

interface ArchivistDashboardProps {
  documents: Document[];
}

export default function ArchivistDashboard({ documents }: ArchivistDashboardProps) {
  const [selectedTool, setSelectedTool] = useState("consistency-checker");
  const [searchQuery, setSearchQuery] = useState("");

  const inconsistentDocs = documents.filter(doc => 
    doc.status === "completed" && Math.random() > 0.75 // Simulating inconsistent content
  );

  const archivedDocuments = documents.filter(doc => 
    doc.status === "published"
  );

  const archiveTools = [
    {
      id: "consistency-checker",
      title: "Historical Consistency",
      description: "Check against previous articles and archives",
      icon: <History className="w-5 h-5" />,
      color: "bg-indigo-50 border-indigo-200"
    },
    {
      id: "timeline-validator",
      title: "Timeline Validator",
      description: "Verify chronological accuracy",
      icon: <Calendar className="w-5 h-5" />,
      color: "bg-green-50 border-green-200"
    },
    {
      id: "archive-search",
      title: "Archive Search",
      description: "Search through historical articles",
      icon: <Search className="w-5 h-5" />,
      color: "bg-blue-50 border-blue-200"
    },
    {
      id: "version-tracker",
      title: "Version Control",
      description: "Track article versions and changes",
      icon: <GitBranch className="w-5 h-5" />,
      color: "bg-purple-50 border-purple-200"
    }
  ];

  const recentChanges = [
    { 
      title: "Climate Change Report Updated", 
      type: "revision", 
      date: "2024-01-14", 
      impact: "medium",
      changes: "Updated statistics from 2023 UN report"
    },
    { 
      title: "Election Coverage Archive", 
      type: "archived", 
      date: "2024-01-13", 
      impact: "low",
      changes: "Moved to historical archives"
    },
    { 
      title: "Tech Review Series", 
      type: "consistency", 
      date: "2024-01-12", 
      impact: "high",
      changes: "Inconsistency detected with previous reviews"
    }
  ];

  const consistencyMetrics = [
    { category: "Factual Claims", score: 94, status: "excellent" },
    { category: "Timeline Accuracy", score: 87, status: "good" },
    { category: "Source Citations", score: 91, status: "excellent" },
    { category: "Historical Context", score: 82, status: "good" },
    { category: "Data Consistency", score: 96, status: "excellent" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "text-green-600";
      case "good": return "text-blue-600";
      case "fair": return "text-yellow-600";
      case "poor": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "border-red-200 bg-red-50 text-red-700";
      case "medium": return "border-yellow-200 bg-yellow-50 text-yellow-700";
      case "low": return "border-green-200 bg-green-50 text-green-700";
      default: return "border-gray-200 bg-gray-50 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Archive className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Archivist Dashboard</h2>
            <p className="text-indigo-100">Historical consistency and archive management</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold">{inconsistentDocs.length}</div>
            <div className="text-sm text-indigo-100">Inconsistencies</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold">{archivedDocuments.length}</div>
            <div className="text-sm text-indigo-100">Archived Articles</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold">2,847</div>
            <div className="text-sm text-indigo-100">Historical Records</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold">94%</div>
            <div className="text-sm text-indigo-100">Consistency Score</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Archive Tools */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Archive className="w-5 h-5" />
                <span>Archive Management Tools</span>
              </CardTitle>
              <CardDescription>
                Historical research and consistency verification tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedTool} onValueChange={setSelectedTool} className="space-y-4">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                  {archiveTools.map((tool) => (
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

                {archiveTools.map((tool) => (
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
                        {tool.id === "consistency-checker" && (
                          <>
                            <Textarea
                              placeholder="Enter text to check against historical archives..."
                              className="min-h-[120px]"
                              data-testid="textarea-consistency"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <Button 
                                className="bg-indigo-600 hover:bg-indigo-700"
                                data-testid="button-check-consistency"
                              >
                                <History className="w-4 h-4 mr-2" />
                                Check Consistency
                              </Button>
                              <Button variant="outline" data-testid="button-deep-search">
                                Deep Archive Search
                              </Button>
                            </div>
                            <div className="border-t pt-4">
                              <div className="text-sm font-medium text-gray-700 mb-2">Consistency Metrics:</div>
                              <div className="space-y-2">
                                {consistencyMetrics.map((metric, index) => (
                                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                    <span className="text-sm font-medium">{metric.category}</span>
                                    <div className="flex items-center space-x-2">
                                      <Progress value={metric.score} className="w-16 h-2" />
                                      <span className={`text-xs font-medium ${getStatusColor(metric.status)}`}>
                                        {metric.score}%
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        )}

                        {tool.id === "timeline-validator" && (
                          <>
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-2">
                                <Input placeholder="Start Date" type="date" data-testid="input-start-date" />
                                <Input placeholder="End Date" type="date" data-testid="input-end-date" />
                              </div>
                              <Textarea
                                placeholder="Enter events or timeline to validate..."
                                className="min-h-[100px]"
                                data-testid="textarea-timeline"
                              />
                              <Button 
                                className="w-full bg-indigo-600 hover:bg-indigo-700"
                                data-testid="button-validate-timeline"
                              >
                                <Calendar className="w-4 h-4 mr-2" />
                                Validate Timeline
                              </Button>
                              <div className="text-xs text-gray-600 space-y-1">
                                <p>• Checks chronological accuracy</p>
                                <p>• Verifies event dates against archives</p>
                                <p>• Identifies timeline conflicts</p>
                                <p>• Cross-references with historical records</p>
                              </div>
                            </div>
                          </>
                        )}

                        {tool.id === "archive-search" && (
                          <>
                            <div className="space-y-3">
                              <Input
                                placeholder="Search historical articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                data-testid="input-archive-search"
                              />
                              <div className="grid grid-cols-3 gap-2">
                                <Input placeholder="From Date" type="date" data-testid="input-from-date" />
                                <Input placeholder="To Date" type="date" data-testid="input-to-date" />
                                <select className="px-3 py-2 border border-gray-300 rounded-md text-sm" data-testid="select-category">
                                  <option>All Categories</option>
                                  <option>Politics</option>
                                  <option>Business</option>
                                  <option>Technology</option>
                                  <option>Science</option>
                                </select>
                              </div>
                              <Button 
                                className="w-full bg-indigo-600 hover:bg-indigo-700"
                                data-testid="button-search-archives"
                              >
                                <Search className="w-4 h-4 mr-2" />
                                Search Archives
                              </Button>
                              {searchQuery && (
                                <div className="border-t pt-3">
                                  <div className="text-sm font-medium mb-2">Search Results:</div>
                                  <div className="space-y-2 max-h-32 overflow-y-auto">
                                    <div className="p-2 border rounded text-xs">
                                      <div className="font-medium">Climate Change Report 2023</div>
                                      <div className="text-gray-600">Published: Dec 15, 2023 • Relevance: 95%</div>
                                    </div>
                                    <div className="p-2 border rounded text-xs">
                                      <div className="font-medium">Environmental Policy Update</div>
                                      <div className="text-gray-600">Published: Nov 28, 2023 • Relevance: 87%</div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </>
                        )}

                        {tool.id === "version-tracker" && (
                          <>
                            <div className="space-y-3">
                              <Input
                                placeholder="Enter article title or ID..."
                                data-testid="input-version-search"
                              />
                              <Button 
                                className="w-full bg-indigo-600 hover:bg-indigo-700"
                                data-testid="button-track-versions"
                              >
                                <GitBranch className="w-4 h-4 mr-2" />
                                View Version History
                              </Button>
                              <div className="border-t pt-3">
                                <div className="text-sm font-medium mb-2">Version History:</div>
                                <div className="space-y-2 text-xs">
                                  <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded">
                                    <div>
                                      <div className="font-medium">v1.3 - Current</div>
                                      <div className="text-gray-600">Updated statistics, added sources</div>
                                    </div>
                                    <Badge variant="outline" className="text-green-600">Current</Badge>
                                  </div>
                                  <div className="flex items-center justify-between p-2 bg-gray-50 border rounded">
                                    <div>
                                      <div className="font-medium">v1.2</div>
                                      <div className="text-gray-600">Grammar corrections, fact updates</div>
                                    </div>
                                    <Badge variant="outline">Jan 12</Badge>
                                  </div>
                                  <div className="flex items-center justify-between p-2 bg-gray-50 border rounded">
                                    <div>
                                      <div className="font-medium">v1.1</div>
                                      <div className="text-gray-600">Initial publication</div>
                                    </div>
                                    <Badge variant="outline">Jan 10</Badge>
                                  </div>
                                </div>
                              </div>
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
          {/* Recent Changes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Recent Changes</span>
              </CardTitle>
              <CardDescription>
                Latest archive updates and inconsistencies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentChanges.map((change, index) => (
                <div key={index} className={`p-3 border rounded-lg ${getImpactColor(change.impact)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm line-clamp-1">{change.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {change.type}
                    </Badge>
                  </div>
                  <p className="text-xs mb-1">{change.changes}</p>
                  <div className="text-xs opacity-75">{change.date}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Inconsistency Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <span>Consistency Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {inconsistentDocs.length > 0 ? (
                inconsistentDocs.slice(0, 3).map((doc) => (
                  <Link key={doc.id} href={`/editor/${doc.id}`}>
                    <div className="p-3 border border-yellow-200 bg-yellow-50 rounded-lg hover:bg-yellow-100 cursor-pointer transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm line-clamp-1">{doc.title}</h4>
                        <Badge variant="outline" className="text-yellow-600">
                          Inconsistent
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600">
                        <p>• Conflicting timeline data</p>
                        <p>• Factual discrepancy detected</p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
                  <p className="text-sm">All content consistent</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Archive Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="w-5 h-5" />
                <span>Archive Statistics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Articles:</span>
                  <span className="font-medium">2,847</span>
                </div>
                <div className="flex justify-between">
                  <span>This Month:</span>
                  <span className="font-medium">156</span>
                </div>
                <div className="flex justify-between">
                  <span>Updated Today:</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span>Archive Size:</span>
                  <span className="font-medium">1.2 TB</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <Layers className="w-4 h-4 mr-2" />
                View Full Archive
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}