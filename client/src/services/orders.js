import api from './api';

export const getOrders = () => api.get('/api/orders').then(res => res.data);
export const getOrderById = (id) => api.get(`/api/orders/${id}`).then(res => res.data);
export const createOrder = (data) => api.post('/api/orders', data).then(res => res.data);
export const updateOrder = (id, data) => api.put(`/api/orders/${id}`, data).then(res => res.data);
export const deleteOrder = (id) => api.delete(`/api/orders/${id}`);
