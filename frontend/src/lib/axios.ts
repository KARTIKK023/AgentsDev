import axios from "axios"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally if needed
    return Promise.reject(error)
  }
)

export default api
