import axiosClient from './axiosClient.js'

export const adoptionApi = {
  create: (payload) => axiosClient.post('/adopter/adoption-requests', payload).then((r) => r.data),
  mine: () => axiosClient.get('/adopter/adoption-requests').then((r) => r.data),
  owner: () => axiosClient.get('/owner/adoption-requests').then((r) => r.data),
  approve: (id) => axiosClient.patch(`/owner/adoption-requests/${id}/approve`).then((r) => r.data),
  reject: (id, ownerNote) =>
    axiosClient.patch(`/owner/adoption-requests/${id}/reject`, { ownerNote }).then((r) => r.data),
  cancel: (id) => axiosClient.patch(`/adopter/adoption-requests/${id}/cancel`).then((r) => r.data),
  adopterDashboard: () => axiosClient.get('/adopter/dashboard').then((r) => r.data),
  ownerDashboard: () => axiosClient.get('/owner/dashboard').then((r) => r.data),
}
