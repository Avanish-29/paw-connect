import axiosClient from './axiosClient.js'

export const adminApi = {
  dashboard: () => axiosClient.get('/admin/dashboard').then((r) => r.data),
  users: () => axiosClient.get('/admin/users').then((r) => r.data),
  updateUserStatus: (id, status) =>
    axiosClient.patch(`/admin/users/${id}/status`, { status }).then((r) => r.data),
  pets: (params) => axiosClient.get('/admin/pets', { params }).then((r) => r.data),
  deletePet: (id) => axiosClient.delete(`/admin/pets/${id}`),
  requests: () => axiosClient.get('/admin/adoption-requests').then((r) => r.data),
}
