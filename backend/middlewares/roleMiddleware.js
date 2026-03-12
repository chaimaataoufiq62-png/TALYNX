exports.requireRole = (type) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Utilisateur non authentifié."
      });
    }

    if (req.user.type !== type) {
      return res.status(403).json({
        message: "Accès refusé."
      });
    }

    next();
  };
};