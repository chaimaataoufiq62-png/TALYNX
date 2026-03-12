const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
exports.register = async (req, res) => {
  const {
    email,
    motDePasse,
    type,
    nom,
    prenom,
    nomEntreprise
  } = req.body;

  if (!email || !motDePasse || !type) {
    return res.status(400).json({
      message: "Email, mot de passe et type sont obligatoires."
    });
  }

  if (type !== "candidat" && type !== "entreprise") {
    return res.status(400).json({
      message: "Le type doit être 'candidat' ou 'entreprise'."
    });
  }

  if (type === "candidat" && (!nom || !prenom)) {
    return res.status(400).json({
      message: "Nom et prénom sont obligatoires pour un candidat."
    });
  }

  if (type === "entreprise" && !nomEntreprise) {
    return res.status(400).json({
      message: "Le nom de l'entreprise est obligatoire."
    });
  }

  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [existingUsers] = await connection.execute(
      "SELECT id FROM utilisateur WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      await connection.rollback();
      return res.status(400).json({
        message: "Cet email existe déjà."
      });
    }

    const hashedPassword = await bcrypt.hash(motDePasse, 10);

    const [userResult] = await connection.execute(
      `
      INSERT INTO utilisateur (email, motDePasse, type)
      VALUES (?, ?, ?)
      `,
      [email, hashedPassword, type]
    );

    const utilisateurId = userResult.insertId;

    if (type === "candidat") {
      await connection.execute(
        `
        INSERT INTO candidat (nom, prenom, utilisateur_id)
        VALUES (?, ?, ?)
        `,
        [nom, prenom, utilisateurId]
      );
    }

    if (type === "entreprise") {
      await connection.execute(
        `
        INSERT INTO entreprise (nomEntreprise, utilisateur_id)
        VALUES (?, ?)
        `,
        [nomEntreprise, utilisateurId]
      );
    }

    await connection.commit();

    return res.status(201).json({
      message: "Inscription réussie.",
      utilisateur: {
        id: utilisateurId,
        email,
        type
      }
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    console.error("Erreur register :", error);
    return res.status(500).json({
      message: "Erreur serveur lors de l'inscription."
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};
exports.login = async (req, res) => {
  const { email, motDePasse } = req.body;

  if (!email || !motDePasse) {
    return res.status(400).json({
      message: "Email et mot de passe sont obligatoires."
    });
  }

  try {
    const [users] = await db.execute(
      "SELECT * FROM utilisateur WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: "Utilisateur non trouvé."
      });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(motDePasse, user.motDePasse);

    if (!isMatch) {
      return res.status(401).json({
        message: "Mot de passe incorrect."
      });
    }

    let profile = null;

    if (user.type === "candidat") {
      const [candidats] = await db.execute(
        "SELECT id, nom, prenom FROM candidat WHERE utilisateur_id = ?",
        [user.id]
      );

      if (candidats.length > 0) {
        profile = candidats[0];
      }
    }

    if (user.type === "entreprise") {
      const [entreprises] = await db.execute(
        "SELECT id, nomEntreprise FROM entreprise WHERE utilisateur_id = ?",
        [user.id]
      );

      if (entreprises.length > 0) {
        profile = entreprises[0];
      }
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        type: user.type
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Connexion réussie.",
      token,
      utilisateur: {
        id: user.id,
        email: user.email,
        type: user.type,
        profile
      }
    });
  } catch (error) {
    console.error("Erreur login :", error);
    return res.status(500).json({
      message: "Erreur serveur lors de la connexion."
    });
  }
};