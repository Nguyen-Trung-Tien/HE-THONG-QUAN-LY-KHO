import axiosInstance from "./utils/axiosInstance";

const getAllNotifications = async (userId) => {
  const response = await axiosInstance.get(`/notifications/get-all`, {
    params: { userId },
  });
  return response.data;
};

const markAsRead = async (id) => {
  const response = await axiosInstance.put(`/notifications/mark-as-read/${id}`);
  return response.data;
};

const createNotification = async (data) => {
  const response = await axiosInstance.post(`/notifications/create`, data);
  return response.data;
};

const deleteNotification = async (id) => {
  const response = await axiosInstance.delete(`/notifications/delete/${id}`);
  return response.data;
};

export { getAllNotifications, markAsRead, createNotification, deleteNotification };
