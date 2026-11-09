import api from "../../lib/axios"

type conversationId = string | number;

const deleteConversation = async (conversationId: conversationId) => {
    try {
        const { data } = await api.delete(`/chat/delete-conversation/${conversationId}`);
        return data;
    } catch (error) {
        console.error("Error deleting conversation:", error);
        throw error;
    }
}

export default deleteConversation;
