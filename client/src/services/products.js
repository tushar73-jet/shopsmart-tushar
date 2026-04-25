import api from './api';

export const getProducts = () => api.get('/api/products').then(res => res.data);
export const getProductById = (id) => api.get(`/api/products/${id}`).then(res => res.data);
export const createProduct = (data) => api.post('/api/products', data).then(res => res.data);
export const updateProduct = (id, data) => api.put(`/api/products/${id}`, data).then(res => res.data);
export const deleteProduct = (id) => api.delete(`/api/products/${id}`);
