const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { requireRole } = require("../middlewares/roleMiddleware");
const submissionController = require("../controllers/submissionController");

router.post(
  "/candidate/challenges/:challengeId/submit",
  authMiddleware,
  requireRole("candidat"),
  submissionController.submitChallenge
);

router.get(
  "/candidate/submissions",
  authMiddleware,
  requireRole("candidat"),
  submissionController.getCandidateSubmissions
);

router.get(
  "/company/challenges/:challengeId/submissions",
  authMiddleware,
  requireRole("entreprise"),
  submissionController.getChallengeSubmissions
);

router.post(
  "/company/submissions/:submissionId/evaluate",
  authMiddleware,
  requireRole("entreprise"),
  submissionController.evaluateSubmission
);

module.exports = router;