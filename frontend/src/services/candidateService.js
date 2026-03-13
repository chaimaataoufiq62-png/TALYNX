import api from "./api";

export const getCandidateProfile = async () => {
  const response = await api.get("/candidate/profile");
  return response.data;
};
// Mettre à jour le profil candidat
export const updateCandidateProfile = async (profileData) => {
  const response = await api.put("/candidate/profile", profileData);
  return response.data;
};
// Récupérer les challenges sauvegardés du candidat
export const getSavedChallenges = async () => {
  const response = await api.get("/candidate/challenges/saved");
  return response.data;
};
// Sauvegarder un challenge
export const saveChallenge = async (challengeId) => {
  const response = await api.post(`/candidate/challenges/${challengeId}/save`);
  return response.data;
};
// Retirer un challenge sauvegardé
export const unsaveChallenge = async (challengeId) => {
  const response = await api.delete(`/candidate/challenges/${challengeId}/save`);
  return response.data;
};

// Postuler / soumettre à un challenge
export const submitToChallenge = async (challengeId, submissionData) => {
  const response = await api.post(`/candidate/challenges/${challengeId}/submit`, submissionData);
  return response.data;
};
