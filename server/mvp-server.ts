import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { setupVite, serveStatic } from "./vite";

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// Custom logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(logLine);
    }
  });

  next();
});

// Simple MVP routes without database
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", message: "Final Frontier AI MVP is running" });
});

app.post("/api/analyze", async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    // Simulate AI analysis results for MVP
    const results = {
      grammar: {
        issues: [
          { type: "subject-verb", line: 15, message: "Subject-verb disagreement", suggestion: "Change 'shows' to 'show'" },
          { type: "comma-splice", line: 23, message: "Comma splice detected", suggestion: "Split into separate sentences" }
        ],
        score: 87
      },
      factCheck: {
        flagged: [
          { type: "statistic", message: "75% increase - Source needed", line: 8 },
          { type: "date", message: "Timeline conflict detected", line: 15 }
        ],
        verified: ["Reuters", "AP News"],
        accuracy: 95
      },
      ethics: {
        biasScore: { political: 15, cultural: 8, gender: 12 },
        neutrality: 92,
        inclusivity: 95
      },
      legal: {
        defamationRisk: 5,
        copyrightIssues: 0,
        compliance: 98
      },
      archive: {
        consistency: 94,
        timelineAccuracy: 87,
        dataConsistency: 96,
        similarArticles: 3
      }
    };

    res.json({ success: true, results });
  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({ message: "Analysis failed" });
  }
});

(async () => {
  const server = createServer(app);

  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    console.error("Server error:", err);
  });

  // Setup Vite or serve static files
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const PORT = 5000;
  server.listen(PORT, "0.0.0.0", () => {
    const formattedTime = new Intl.DateTimeFormat("en-US", {
      timeStyle: "medium",
      hour12: false,
    }).format(new Date());

    console.log(`${formattedTime} [express] MVP server running on port ${PORT}`);
  });
})();