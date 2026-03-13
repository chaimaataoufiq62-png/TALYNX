import api from "./api";

// Profil entreprise connecté
export const getCompanyProfile = async () => {
  const response = await api.get("/company/profile");
  return response.data;
};

// Mettre à jour le profil entreprise
export const updateCompanyProfile = async (profileData) => {
  const response = await api.put("/company/profile", profileData);
  return response.data;
};

// Créer un challenge
export const createChallenge = async (challengeData) => {
  const response = await api.post("/company/challenges", challengeData);
  return response.data;
};

// Récupérer tous les challenges de l'entreprise
export const getCompanyChallenges = async () => {
  const response = await api.get("/company/challenges");
  return response.data;
};

// Récupérer un challenge précis
export const getCompanyChallengeById = async (challengeId) => {
  const response = await api.get(`/company/challenges/${challengeId}`);
  return response.data;
};

// Modifier un challenge
export const updateChallenge = async (challengeId, challengeData) => {
  const response = await api.put(`/company/challenges/${challengeId}`, challengeData);
  return response.data;
};

// Supprimer un challenge
export const deleteChallenge = async (challengeId) => {
  const response = await api.delete(`/company/challenges/${challengeId}`);
  return response.data;
};