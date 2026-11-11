import api from "../../lib/axios";

export interface SendMessagePayload {
  prompt: string;
  conversationId: string;
}

const sendMessage = async (payload: SendMessagePayload) => {
  const { data } = await api.post("/agent/chat", payload);
  return data as string;
};

export default sendMessage;