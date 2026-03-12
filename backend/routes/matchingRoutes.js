const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { requireRole } = require("../middlewares/roleMiddleware");
const matchingController = require("../controllers/matchingController");

// côté candidat : voir les challenges matchés
router.get(
  "/candidate/matches",
  authMiddleware,
  requireRole("candidat"),
  matchingController.getCandidateMatches
);

// côté entreprise : voir les candidats matchés pour un challenge
router.get(
  "/company/challenges/:challengeId/matches",
  authMiddleware,
  requireRole("entreprise"),
  matchingController.getChallengeMatchedCandidates
);
router.get(
  "/candidate/matches/saved",
  authMiddleware,
  requireRole("candidat"),
  matchingController.getSavedCandidateMatches
);

router.get(
  "/company/challenges/:challengeId/matches/saved",
  authMiddleware,
  requireRole("entreprise"),
  matchingController.getSavedChallengeMatches
);


router.get(
  "/candidate/matches",
  authMiddleware,
  requireRole("candidat"),
  matchingController.getCandidateMatches
);

router.get(
  "/company/challenges/:challengeId/matches",
  authMiddleware,
  requireRole("entreprise"),
  matchingController.getChallengeMatchedCandidates
);

router.get(
  "/candidate/matches/saved",
  authMiddleware,
  requireRole("candidat"),
  matchingController.getSavedCandidateMatches
);

router.get(
  "/company/challenges/:challengeId/matches/saved",
  authMiddleware,
  requireRole("entreprise"),
  matchingController.getSavedChallengeMatches
);

// nouvelle route
router.post(
  "/matching/run",
  authMiddleware,
  matchingController.runMatching
);

module.exports = router;