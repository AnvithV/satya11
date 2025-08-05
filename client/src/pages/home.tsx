import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  Plus, 
  FileText, 
  Search, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Clock,
  Brain,
  MoreVertical,
  BookOpen,
  Shield,
  Scale,
  Archive,
  PenTool
} from "lucide-react";
import type { Document, User } from "@shared/schema";

// Import dashboard components
import CopyEditorDashboard from "@/components/dashboards/CopyEditorDashboard";
import FactCheckerDashboard from "@/components/dashboards/FactCheckerDashboard";
import StandardsEthicsDashboard from "@/components/dashboards/StandardsEthicsDashboard";
import LegalDashboard from "@/components/dashboards/LegalDashboard";
import ArchivistDashboard from "@/components/dashboards/ArchivistDashboard";

export default function Home() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("copy-editors");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  const { data: documents, isLoading: documentsLoading } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
    enabled: isAuthenticated,
  });

  const typedUser = user as User;

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-600 bg-green-100";
      case "analyzing": return "text-blue-600 bg-blue-100";
      case "draft": return "text-gray-600 bg-gray-100";
      case "published": return "text-purple-600 bg-purple-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="w-4 h-4" />;
      case "analyzing": return <Brain className="w-4 h-4 animate-pulse" />;
      case "draft": return <FileText className="w-4 h-4" />;
      case "published": return <TrendingUp className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Brain className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Final Frontier AI</h1>
                <p className="text-sm text-gray-600">Quality Assurance Platform</p>
              </div>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/editor" className="text-gray-600 hover:text-gray-900 transition-colors">
              Editor
            </Link>
            <Link href="/analytics" className="text-gray-600 hover:text-gray-900 transition-colors">
              Analytics
            </Link>
            <Link href="/settings" className="text-gray-600 hover:text-gray-900 transition-colors">
              Settings
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <img 
                src={typedUser?.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"} 
                alt="User profile" 
                className="w-8 h-8 rounded-full object-cover"
                data-testid="img-avatar"
              />
              <span className="text-sm font-medium text-gray-900" data-testid="text-username">
                {typedUser?.firstName || typedUser?.email || "User"}
              </span>
            </div>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/api/logout'}
              data-testid="button-logout"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Editorial Dashboard
            </h1>
            <p className="text-gray-600">
              Specialized tools for different editorial teams and workflows
            </p>
          </div>
          
          <Link href="/editor">
            <Button className="bg-primary hover:bg-blue-700" data-testid="button-new-article">
              <Plus className="w-4 h-4 mr-2" />
              New Article
            </Button>
          </Link>
        </div>

        {/* Editorial Team Tabs */}
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

          <TabsContent value="copy-editors" className="space-y-6">
            <CopyEditorDashboard documents={documents || []} />
          </TabsContent>

          <TabsContent value="fact-checkers" className="space-y-6">
            <FactCheckerDashboard documents={documents || []} />
          </TabsContent>

          <TabsContent value="standards-ethics" className="space-y-6">
            <StandardsEthicsDashboard documents={documents || []} />
          </TabsContent>

          <TabsContent value="legal" className="space-y-6">
            <LegalDashboard documents={documents || []} />
          </TabsContent>

          <TabsContent value="archivists" className="space-y-6">
            <ArchivistDashboard documents={documents || []} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
