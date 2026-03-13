import api from "./api";

// Candidat - envoyer une soumission pour un challenge
export const createSubmission = async (challengeId, submissionData) => {
  const response = await api.post(`/submissions/challenges/${challengeId}`, submissionData);
  return response.data;
};

// Candidat - voir ses soumissions
export const getMySubmissions = async () => {
  const response = await api.get("/submissions/me");
  return response.data;
};

// Entreprise - voir les soumissions d'un challenge
export const getChallengeSubmissions = async (challengeId) => {
  const response = await api.get(`/submissions/challenges/${challengeId}`);
  return response.data;
};

// Entreprise - voir une soumission précise
export const getSubmissionById = async (submissionId) => {
  const response = await api.get(`/submissions/${submissionId}`);
  return response.data;
};

// Entreprise - changer le statut d'une soumission
export const updateSubmissionStatus = async (submissionId, statusData) => {
  const response = await api.put(`/submissions/${submissionId}/status`, statusData);
  return response.data;
};