import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/items';

export const inventoryApi = {
  getAll: (query) =>
    axios.get(API_BASE, { params: query ? { query } : {} }).then((res) => res.data),

  getLowStock: () =>
    axios.get(`${API_BASE}/low-stock`).then((res) => res.data),

  getById: (id) =>
    axios.get(`${API_BASE}/${id}`).then((res) => res.data),

  create: (item) =>
    axios.post(API_BASE, item).then((res) => res.data),

  update: (id, item) =>
    axios.put(`${API_BASE}/${id}`, item).then((res) => res.data),

  remove: (id) =>
    axios.delete(`${API_BASE}/${id}`),
};
