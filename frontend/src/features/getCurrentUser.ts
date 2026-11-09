import api from "../lib/axios"

const getCurrentUser = async () => {
  try {
    const {data} = await api.get("/auth/me")
    return data
  } catch (error) {
    console.error("Error fetching current user:", error)
    return null
  }
}

export default getCurrentUser