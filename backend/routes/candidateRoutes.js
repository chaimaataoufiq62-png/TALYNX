const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { requireRole } = require("../middlewares/roleMiddleware");
const candidateController = require("../controllers/candidateController");

router.get("/profile", authMiddleware, requireRole("candidat"), candidateController.getProfile);
router.put(
  "/profile",
  authMiddleware,
  requireRole("candidat"),
  candidateController.updateCandidateProfile
);
router.post(
  "/skills",
  authMiddleware,
  requireRole("candidat"),
  candidateController.addOrUpdateCandidateSkills
);

router.get(
  "/skills",
  authMiddleware,
  requireRole("candidat"),
  candidateController.getCandidateSkills
);

router.delete(
  "/skills/:competenceId",
  authMiddleware,
  requireRole("candidat"),
  candidateController.deleteCandidateSkill
);

router.get("/challenges", authMiddleware, candidateController.getChallenges);

module.exports = router;