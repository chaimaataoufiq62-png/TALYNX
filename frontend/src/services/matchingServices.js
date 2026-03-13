import api from "./api";

// Candidate - matching en direct
export const getCandidateMatches = async () => {
  const response = await api.get("/matching/candidate/matches");
  return response.data;
};

// Candidate - résultats sauvegardés
export const getSavedCandidateMatches = async () => {
  const response = await api.get("/matching/candidate/matches/saved");
  return response.data;
};

// Entreprise - matching d'un challenge précis
export const getCompanyChallengeMatches = async (challengeId) => {
  const response = await api.get(`/matching/company/challenges/${challengeId}/matches`);
  return response.data;
};

// Entreprise - résultats sauvegardés d'un challenge
export const getSavedCompanyChallengeMatches = async (challengeId) => {
  const response = await api.get(`/matching/company/challenges/${challengeId}/matches/saved`);
  return response.data;
};

// Sauvegarder un résultat de matching côté candidat
export const saveCandidateMatch = async (matchId) => {
  const response = await api.post(`/matching/candidate/matches/${matchId}/save`);
  return response.data;
};

// Sauvegarder un résultat de matching côté entreprise
export const saveCompanyMatch = async (challengeId, candidateId) => {
  const response = await api.post(`/matching/company/challenges/${challengeId}/candidates/${candidateId}/save`);
  return response.data;
};