import axios from 'axios';

const interceptor = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
})

interceptor.interceptors.response.use(
  async (config) => {
    const refreshToken  = localStorage.getItem('refreshToken');

    if (refreshToken) {
      const { data: { accessToken } } = await axios.post(process.env.REFRESH_TOKEN_URL!, {
        refreshToken
      })
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config;
  },
  (error) => Promise.reject(error)
)

export default interceptor;