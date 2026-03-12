const db = require("../config/db");

exports.getCandidateProfile = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `
      SELECT *
      FROM candidat
      WHERE utilisateur_id = ?
      `,
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Profil candidat introuvable."
      });
    }

    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Erreur getCandidateProfile :", error);
    return res.status(500).json({
      message: "Erreur serveur."
    });
  }
};

exports.updateCandidateProfile = async (req, res) => {
  const {
    nom,
    prenom,
    telephone,
    ville,
    dateNaissance,
    ecole,
    diplome,
    specialite,
    niveauEtude,
    bio
  } = req.body;

  try {
    await db.execute(
      `
      UPDATE candidat
      SET
        nom = ?,
        prenom = ?,
        telephone = ?,
        ville = ?,
        dateNaissance = ?,
        ecole = ?,
        diplome = ?,
        specialite = ?,
        niveauEtude = ?,
        bio = ?
      WHERE utilisateur_id = ?
      `,
      [
        nom || null,
        prenom || null,
        telephone || null,
        ville || null,
        dateNaissance || null,
        ecole || null,
        diplome || null,
        specialite || null,
        niveauEtude || null,
        bio || null,
        req.user.id
      ]
    );

    return res.status(200).json({
      message: "Profil candidat mis à jour avec succès."
    });
  } catch (error) {
    console.error("Erreur updateCandidateProfile :", error);
    return res.status(500).json({
      message: "Erreur serveur."
    });
  }
};
exports.getCandidateSkills = async (req, res) => {
  try {
    const [candidateRows] = await db.execute(
      "SELECT id FROM candidat WHERE utilisateur_id = ?",
      [req.user.id]
    );

    if (candidateRows.length === 0) {
      return res.status(404).json({
        message: "Candidat introuvable."
      });
    }

    const candidatId = candidateRows[0].id;

    const [skills] = await db.execute(
      `
      SELECT 
        cc.id,
        cc.competence_id,
        c.nom AS competenceNom,
        cc.niveau
      FROM candidat_competence cc
      JOIN competence c ON cc.competence_id = c.id
      WHERE cc.candidat_id = ?
      ORDER BY c.nom ASC
      `,
      [candidatId]
    );

    return res.status(200).json(skills);
  } catch (error) {
    console.error("Erreur getCandidateSkills :", error);
    return res.status(500).json({
      message: "Erreur serveur."
    });
  }
};

exports.addOrUpdateCandidateSkills = async (req, res) => {
  const { skills } = req.body;

  if (!Array.isArray(skills) || skills.length === 0) {
    return res.status(400).json({
      message: "La liste des compétences est invalide."
    });
  }

  let connection;

  try {
    const [candidateRows] = await db.execute(
      "SELECT id FROM candidat WHERE utilisateur_id = ?",
      [req.user.id]
    );

    if (candidateRows.length === 0) {
      return res.status(404).json({
        message: "Candidat introuvable."
      });
    }

    const candidatId = candidateRows[0].id;

    connection = await db.getConnection();
    await connection.beginTransaction();

    for (const skill of skills) {
      const competenceId = Number(skill.competence_id);
      const niveau = Number(skill.niveau);

      if (!competenceId || !niveau || niveau < 1 || niveau > 5) {
        await connection.rollback();
        return res.status(400).json({
          message: "Chaque compétence doit avoir un competence_id valide et un niveau entre 1 et 5."
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
        INSERT INTO candidat_competence (candidat_id, competence_id, niveau)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE niveau = VALUES(niveau)
        `,
        [candidatId, competenceId, niveau]
      );
    }
await connection.commit();

    return res.status(200).json({
      message: "Compétences candidat enregistrées avec succès."
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    console.error("Erreur addOrUpdateCandidateSkills :", error);
    return res.status(500).json({
      message: "Erreur serveur."
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

exports.deleteCandidateSkill = async (req, res) => {
  const { competenceId } = req.params;

  try {
    const [candidateRows] = await db.execute(
      "SELECT id FROM candidat WHERE utilisateur_id = ?",
      [req.user.id]
    );

    if (candidateRows.length === 0) {
      return res.status(404).json({
        message: "Candidat introuvable."
      });
    }

    const candidatId = candidateRows[0].id;

    const [result] = await db.execute(
      `
      DELETE FROM candidat_competence
      WHERE candidat_id = ? AND competence_id = ?
      `,
      [candidatId, competenceId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Compétence non trouvée pour ce candidat."
      });
    }

    return res.status(200).json({
      message: "Compétence supprimée avec succès."
    });
  } catch (error) {
    console.error("Erreur deleteCandidateSkill :", error);
    return res.status(500).json({
      message: "Erreur serveur."
    });
  }
};