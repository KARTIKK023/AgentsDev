import api from "../../lib/axios"

const createConversation = async () => {
  try {
    const { data } = await api.get("/chat/create-conversation");
    return data;
  } catch (error) {
    console.error("Error creating conversation:", error);
    return [];
  }
};

export default createConversation;