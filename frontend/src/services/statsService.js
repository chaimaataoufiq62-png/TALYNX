import api from "./api";

// Statistiques candidat
export const getCandidateStats = async () => {
  const response = await api.get("/stats/candidate");
  return response.data;
};

// Statistiques entreprise
export const getCompanyStats = async () => {
  const response = await api.get("/stats/company");
  return response.data;
};

// Statistiques globales admin / plateforme si elles existent
export const getGlobalStats = async () => {
  const response = await api.get("/stats/global");
  return response.data;
};