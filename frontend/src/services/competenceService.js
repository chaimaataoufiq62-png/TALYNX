import api from "./api";

// Récupérer toutes les compétences
export const getAllCompetences = async () => {
  const response = await api.get("/competences");
  return response.data;
};

// Récupérer les compétences du candidat connecté
export const getCandidateCompetences = async () => {
  const response = await api.get("/competences/candidate");
  return response.data;
};

// Ajouter une compétence au candidat
export const addCandidateCompetence = async (competenceData) => {
  const response = await api.post("/competences/candidate", competenceData);
  return response.data;
};

// Modifier une compétence du candidat
export const updateCandidateCompetence = async (competenceId, competenceData) => {
  const response = await api.put(`/competences/candidate/${competenceId}`, competenceData);
  return response.data;
};

// Supprimer une compétence du candidat
export const deleteCandidateCompetence = async (competenceId) => {
  const response = await api.delete(`/competences/candidate/${competenceId}`);
  return response.data;
};