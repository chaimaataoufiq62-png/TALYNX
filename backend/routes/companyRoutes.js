const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { requireRole } = require("../middlewares/roleMiddleware");
const companyController = require("../controllers/companyController");

router.get(
  "/profile",
  authMiddleware,
  requireRole("entreprise"),
  companyController.getCompanyProfile
);

router.put(
  "/profile",
  authMiddleware,
  requireRole("entreprise"),
  companyController.updateCompanyProfile
);
// Create challenge
router.post("/challenges", authMiddleware, requireRole("entreprise"), companyController.createChallenge);

// View candidates for a challenge
router.get(
  "/challenges/:challengeId",
  authMiddleware,
  requireRole("entreprise"),
  companyController.getOneCompanyChallenge
);
router.put(
  "/challenges/:challengeId",
  authMiddleware,
  requireRole("entreprise"),
  companyController.updateChallenge
);

router.delete(
  "/challenges/:challengeId",
  authMiddleware,
  requireRole("entreprise"),
  companyController.deleteChallenge
);
router.get(
  "/challenge/:challengeId/skills",
  authMiddleware,
  requireRole("entreprise"),
  companyController.getChallengeSkills
);

router.post(
  "/challenge/:challengeId/skills",
  authMiddleware,
  requireRole("entreprise"),
  companyController.addOrUpdateChallengeSkills
);
router.delete(
  "/challenge/:challengeId/skills/:competenceId",
  authMiddleware,
  requireRole("entreprise"),
  companyController.deleteChallengeSkill
);
router.get(
  "/challenge/:challengeId/eligibility",
  authMiddleware,
  requireRole("entreprise"),
  companyController.getChallengeEligibility
);
router.post(
  "/challenge/:challengeId/eligibility",
  authMiddleware,
  requireRole("entreprise"),
  companyController.addChallengeEligibility
);
router.delete(
  "/challenge/:challengeId/eligibility/:eligibilityId",
  authMiddleware,
  requireRole("entreprise"),
  companyController.deleteChallengeEligibility
);


module.exports = router;