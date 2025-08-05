import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Shield, Brain, Zap, FileText, Users } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Brain className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Final Frontier AI</h1>
              <p className="text-sm text-gray-600">Quality Assurance Platform</p>
            </div>
          </div>
          
          <Button 
            onClick={() => window.location.href = '/api/login'}
            className="bg-primary hover:bg-blue-700"
            data-testid="button-login"
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-6">
            <Zap className="w-4 h-4 mr-2" />
            AI-Powered Editorial Assistant
          </Badge>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            The Last Stop Before
            <span className="text-primary block">Your Story Goes Live</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Final Frontier AI acts as your digital senior editor, automatically reviewing articles for 
            grammar, clarity, style compliance, bias detection, and fact-checking against trusted sources.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => window.location.href = '/api/login'}
              className="bg-primary hover:bg-blue-700 text-lg px-8 py-3"
              data-testid="button-get-started"
            >
              Start Your Free Trial
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-3"
              data-testid="button-learn-more"
            >
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="text-green-600 w-6 h-6" />
              </div>
              <CardTitle>Grammar & Style</CardTitle>
              <CardDescription>
                Advanced grammar checking with style guide compliance for AP, Chicago, and custom publication standards.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="text-red-600 w-6 h-6" />
              </div>
              <CardTitle>Risk Detection</CardTitle>
              <CardDescription>
                Flags biased language, legally risky statements, and PR-sensitive content before publication.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Brain className="text-blue-600 w-6 h-6" />
              </div>
              <CardTitle>Fact Verification</CardTitle>
              <CardDescription>
                Cross-checks facts and quotes against trusted sources, detects unverifiable claims, and vets source credibility.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl shadow-lg p-12 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by Leading Publishers
            </h2>
            <p className="text-gray-600">
              Join thousands of newsrooms using AI to maintain editorial excellence
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">99.7%</div>
              <div className="text-gray-600">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">85%</div>
              <div className="text-gray-600">Time Saved</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500K+</div>
              <div className="text-gray-600">Articles Analyzed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-gray-600">Availability</div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600">
              Simple workflow that integrates seamlessly into your editorial process
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="text-primary w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4">1. Upload Article</h3>
              <p className="text-gray-600">
                Upload your draft article or paste content directly into our editor.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="text-primary w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4">2. AI Analysis</h3>
              <p className="text-gray-600">
                Our AI performs comprehensive analysis including fact-checking and style review.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-primary w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4">3. Review & Publish</h3>
              <p className="text-gray-600">
                Review suggested changes, approve corrections, and publish with confidence.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary rounded-2xl text-white p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Editorial Process?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join the future of quality journalism with AI-powered editorial assistance.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => window.location.href = '/api/login'}
            className="text-lg px-8 py-3"
            data-testid="button-start-trial"
          >
            Start Free Trial - No Credit Card Required
          </Button>
        </div>
      </main>
    </div>
  );
}
