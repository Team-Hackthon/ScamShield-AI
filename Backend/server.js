require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

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
        error: "Too many analysis requests. Please try again later."
    }
});

// =========================
// ROUTES
// =========================

const analyzeRoute = require("./routes/analyze");

app.use("/analyze", analyzeLimiter, analyzeRoute);

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
        message: "ScamShield AI Backend is running"
    });
});

// =========================
// TEST ROUTE
// =========================

app.get("/test", (req, res) => {
    res.json({
        status: "working",
        message: "ScamShield API is alive!"
    });
});

// =========================
// 404 HANDLER
// =========================

app.use((req, res) => {
    res.status(404).json({
        error: "Route not found",
        path: req.originalUrl
    });
});

// =========================
// GLOBAL ERROR HANDLER
// =========================

app.use((err, req, res, next) => {
    console.error("Server Error:", err);

    res.status(500).json({
        error: "Internal server error",
        message: "Something went wrong on the server."
    });
});

// =========================
// START SERVER
// =========================

const PORT = 3000;

app.listen(PORT, () => {
    console.log(
        `ScamShield AI Backend running on http://localhost:${PORT}`
    );
});