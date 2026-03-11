const express = require("express");
const router = express.Router();
const companyController = require("../controllers/companyController");
const authMiddleware = require("../middlewares/authMiddleware");

// Create challenge
router.post("/challenges", authMiddleware, companyController.createChallenge);

// View candidates for a challenge
router.get("/challenges/:id/candidates", authMiddleware, companyController.getCandidatesByChallenge);

// Evaluate a response
router.put("/responses/:id/evaluate", authMiddleware, companyController.evaluateResponse);

module.exports = router;