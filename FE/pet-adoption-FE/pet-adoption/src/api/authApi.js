import axiosClient from './axiosClient.js'

export const authApi = {
  login: (payload) => axiosClient.post('/auth/login', payload).then((r) => r.data),
  register: (payload) => axiosClient.post('/auth/register', payload).then((r) => r.data),
}

export const userApi = {
  me: () => axiosClient.get('/users/me').then((r) => r.data),
  updateMe: (payload) => axiosClient.put('/users/me', payload).then((r) => r.data),
}
