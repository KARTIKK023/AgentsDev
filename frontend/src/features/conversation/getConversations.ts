import api from "../../lib/axios"

const getConversations = async () => {
  try {
    const { data } = await api.post("/chat/get-conversations");
    return data;
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }
};

export default getConversations;