import OpenAI from "openai";
import type { InsertAnalysisResult } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

export interface AnalysisRequest {
  content: string;
  title: string;
  documentId: string;
}

export interface AnalysisResponse {
  results: Omit<InsertAnalysisResult, "documentId">[];
  confidence: number;
  summary: {
    critical: number;
    suggestions: number;
    verified: number;
  };
}

export async function analyzeDocument(request: AnalysisRequest): Promise<AnalysisResponse> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert editorial AI for a major publishing company. Analyze the provided article for:

1. CRITICAL ISSUES (type: "critical"):
   - Factual claims that need verification
   - Potentially libelous or legally risky statements
   - Unsupported broad claims
   - Biased or prejudiced language
   - Misattributed quotes or sources

2. SUGGESTIONS (type: "suggestion"):
   - Grammar and clarity improvements
   - Style guide compliance
   - Tone adjustments
   - Specificity improvements
   - Word choice optimizations

3. VERIFIED CONTENT (type: "verified"):
   - Quotes that can be verified
   - Facts that align with known data
   - Proper citations and attributions

4. STYLE GUIDE (type: "style"):
   - AP Style compliance issues
   - Brand voice consistency
   - Publication guidelines

For each issue, provide:
- Specific text segment with start/end character positions
- Clear explanation of the issue
- Actionable suggestion for improvement
- Confidence score (0-100)
- Category (grammar, fact-check, tone, style-guide, attribution, etc.)

Return results in JSON format with this structure:
{
  "results": [
    {
      "type": "critical|suggestion|verified|style",
      "category": "grammar|fact-check|tone|style-guide|attribution|clarity|specificity|bias|legal",
      "message": "Clear explanation of the issue",
      "suggestion": "Specific improvement suggestion",
      "startIndex": 0,
      "endIndex": 10,
      "confidence": 85,
      "isResolved": false
    }
  ],
  "confidence": 92,
  "summary": {
    "critical": 4,
    "suggestions": 8,
    "verified": 3
  }
}`
        },
        {
          role: "user",
          content: `Title: ${request.title}\n\nContent: ${request.content}`
        }
      ],
      response_format: { type: "json_object" },
    });

    const analysis = JSON.parse(response.choices[0].message.content || "{}");
    
    // Add documentId to each result
    const results = analysis.results?.map((result: any) => ({
      ...result,
      documentId: request.documentId
    })) || [];

    return {
      results,
      confidence: analysis.confidence || 0,
      summary: analysis.summary || { critical: 0, suggestions: 0, verified: 0 }
    };

  } catch (error) {
    console.error("AI Analysis error:", error);
    throw new Error("Failed to analyze document: " + (error as Error).message);
  }
}

export async function checkFactualClaim(claim: string, context: string): Promise<{
  isVerifiable: boolean;
  confidence: number;
  sources: string[];
  suggestion: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a fact-checking expert. Analyze the given claim and determine:
1. Whether it's verifiable against known facts
2. Confidence level (0-100)
3. Potential reliable sources to check
4. Suggestions for improvement

Return JSON format:
{
  "isVerifiable": boolean,
  "confidence": number,
  "sources": ["source1", "source2"],
  "suggestion": "improvement suggestion"
}`
        },
        {
          role: "user",
          content: `Claim: "${claim}"\nContext: "${context}"`
        }
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("Fact-checking error:", error);
    throw new Error("Failed to fact-check claim");
  }
}
