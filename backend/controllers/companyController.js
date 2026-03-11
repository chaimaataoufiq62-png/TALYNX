const db = require("../config/db");



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
      return res.status(403).json({ message: "Entreprise non trouvée" });
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

// 2. View candidates by challenge
exports.getCandidatesByChallenge = async (req, res) => {
  const challengeId = req.params.id;

  try {
    const [rows] = await db.execute(
      `SELECT 
          p.id_participation,
          p.date_participation,
          c.id_candidat,
          c.nom,
          c.prenom,
          u.email,
          r.id,
          r.contenu,
          r.note,
          r.commentaire
       FROM participation p
       JOIN candidat c ON p.id_candidat = c.id_candidat
       JOIN utilisateur u ON c.id_utilisateur = u.id_utilisateur
       LEFT JOIN reponse r ON p.id_participation = r.id_participation
       WHERE p.id_challenge = ?`,
      [challengeId]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("Erreur getCandidatesByChallenge:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 3. Evaluate response
exports.evaluateResponse = async (req, res) => {
  const responseId = req.params.id;
  const { note, commentaire } = req.body;

  try {
    if (note === undefined || note === null) {
      return res.status(400).json({ message: "La note est obligatoire" });
    }

    const [result] = await db.execute(
      `UPDATE reponse
       SET note = ?, commentaire = ?
       WHERE id_reponse = ?`,
      [note, commentaire || null, responseId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Réponse non trouvée" });
    }

    res.status(200).json({ message: "Réponse évaluée avec succès" });
  } catch (error) {
    console.error("Erreur evaluateResponse:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};