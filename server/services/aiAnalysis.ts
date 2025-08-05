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
  editingStage: EditingStage;
}

export type EditingStage = "copy-editors" | "fact-checkers" | "standards-ethics" | "legal" | "archivists";

export interface AnalysisResponse {
  results: Omit<InsertAnalysisResult, "documentId">[];
  confidence: number;
  summary: {
    critical: number;
    warnings: number;
    suggestions: number;
    verified: number;
  };
}

export interface EditingStageConfig {
  name: string;
  description: string;
  colorClass: string;
  icon: string;
  systemPrompt: string;
}

export const editingStages: Record<EditingStage, EditingStageConfig> = {
  "copy-editors": {
    name: "Copy Editors",
    description: "Style & Grammar Module - Ensure mechanical accuracy, stylistic consistency, and readability",
    colorClass: "text-blue-600 bg-blue-50",
    icon: "PenTool",
    systemPrompt: `You are an expert copy editor specializing in style, grammar, and readability. Analyze the provided article for:

1. GRAMMAR & SPELLING (type: "critical"):
   - Typos, punctuation errors, grammar violations
   - Subject-verb agreement issues
   - Tense inconsistencies

2. STYLE GUIDE ENFORCEMENT (type: "suggestion"):
   - AP/Chicago style violations (capitalization, numbers, titles, dates)
   - Inconsistent formatting
   - Style inconsistencies

3. READABILITY OPTIMIZATION (type: "suggestion"):
   - Overly complex sentences (high Flesch-Kincaid score)
   - Unclear phrasing
   - Word choice improvements

4. FLOW & STRUCTURE (type: "suggestion"):
   - Paragraph progression issues
   - Tone inconsistencies
   - Structural improvements

Categories: grammar, spelling, style-guide, readability, structure, flow`
  },
  "fact-checkers": {
    name: "Fact Checkers", 
    description: "Fact & Source Verification Module - Guarantee accuracy and proper sourcing",
    colorClass: "text-green-600 bg-green-50",
    icon: "Search",
    systemPrompt: `You are an expert fact-checker specializing in source verification and accuracy. Analyze the provided article for:

1. VERIFIABLE CLAIMS (type: "critical"):
   - Factual assertions that need verification
   - Statistics and numerical claims
   - Historical facts and dates
   - Named entity accuracy (people, places, organizations)

2. SOURCE VERIFICATION (type: "critical"):
   - Unattributed quotes
   - Missing citations for claims
   - Questionable source credibility
   - Primary vs secondary source issues

3. QUOTE VERIFICATION (type: "warning"):
   - Direct quotes needing verification
   - Paraphrased statements
   - Attribution accuracy

4. CROSS-REFERENCING NEEDS (type: "suggestion"):
   - Claims requiring database verification
   - Statistics needing official sources
   - Facts requiring cross-validation

Categories: fact-verification, source-credibility, quote-verification, statistics, attribution`
  },
  "standards-ethics": {
    name: "Standards & Ethics",
    description: "Bias & Sensitivity Analysis Module - Ensure neutrality, fairness, and inclusivity", 
    colorClass: "text-purple-600 bg-purple-50",
    icon: "Shield",
    systemPrompt: `You are an expert ethics reviewer specializing in bias detection and sensitivity analysis. Analyze the provided article for:

1. BIAS DETECTION (type: "critical"):
   - Political leaning or partisan language
   - Emotional manipulation
   - Subjective framing as objective fact
   - Unfair representation of viewpoints

2. PREJUDICED LANGUAGE (type: "critical"):
   - Racial, gender, cultural, or religious bias
   - Stereotyping or discriminatory language
   - Insensitive terminology
   - Microaggressions

3. INCLUSIVITY ISSUES (type: "suggestion"):
   - Non-inclusive language
   - Missing diverse perspectives
   - Accessibility concerns
   - Cultural sensitivity improvements

4. FRAMING ANALYSIS (type: "warning"):
   - Misleading headlines or subheadings
   - Clickbait elements
   - Sensationalized language
   - Balanced representation issues

Categories: bias-detection, inclusivity, framing, sensitivity, representation, headline-review`
  },
  "legal": {
    name: "Legal Department",
    description: "Legal & Compliance Module - Prevent legal risks before publication",
    colorClass: "text-red-600 bg-red-50", 
    icon: "Scale",
    systemPrompt: `You are an expert legal reviewer specializing in publication risk assessment. Analyze the provided article for:

1. DEFAMATION RISK (type: "critical"):
   - Potentially libelous statements
   - Harmful unverified claims about individuals/organizations
   - Accusations without proper evidence
   - False or misleading statements

2. PRIVACY VIOLATIONS (type: "critical"):
   - Sensitive personal data disclosure
   - Unauthorized private information
   - GDPR/privacy law concerns
   - Consent-related issues

3. COPYRIGHT COMPLIANCE (type: "warning"):
   - Quoted text exceeding fair use
   - Unattributed copyrighted material
   - Image/media rights issues
   - Intellectual property concerns

4. REGULATORY COMPLIANCE (type: "warning"):
   - Embargo violations
   - Jurisdiction-specific legal requirements
   - Industry-specific regulations
   - Publication timing restrictions

Categories: defamation-risk, privacy-violation, copyright, regulatory-compliance, legal-risk`
  },
  "archivists": {
    name: "Archivists",
    description: "Historical Consistency Module - Maintain continuity and accuracy over time",
    colorClass: "text-amber-600 bg-amber-50",
    icon: "Archive", 
    systemPrompt: `You are an expert archivist specializing in historical consistency and continuity. Analyze the provided article for:

1. CONSISTENCY CHECKS (type: "critical"):
   - Contradictions with established facts
   - Inconsistent names, dates, or statistics
   - Timeline discrepancies
   - Version control issues

2. HISTORICAL ACCURACY (type: "critical"):
   - Anachronisms or temporal inconsistencies
   - Historical context accuracy
   - Chronological ordering issues
   - Period-appropriate language/concepts

3. CROSS-REFERENCE OPPORTUNITIES (type: "suggestion"):
   - Related historical events for context
   - Previous coverage connections
   - Background information gaps
   - Contextual enrichment possibilities

4. ARCHIVE INTEGRATION (type: "suggestion"):
   - Links to previous coverage
   - Historical documentation references
   - Related story connections
   - SEO and transparency improvements

Categories: historical-consistency, cross-reference, contradiction-detection, archive-linking, continuity`
  }
};

export async function analyzeDocumentByStage(request: AnalysisRequest): Promise<AnalysisResponse> {
  try {
    const stageConfig = editingStages[request.editingStage];
    if (!stageConfig) {
      throw new Error(`Invalid editing stage: ${request.editingStage}`);
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `${stageConfig.systemPrompt}

For each issue found, provide:
- Specific text segment with exact character positions  
- Clear explanation of the issue
- Actionable suggestion for improvement
- Confidence score (0-100)
- Severity level (low, medium, high, critical)

Return results in JSON format:
{
  "results": [
    {
      "editingStage": "${request.editingStage}",
      "type": "critical|warning|suggestion|verified",
      "category": "specific-category-from-above", 
      "message": "Clear explanation of the issue",
      "suggestion": "Specific improvement suggestion", 
      "startIndex": 0,
      "endIndex": 10,
      "confidence": 85,
      "severity": "medium",
      "isResolved": false,
      "isDismissed": false,
      "appliedFix": false
    }
  ],
  "confidence": 92,
  "summary": {
    "critical": 2,
    "warnings": 1, 
    "suggestions": 5,
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
    
    // Add documentId to each result and ensure correct editingStage
    const results = analysis.results?.map((result: any) => ({
      ...result,
      editingStage: request.editingStage,
      documentId: request.documentId
    })) || [];

    return {
      results,
      confidence: analysis.confidence || 0,
      summary: analysis.summary || { critical: 0, warnings: 0, suggestions: 0, verified: 0 }
    };

  } catch (error) {
    console.error("AI Analysis error:", error);
    throw new Error("Failed to analyze document: " + (error as Error).message);
  }
}

// Legacy function for backward compatibility
export async function analyzeDocument(request: Omit<AnalysisRequest, 'editingStage'>): Promise<AnalysisResponse> {
  return analyzeDocumentByStage({
    ...request,
    editingStage: "copy-editors"
  });
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
