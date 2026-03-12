const db = require("../config/db");

const MAX_LEVEL = 5;

// =========================
// Helpers
// =========================

async function getCandidateByUserId(userId) {
  const [rows] = await db.execute(
    `
    SELECT *
    FROM candidat
    WHERE utilisateur_id = ?
    `,
    [userId]
  );

  return rows.length ? rows[0] : null;
}

async function getCompanyByUserId(userId) {
  const [rows] = await db.execute(
    `
    SELECT *
    FROM entreprise
    WHERE utilisateur_id = ?
    `,
    [userId]
  );

  return rows.length ? rows[0] : null;
}

async function getCandidateSkills(candidatId) {
  const [rows] = await db.execute(
    `
    SELECT
      cc.competence_id,
      cc.niveau,
      c.nom AS competenceNom
    FROM candidat_competence cc
    JOIN competence c ON cc.competence_id = c.id
    WHERE cc.candidat_id = ?
    `,
    [candidatId]
  );

  return rows;
}

async function getChallengeSkills(challengeId) {
  const [rows] = await db.execute(
    `
    SELECT
      chc.competence_id,
      chc.poids,
      c.nom AS competenceNom
    FROM challenge_competence chc
    JOIN competence c ON chc.competence_id = c.id
    WHERE chc.challenge_id = ?
    `,
    [challengeId]
  );

  return rows;
}

async function getChallengeEligibility(challengeId) {
  const [rows] = await db.execute(
    `
    SELECT id, type_critere, valeur
    FROM challenge_eligibilite
    WHERE challenge_id = ?
    `,
    [challengeId]
  );

  return rows;
}

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function checkCandidateEligibility(candidate, criteria) {
  if (!criteria || criteria.length === 0) {
    return {
      eligible: true,
      matchedCriteria: [],
      failedCriteria: []
    };
  }

  const matchedCriteria = [];
  const failedCriteria = [];

  for (const crit of criteria) {
    const type = normalize(crit.type_critere);
    const expected = normalize(crit.valeur);

    let candidateValue = "";

    if (type === "niveauetude") {
      candidateValue = normalize(candidate.niveauEtude);
    } else if (type === "specialite") {
      candidateValue = normalize(candidate.specialite);
    } else if (type === "ville") {
      candidateValue = normalize(candidate.ville);
    } else if (type === "ecole") {
      candidateValue = normalize(candidate.ecole);
    } else {
      // si type inconnu, on le considère non bloquant pour l’instant
      matchedCriteria.push({
        type_critere: crit.type_critere,
        valeur: crit.valeur,
        note: "critère ignoré"
      });
      continue;
    }

    if (candidateValue === expected) {
      matchedCriteria.push({
        type_critere: crit.type_critere,
        valeur: crit.valeur
      });
    } else {
      failedCriteria.push({
        type_critere: crit.type_critere,
        valeurAttendue: crit.valeur,
        valeurCandidat: candidateValue || null
      });
    }
  }

  return {
    eligible: failedCriteria.length === 0,
    matchedCriteria,
    failedCriteria
  };
}

function calculateSkillScore(candidateSkills, challengeSkills) {
  if (!challengeSkills || challengeSkills.length === 0) {
    return {
      score: 0,
      matchedSkills: [],
      missingSkills: [],
      totalObtainedPoints: 0,
      totalMaxPoints: 0
    };
  }

  const candidateMap = {};
  for (const skill of candidateSkills) {
    candidateMap[skill.competence_id] = skill;
  }

  let totalObtainedPoints = 0;
  let totalMaxPoints = 0;
  const matchedSkills = [];
  const missingSkills = [];

  for (const reqSkill of challengeSkills) {
    const poids = Number(reqSkill.poids) || 1;
    const maxPoints = MAX_LEVEL * poids;
    totalMaxPoints += maxPoints;

    const candidateSkill = candidateMap[reqSkill.competence_id];

    if (candidateSkill) {
      const niveau = Number(candidateSkill.niveau) || 0;
      const obtained = niveau * poids;
      totalObtainedPoints += obtained;

      matchedSkills.push({
        competence_id: reqSkill.competence_id,
        competenceNom: reqSkill.competenceNom,
        niveau,
        poids,
        points: obtained,
        pointsMax: maxPoints
      });
    } else {
      missingSkills.push({
        competence_id: reqSkill.competence_id,
        competenceNom: reqSkill.competenceNom,
        poids,
        points: 0,
        pointsMax: maxPoints
      });
    }
  }

  const score =
    totalMaxPoints === 0
      ? 0
      : Math.round((totalObtainedPoints / totalMaxPoints) * 100);

  return {
    score,
    matchedSkills,
    missingSkills,
    totalObtainedPoints,
    totalMaxPoints
  };
}

async function buildMatchResult(candidate, challenge, persist = false) {
  const candidateSkills = await getCandidateSkills(candidate.id);
  const challengeSkills = await getChallengeSkills(challenge.id);
  const criteria = await getChallengeEligibility(challenge.id);

  const skillResult = calculateSkillScore(candidateSkills, challengeSkills);
  const eligibilityResult = checkCandidateEligibility(candidate, criteria);

  const result = {
    challenge: {
      id: challenge.id,
      titre: challenge.titre,
      description: challenge.description,
      niveau: challenge.niveau,
      dateDebut: challenge.dateDebut,
      dateFin: challenge.dateFin,
      entreprise_id: challenge.entreprise_id
    },
    score: skillResult.score,
    eligible: eligibilityResult.eligible,
    matchedSkills: skillResult.matchedSkills,
    missingSkills: skillResult.missingSkills,
    matchedCriteria: eligibilityResult.matchedCriteria,
    failedCriteria: eligibilityResult.failedCriteria
  };

  if (persist) {
    await saveMatchResult(candidate.id, challenge.id, result.score, result.eligible);
  }

  return result;
}


// =========================
// Candidate -> matched challenges
// =========================

exports.getCandidateMatches = async (req, res) => {
  try {
     const eligibleOnly = String(req.query.eligibleOnly || "false").toLowerCase() === "true";
     const minScore = Number(req.query.minScore || 0);
    const candidate = await getCandidateByUserId(req.user.id);
    if (!candidate) {
      return res.status(404).json({
        message: "Candidat introuvable."
      });
    }

    const [challenges] = await db.execute(
      `
      SELECT *
      FROM challenge
      ORDER BY id DESC
      `
    );

    let results = [];

    for (const challenge of challenges) {
      const match = await buildMatchResult(candidate, challenge, true);
      results.push(match);
    }

    if (eligibleOnly) {
      results = results.filter(match => match.eligible === true);
    }
    if (!Number.isNaN(minScore) && minScore > 0) {
      results = results.filter(match => match.score >= minScore);
    }

    results.sort((a, b) => {
      if (b.eligible !== a.eligible) {
        return Number(b.eligible) - Number(a.eligible);
      }
      return b.score - a.score;
    });

    return res.status(200).json({
      candidate: {
        id: candidate.id,
        nom: candidate.nom,
        prenom: candidate.prenom
      },
      filters: {
      eligibleOnly,
       minScore
      },
      total: results.length,
      matches: results
    });
  } catch (error) {
    console.error("Erreur getCandidateMatches :", error);
    return res.status(500).json({
      message: "Erreur serveur."
    });
  }
};

// =========================
// Company -> matched candidates for one challenge
// =========================

exports.getChallengeMatchedCandidates = async (req, res) => {
  const { challengeId } = req.params;

  try {
     const eligibleOnly = String(req.query.eligibleOnly || "false").toLowerCase() === "true";
    const company = await getCompanyByUserId(req.user.id);

    if (!company) {
      return res.status(404).json({
        message: "Entreprise introuvable."
      });
    }

    const [challengeRows] = await db.execute(
      `
      SELECT *
      FROM challenge
      WHERE id = ? AND entreprise_id = ?
      `,
      [challengeId, company.id]
    );

    if (challengeRows.length === 0) {
      return res.status(404).json({
        message: "Challenge introuvable ou non autorisé."
      });
    }

    const challenge = challengeRows[0];

    const [candidates] = await db.execute(
      `
      SELECT *
      FROM candidat
      ORDER BY id DESC
      `
    );

    let results = [];
    for (const candidate of candidates) {
  const candidateSkills = await getCandidateSkills(candidate.id);
  const challengeSkills = await getChallengeSkills(challenge.id);
  const criteria = await getChallengeEligibility(challenge.id);

  const skillResult = calculateSkillScore(candidateSkills, challengeSkills);
  const eligibilityResult = checkCandidateEligibility(candidate, criteria);

  await saveMatchResult(candidate.id, challenge.id, skillResult.score, eligibilityResult.eligible);

  results.push({
    candidate: {
      id: candidate.id,
      nom: candidate.nom,
      prenom: candidate.prenom,
      ville: candidate.ville,
      ecole: candidate.ecole,
      diplome: candidate.diplome,
      specialite: candidate.specialite,
      niveauEtude: candidate.niveauEtude
    },
    score: skillResult.score,
    eligible: eligibilityResult.eligible,
    matchedSkills: skillResult.matchedSkills,
    missingSkills: skillResult.missingSkills,
    matchedCriteria: eligibilityResult.matchedCriteria,
    failedCriteria: eligibilityResult.failedCriteria
  });
}
    
if (eligibleOnly) {
      results = results.filter(match => match.eligible === true);
    }
    results.sort((a, b) => {
      if (b.eligible !== a.eligible) {
        return Number(b.eligible) - Number(a.eligible);
      }
      return b.score - a.score;
    });

    return res.status(200).json({
      challenge: {
        id: challenge.id,
        titre: challenge.titre,
        niveau: challenge.niveau
      },
      filters: {
      eligibleOnly,
       minScore
      },
      total: results.length,
      matches: results
    });
  } catch (error) {
    console.error("Erreur getChallengeMatchedCandidates :", error);
    return res.status(500).json({
      message: "Erreur serveur."
    });
  }
};
async function saveMatchResult(candidatId, challengeId, score, eligible) {
  await db.execute(
    `
    INSERT INTO matching_resultat (candidat_id, challenge_id, score, eligible)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      score = VALUES(score),
      eligible = VALUES(eligible),
      date_matching = CURRENT_TIMESTAMP
    `,
    [candidatId, challengeId, score, eligible]
  );
}
exports.getSavedCandidateMatches = async (req, res) => {
  try {
    const eligibleOnly = String(req.query.eligibleOnly || "false").toLowerCase() === "true";
    const minScore = Number(req.query.minScore || 0);

    const candidate = await getCandidateByUserId(req.user.id);

    if (!candidate) {
      return res.status(404).json({
        message: "Candidat introuvable."
      });
    }

    let query = `
      SELECT
        mr.id,
        mr.score,
        mr.eligible,
        mr.date_matching,
        ch.id AS challenge_id,
        ch.titre,
        ch.description,
        ch.niveau,
        ch.dateDebut,
        ch.dateFin,
        ch.entreprise_id
      FROM matching_resultat mr
      JOIN challenge ch ON mr.challenge_id = ch.id
      WHERE mr.candidat_id = ?
    `;
    const params = [candidate.id];

    if (eligibleOnly) {
      query += ` AND mr.eligible = true`;
    }

    if (!Number.isNaN(minScore) && minScore > 0) {
      query += ` AND mr.score >= ?`;
      params.push(minScore);
    }

    query += ` ORDER BY mr.eligible DESC, mr.score DESC`;

    const [rows] = await db.execute(query, params);

    return res.status(200).json({
      candidate: {
        id: candidate.id,
        nom: candidate.nom,
        prenom: candidate.prenom
      },
      filters: {
        eligibleOnly,
        minScore
      },
      total: rows.length,
      matches: rows
    });
  } catch (error) {
    console.error("Erreur getSavedCandidateMatches :", error);
    return res.status(500).json({
      message: "Erreur serveur."
    });
  }
};

exports.getSavedChallengeMatches = async (req, res) => {
  const { challengeId } = req.params;

  try {
    const eligibleOnly = String(req.query.eligibleOnly || "false").toLowerCase() === "true";
    const minScore = Number(req.query.minScore || 0);

    const company = await getCompanyByUserId(req.user.id);

    if (!company) {
      return res.status(404).json({
        message: "Entreprise introuvable."
      });
    }

    const [challengeRows] = await db.execute(
      `
      SELECT *
      FROM challenge
      WHERE id = ? AND entreprise_id = ?
      `,
      [challengeId, company.id]
    );

    if (challengeRows.length === 0) {
      return res.status(404).json({
        message: "Challenge introuvable ou non autorisé."
      });
    }

    let query = `
      SELECT
        mr.id,
        mr.score,
        mr.eligible,
        mr.date_matching,
        c.id AS candidat_id,
        c.nom,
        c.prenom,
        c.ville,
        c.ecole,
        c.diplome,
        c.specialite,
        c.niveauEtude
      FROM matching_resultat mr
      JOIN candidat c ON mr.candidat_id = c.id
      WHERE mr.challenge_id = ?
    `;
    const params = [challengeId];

    if (eligibleOnly) {
      query += ` AND mr.eligible = true`;
    }

    if (!Number.isNaN(minScore) && minScore > 0) {
      query += ` AND mr.score >= ?`;
      params.push(minScore);
    }

    query += ` ORDER BY mr.eligible DESC, mr.score DESC`;

    const [rows] = await db.execute(query, params);

    return res.status(200).json({
      challenge: {
        id: challengeRows[0].id,
        titre: challengeRows[0].titre,
        niveau: challengeRows[0].niveau
      },
      filters: {
        eligibleOnly,
        minScore
      },
      total: rows.length,
      matches: rows
    });
  } catch (error) {
    console.error("Erreur getSavedChallengeMatches :", error);
    return res.status(500).json({
      message: "Erreur serveur."
    });
  }
};