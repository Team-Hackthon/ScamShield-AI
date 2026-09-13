require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const { parseEmail } = require("./services/emailParser");
const { extractIOCs } = require("./services/iocExtractor");
const { analyzeHeaders } = require("./services/headerAnalyzer");

const analyzeRoute = require("./routes/analyze");

const app = express();

// =========================
// SECURITY MIDDLEWARE
// =========================

app.use(helmet());
app.use(cors());

// =========================
// BODY PARSER
// =========================

app.use(express.json());

// =========================
// RATE LIMITER
// =========================

const analyzeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    error: "Too many analysis requests. Please try again later.",
  },
});

// =========================
// HOME ROUTE
// =========================

app.get("/", (req, res) => {
  res.send("ScamShield AI Backend is Running!");
});

// =========================
// HEALTH CHECK
// =========================

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "ScamShield AI Backend is running",
  });
});

// =========================
// TEST ROUTE
// =========================

app.get("/test", (req, res) => {
  res.json({
    status: "working",
    message: "ScamShield API is alive!",
  });
});

// =========================
// EXISTING MESSAGE ANALYSIS
// =========================

app.use("/analyze", analyzeLimiter, analyzeRoute);

// =========================
// EMAIL ANALYSIS
// =========================

app.post("/analyze-email", analyzeLimiter, async (req, res) => {
  try {
    const { rawEmail } = req.body;

    // -------------------------
    // VALIDATION
    // -------------------------

    if (!rawEmail) {
      return res.status(400).json({
        error: "rawEmail is required",
      });
    }

    if (typeof rawEmail !== "string") {
      return res.status(400).json({
        error: "rawEmail must be a string",
      });
    }

    if (!rawEmail.trim()) {
      return res.status(400).json({
        error: "rawEmail cannot be empty",
      });
    }

    // -------------------------
    // PARSE EMAIL
    // -------------------------

    const parsedEmail = await parseEmail(rawEmail);

    // -------------------------
    // COMBINE TEXT FOR IOC SCAN
    // -------------------------

    const combinedText = `
      ${parsedEmail.from || ""}
      ${parsedEmail.to || ""}
      ${parsedEmail.replyTo || ""}
      ${parsedEmail.subject || ""}
      ${parsedEmail.text || ""}
      ${(parsedEmail.headers || []).join("\n")}
    `;

    // -------------------------
    // IOC EXTRACTION
    // -------------------------

    const iocs = extractIOCs(combinedText);

    // -------------------------
    // HEADER ANALYSIS
    // -------------------------

    const headerAnalysis = analyzeHeaders(parsedEmail);

    // -------------------------
    // RESPONSE
    // -------------------------

    return res.status(200).json({
      success: true,

      email: parsedEmail,

      iocs,

      headerAnalysis,
    });

  } catch (error) {
    console.error("Email analysis error:", error);

    return res.status(500).json({
      error: "Unable to analyze email",
      details: error.message,
    });
  }
});

// =========================
// 404 HANDLER
// =========================

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

// =========================
// GLOBAL ERROR HANDLER
// =========================

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(500).json({
    error: "Internal server error",
    message: "Something went wrong on the server.",
  });
});

// =========================
// START SERVER
// =========================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `ScamShield AI Backend running on port ${PORT}`
  );
});