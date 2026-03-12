const db = require("../config/db");

const db = require("../config/db");

exports.getCompanyProfile = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `
      SELECT *
      FROM entreprise
      WHERE utilisateur_id = ?
      `,
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Profil entreprise introuvable."
      });
    }

    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Erreur getCompanyProfile :", error);
    return res.status(500).json({
      message: "Erreur serveur."
    });
  }
};

exports.updateCompanyProfile = async (req, res) => {
  const {
    nomEntreprise,
    secteur,
    description,
    ville,
    telephone,
    siteWeb
  } = req.body;

  try {
    await db.execute(
      `
      UPDATE entreprise
      SET
        nomEntreprise = ?,
        secteur = ?,
        description = ?,
        ville = ?,
        telephone = ?,
        siteWeb = ?
      WHERE utilisateur_id = ?
      `,
      [
        nomEntreprise || null,
        secteur || null,
        description || null,
        ville || null,
        telephone || null,
        siteWeb || null,
        req.user.id
      ]
    );

    return res.status(200).json({
      message: "Profil entreprise mis à jour avec succès."
    });
  } catch (error) {
    console.error("Erreur updateCompanyProfile :", error);
    return res.status(500).json({
      message: "Erreur serveur."
    });
  }
};
async function getEntrepriseIdByUserId(userId) {
  const [rows] = await db.execute(
    "SELECT id FROM entreprise WHERE utilisateur_id = ?",
    [userId]
  );

  return rows.length ? rows[0].id : null;
}

async function companyOwnsChallenge(userId, challengeId) {
  const [rows] = await db.execute(
    `
    SELECT ch.id
    FROM challenge ch
    JOIN entreprise e ON ch.entreprise_id = e.id
    WHERE ch.id = ? AND e.utilisateur_id = ?
    `,
    [challengeId, userId]
  );

  return rows.length > 0;
}

// 1. Create challenge
exports.createChallenge = async (req, res) => {
  try {
    const { titre, description, date_limite } = req.body || {};

    if (!titre || !description || !date_limite) {
      return res.status(400).json({
        message: "Tous les champs sont obligatoires",
      });
    }

    const userId = req.user.id;

    const [entreprises] = await db.execute(
      "SELECT id FROM entreprise WHERE id_utilisateur = ?",
      [userId]
    );

    if (entreprises.length === 0) {
      return res.status(403).json({ message: "Entreprise introvable" });
    }

    const entrepriseId = entreprises[0].id_entreprise;

    const [result] = await db.execute(
      `INSERT INTO challenge (titre, description, dateFin, id)
       VALUES (?, ?, ?, ?)`,
      [titre, description, dateFin, entrepriseId]
    );

    return res.status(201).json({
      message: "Challenge créé avec succès",
      id_challenge: result.insertId,
    });
  } catch (error) {
    console.error("Erreur createChallenge:", error);
    return res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
};
exports.getCompanyChallenges = async (req, res) => {
  try {
    const entrepriseId = await getEntrepriseIdByUserId(req.user.id);

    if (!entrepriseId) {
      return res.status(404).json({
        message: "Entreprise introuvable."
      });
    }

    const [rows] = await db.execute(
      `
      SELECT *
      FROM challenge
      WHERE entreprise_id = ?
      ORDER BY id DESC
      `,
      [entrepriseId]
    );

    return res.status(200).json(rows);
  } catch (error) {
    console.error("Erreur getCompanyChallenges :", error);
    return res.status(500).json({
      message: "Erreur serveur."
    });
  }
};

exports.getOneCompanyChallenge = async (req, res) => {
  const { challengeId } = req.params;

  try {
    const [rows] = await db.execute(
      `
      SELECT ch.*
      FROM challenge ch
      JOIN entreprise e ON ch.entreprise_id = e.id
      WHERE ch.id = ? AND e.utilisateur_id = ?
      `,
      [challengeId, req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Challenge introuvable ou non autorisé."
      });
    }

    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Erreur getOneCompanyChallenge :", error);
    return res.status(500).json({
      message: "Erreur serveur."
    });
  }
};

exports.updateChallenge = async (req, res) => {
  const { challengeId } = req.params;
  const { titre, description, niveau, dateDebut, dateFin } = req.body;

  try {
    const owns = await companyOwnsChallenge(req.user.id, challengeId);

    if (!owns) {
      return res.status(404).json({
        message: "Challenge introuvable ou non autorisé."
      });
    }

    await db.execute(
      `
      UPDATE challenge
      SET
        titre = ?,
        description = ?,
        niveau = ?,
        dateDebut = ?,
        dateFin = ?
      WHERE id = ?
      `,
      [
        titre || null,
        description || null,
        niveau || null,
        dateDebut || null,
        dateFin || null,
        challengeId
      ]
    );

    return res.status(200).json({
      message: "Challenge mis à jour avec succès."
    });
  } catch (error) {
    console.error("Erreur updateChallenge :", error);
    return res.status(500).json({
      message: "Erreur serveur."
    });
  }
};

exports.deleteChallenge = async (req, res) => {
  const { challengeId } = req.params;

  try {
    const owns = await companyOwnsChallenge(req.user.id, challengeId);

    if (!owns) {
      return res.status(404).json({
        message: "Challenge introuvable ou non autorisé."
      });
    }

    await db.execute(
      "DELETE FROM challenge WHERE id = ?",
      [challengeId]
    );

    return res.status(200).json({
      message: "Challenge supprimé avec succès."
    });
  } catch (error) {
    console.error("Erreur deleteChallenge :", error);
    return res.status(500).json({
      message: "Erreur serveur."
    });
  }
};

// =========================
// COMPETENCES CHALLENGE
// =========================

exports.getChallengeSkills = async (req, res) => {
  const { challengeId } = req.params;

  try {
    const owns = await companyOwnsChallenge(req.user.id, challengeId);

    if (!owns) {
      return res.status(404).json({
        message: "Challenge introuvable ou non autorisé."
      });
    }

    const [skills] = await db.execute(
      `
      SELECT
        chc.id,
        chc.competence_id,
        c.nom AS competenceNom,
        chc.poids
      FROM challenge_competence chc
      JOIN competence c ON chc.competence_id = c.id
      WHERE chc.challenge_id = ?
      ORDER BY c.nom ASC
      `,
      [challengeId]
    );

    return res.status(200).json(skills);
  } catch (error) {
    console.error("Erreur getChallengeSkills :", error);
    return res.status(500).json({
      message: "Erreur serveur."
    });
  }
};

exports.addOrUpdateChallengeSkills = async (req, res) => {
  const { challengeId } = req.params;
  const { skills } = req.body;

  if (!Array.isArray(skills) || skills.length === 0) {
    return res.status(400).json({
      message: "La liste des compétences est invalide."
    });
  }

  let connection;

  try {
    const owns = await companyOwnsChallenge(req.user.id, challengeId);

    if (!owns) {
      return res.status(404).json({
        message: "Challenge introuvable ou non autorisé."
      });
    }

    connection = await db.getConnection();
    await connection.beginTransaction();

    for (const skill of skills) {
      const competenceId = Number(skill.competence_id);
      const poids = Number(skill.poids);

      if (!competenceId || !poids || poids <= 0) {
        await connection.rollback();
        return res.status(400).json({
          message: "Chaque compétence doit avoir un competence_id valide et un poids supérieur à 0."
        });
      }

      const [competenceRows] = await connection.execute(
        "SELECT id FROM competence WHERE id = ?",
        [competenceId]
      );

      if (competenceRows.length === 0) {
        await connection.rollback();
        return res.status(404).json({
          message: `La compétence avec id ${competenceId} est introuvable.`
        });
      }

      await connection.execute(
        `
        INSERT INTO challenge_competence (challenge_id, competence_id, poids)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE poids = VALUES(poids)
        `,
        [challengeId, competenceId, poids]
      );
    }

    await connection.commit();

    return res.status(200).json({
      message: "Compétences du challenge enregistrées avec succès."
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    console.error("Erreur addOrUpdateChallengeSkills :", error);
    return res.status(500).json({
      message: "Erreur serveur."
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

exports.deleteChallengeSkill = async (req, res) => {
  const { challengeId, competenceId } = req.params;

  try {
    const owns = await companyOwnsChallenge(req.user.id, challengeId);

    if (!owns) {
      return res.status(404).json({
        message: "Challenge introuvable ou non autorisé."
      });
    }

    const [result] = await db.execute(
      `
      DELETE FROM challenge_competence
      WHERE challenge_id = ? AND competence_id = ?
      `,
      [challengeId, competenceId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Compétence non trouvée pour ce challenge."
      });
    }

    return res.status(200).json({
      message: "Compétence du challenge supprimée avec succès."
    });
  } catch (error) {
    console.error("Erreur deleteChallengeSkill :", error);
    return res.status(500).json({
      message: "Erreur serveur."
    });
  }
};

// =========================
// ELIGIBILITY
// =========================

exports.getChallengeEligibility = async (req, res) => {
  const { challengeId } = req.params;

  try {
    const owns = await companyOwnsChallenge(req.user.id, challengeId);

    if (!owns) {
      return res.status(404).json({
        message: "Challenge introuvable ou non autorisé."
      });
    }

    const [rows] = await db.execute(
      `
      SELECT *
      FROM challenge_eligibilite
      WHERE challenge_id = ?
      ORDER BY id DESC
      `,
      [challengeId]
    );

    return res.status(200).json(rows);
  } catch (error) {
    console.error("Erreur getChallengeEligibility :", error);
    return res.status(500).json({
      message: "Erreur serveur."
    });
  }
};

exports.addChallengeEligibility = async (req, res) => {
  const { challengeId } = req.params;
  const { criteres } = req.body;

  if (!Array.isArray(criteres) || criteres.length === 0) {
    return res.status(400).json({
      message: "La liste des critères est invalide."
    });
  }

  let connection;

  try {
    const owns = await companyOwnsChallenge(req.user.id, challengeId);

    if (!owns) {
      return res.status(404).json({
        message: "Challenge introuvable ou non autorisé."
      });
    }

    connection = await db.getConnection();
    await connection.beginTransaction();

    for (const critere of criteres) {
      const type_critere = critere.type_critere?.trim();
      const valeur = critere.valeur?.toString().trim();

      if (!type_critere || !valeur) {
        await connection.rollback();
        return res.status(400).json({
          message: "Chaque critère doit contenir type_critere et valeur."
        });
      }

      await connection.execute(
        `
        INSERT INTO challenge_eligibilite (challenge_id, type_critere, valeur)
        VALUES (?, ?, ?)
        `,
        [challengeId, type_critere, valeur]
      );
    }

    await connection.commit();

    return res.status(201).json({
      message: "Critères d'éligibilité ajoutés avec succès."
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    console.error("Erreur addChallengeEligibility :", error);
    return res.status(500).json({
      message: "Erreur serveur."
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

exports.deleteChallengeEligibility = async (req, res) => {
  const { challengeId, eligibilityId } = req.params;

  try {
    const owns = await companyOwnsChallenge(req.user.id, challengeId);

    if (!owns) {
      return res.status(404).json({
        message: "Challenge introuvable ou non autorisé."
      });
    }

    const [result] = await db.execute(
      `
      DELETE FROM challenge_eligibilite
      WHERE id = ? AND challenge_id = ?
      `,
      [eligibilityId, challengeId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Critère d'éligibilité introuvable."
      });
    }

    return res.status(200).json({
      message: "Critère supprimé avec succès."
    });
  } catch (error) {
    console.error("Erreur deleteChallengeEligibility :", error);
    return res.status(500).json({
      message: "Erreur serveur."
    });
  }
};