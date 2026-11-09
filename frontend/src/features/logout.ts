import api from "../lib/axios"


const logout = async () => {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

export default logout;