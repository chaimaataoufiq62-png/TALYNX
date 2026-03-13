import api from "./api";

// Récupérer toutes les notifications
export const getNotifications = async () => {
  const response = await api.get("/notifications");
  return response.data;
};

// Marquer une notification comme lue
export const markNotificationAsRead = async (notificationId) => {
  const response = await api.put(`/notifications/${notificationId}/read`);
  return response.data;
};

// Marquer toutes les notifications comme lues
export const markAllNotificationsAsRead = async () => {
  const response = await api.put("/notifications/read-all");
  return response.data;
};

// Supprimer une notification
export const deleteNotification = async (notificationId) => {
  const response = await api.delete(`/notifications/${notificationId}`);
  return response.data;
};