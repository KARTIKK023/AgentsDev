import api from "../../lib/axios"

const getMessages = async (conversationId: string | number) => {
  try {
    const { data } = await api.get(`/chat/get-messages/${conversationId}`);
    return data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
};

export default getMessages; 