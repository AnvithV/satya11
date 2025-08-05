import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Shield,
  Scale,
  Archive,
  PenTool,
  Upload,
  Zap,
  Target,
  History,
  Cpu
} from "lucide-react";

export default function MVPDashboard() {
  const [activeTab, setActiveTab] = useState("copy-editors");
  const [uploadedContent, setUploadedContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      // In a real implementation, you would convert PDF to text
      // For MVP, we'll simulate with a text area
      setUploadedContent("Sample document content will appear here after PDF upload and processing...");
    }
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Final Frontier AI</h1>
                <p className="text-sm text-gray-600">Editorial Quality Assurance Platform</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="w-5 h-5" />
              <span>Document Upload</span>
            </CardTitle>
            <CardDescription>
              Upload your PDF document for AI-powered editorial analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="flex-1"
                data-testid="input-file-upload"
              />
              <Button 
                onClick={handleAnalyze}
                disabled={!uploadedContent || isAnalyzing}
                className="bg-blue-600 hover:bg-blue-700"
                data-testid="button-analyze"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Analyze Document
                  </>
                )}
              </Button>
            </div>
            
            {fileName && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <FileText className="w-4 h-4" />
                <span>Uploaded: {fileName}</span>
                <Badge variant="outline" className="text-green-600">Ready</Badge>
              </div>
            )}

            {uploadedContent && (
              <Textarea
                value={uploadedContent}
                onChange={(e) => setUploadedContent(e.target.value)}
                placeholder="Document content will appear here..."
                className="min-h-[120px]"
                data-testid="textarea-content"
              />
            )}
          </CardContent>
        </Card>

        {/* Editorial Team Tabs */}
        {uploadedContent && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger 
                value="copy-editors" 
                className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                data-testid="tab-copy-editors"
              >
                <PenTool className="w-4 h-4" />
                <span className="hidden sm:inline">Copy Editors</span>
              </TabsTrigger>
              <TabsTrigger 
                value="fact-checkers" 
                className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                data-testid="tab-fact-checkers"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Fact-Checkers</span>
              </TabsTrigger>
              <TabsTrigger 
                value="standards-ethics" 
                className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                data-testid="tab-standards-ethics"
              >
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Standards & Ethics</span>
              </TabsTrigger>
              <TabsTrigger 
                value="legal" 
                className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                data-testid="tab-legal"
              >
                <Scale className="w-4 h-4" />
                <span className="hidden sm:inline">Legal</span>
              </TabsTrigger>
              <TabsTrigger 
                value="archivists" 
                className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                data-testid="tab-archivists"
              >
                <Archive className="w-4 h-4" />
                <span className="hidden sm:inline">Archivists</span>
              </TabsTrigger>
            </TabsList>

            {/* Copy Editors Dashboard */}
            <TabsContent value="copy-editors" className="space-y-6">
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
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-sm text-blue-100">Grammar Issues</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-2xl font-bold">5</div>
                    <div className="text-sm text-blue-100">Style Suggestions</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-2xl font-bold">87%</div>
                    <div className="text-sm text-blue-100">Readability Score</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      <span>Grammar Issues</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
                      <div className="font-medium text-sm">Subject-verb disagreement</div>
                      <div className="text-xs text-gray-600 mt-1">Line 15: "The data shows" should be "The data show"</div>
                      <Button size="sm" variant="outline" className="mt-2">Fix</Button>
                    </div>
                    <div className="p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
                      <div className="font-medium text-sm">Comma splice</div>
                      <div className="text-xs text-gray-600 mt-1">Line 23: Two independent clauses incorrectly joined</div>
                      <Button size="sm" variant="outline" className="mt-2">Fix</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="w-5 h-5 text-blue-500" />
                      <span>Style Suggestions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 border border-blue-200 bg-blue-50 rounded-lg">
                      <div className="font-medium text-sm">Passive voice detected</div>
                      <div className="text-xs text-gray-600 mt-1">Consider active voice for stronger impact</div>
                      <Button size="sm" variant="outline" className="mt-2">Revise</Button>
                    </div>
                    <div className="p-3 border border-blue-200 bg-blue-50 rounded-lg">
                      <div className="font-medium text-sm">Wordiness</div>
                      <div className="text-xs text-gray-600 mt-1">Sentence can be simplified</div>
                      <Button size="sm" variant="outline" className="mt-2">Simplify</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Fact-Checkers Dashboard */}
            <TabsContent value="fact-checkers" className="space-y-6">
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
                    <div className="text-2xl font-bold">3</div>
                    <div className="text-sm text-red-100">Claims Flagged</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-2xl font-bold">8</div>
                    <div className="text-sm text-red-100">Sources Found</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-2xl font-bold">95%</div>
                    <div className="text-sm text-red-100">Accuracy Rate</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-2xl font-bold">2</div>
                    <div className="text-sm text-red-100">Quotes Verified</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      <span>Flagged Claims</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 border border-red-200 bg-red-50 rounded-lg">
                      <div className="font-medium text-sm">Unverified statistic</div>
                      <div className="text-xs text-gray-600 mt-1">"75% increase" - Source needed</div>
                      <Button size="sm" variant="outline" className="mt-2">Verify</Button>
                    </div>
                    <div className="p-3 border border-red-200 bg-red-50 rounded-lg">
                      <div className="font-medium text-sm">Date inconsistency</div>
                      <div className="text-xs text-gray-600 mt-1">Timeline conflict detected</div>
                      <Button size="sm" variant="outline" className="mt-2">Check</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span>Verified Sources</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium">Reuters</span>
                      </div>
                      <Badge variant="outline" className="text-green-600">Verified</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium">AP News</span>
                      </div>
                      <Badge variant="outline" className="text-green-600">Verified</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Standards & Ethics Dashboard */}
            <TabsContent value="standards-ethics" className="space-y-6">
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
                    <div className="text-2xl font-bold">1</div>
                    <div className="text-sm text-purple-100">Bias Alerts</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-2xl font-bold">92%</div>
                    <div className="text-sm text-purple-100">Neutrality Score</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-2xl font-bold">95%</div>
                    <div className="text-sm text-purple-100">Inclusive Language</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-2xl font-bold">0</div>
                    <div className="text-sm text-purple-100">Sensitivity Issues</div>
                  </div>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Bias Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">Political Bias</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={15} className="w-16 h-2" />
                        <Badge variant="outline" className="text-green-600">Low</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">Cultural Bias</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={8} className="w-16 h-2" />
                        <Badge variant="outline" className="text-green-600">Very Low</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">Gender Bias</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={12} className="w-16 h-2" />
                        <Badge variant="outline" className="text-green-600">Low</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Legal Dashboard */}
            <TabsContent value="legal" className="space-y-6">
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
                    <div className="text-2xl font-bold">0</div>
                    <div className="text-sm text-gray-300">Legal Flags</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-2xl font-bold">98%</div>
                    <div className="text-sm text-gray-300">Compliance Rate</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-2xl font-bold">5%</div>
                    <div className="text-sm text-gray-300">Defamation Risk</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-2xl font-bold">0</div>
                    <div className="text-sm text-gray-300">Copyright Issues</div>
                  </div>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>Legal Compliance Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                        <Progress value={100} className="w-12 h-2" />
                        <span className="text-xs text-gray-500">Clear</span>
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
            </TabsContent>

            {/* Archivists Dashboard */}
            <TabsContent value="archivists" className="space-y-6">
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
                    <div className="text-2xl font-bold">2</div>
                    <div className="text-sm text-indigo-100">Inconsistencies</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-2xl font-bold">1,247</div>
                    <div className="text-sm text-indigo-100">Historical Records</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-2xl font-bold">94%</div>
                    <div className="text-sm text-indigo-100">Consistency Score</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-2xl font-bold">3</div>
                    <div className="text-sm text-indigo-100">Similar Articles</div>
                  </div>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <History className="w-5 h-5" />
                    <span>Historical Consistency Check</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">Factual Claims</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={94} className="w-16 h-2" />
                        <span className="text-xs text-green-600">94%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">Timeline Accuracy</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={87} className="w-16 h-2" />
                        <span className="text-xs text-blue-600">87%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">Data Consistency</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={96} className="w-16 h-2" />
                        <span className="text-xs text-green-600">96%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}