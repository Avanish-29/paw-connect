import axiosClient from './axiosClient.js'

export const petApi = {
  list: (params) => axiosClient.get('/pets', { params }).then((r) => r.data),
  getById: (id) => axiosClient.get(`/pets/${id}`).then((r) => r.data),
  ownerList: (params) => axiosClient.get('/owner/pets', { params }).then((r) => r.data),
  create: (payload) => axiosClient.post('/owner/pets', payload).then((r) => r.data),
  update: (id, payload) => axiosClient.put(`/owner/pets/${id}`, payload).then((r) => r.data),
  remove: (id) => axiosClient.delete(`/owner/pets/${id}`),
}
