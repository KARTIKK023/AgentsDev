import { compiledGraph } from "../graph/graph.js";
import axios from "axios";

export const agent = async (req, res) => {
  try {
    const { prompt, conversationId } = req.body;
    if (!prompt || !conversationId) {
      return res
        .status(400)
        .json({ message: "prompt and conversationId are required" });
    }
    await axios.post(`${process.env.CHAT_SERVICE_URL}/chat/save-message`, {
      conversationId,
      role: "user",
      content: prompt,
    });
    const result = await compiledGraph.invoke({
      prompt,
      conversationId,
    });
    const response = result.aiResponse;
    await axios.post(`${process.env.CHAT_SERVICE_URL}/chat/save-message`, {
      conversationId,
      role: "assistant",
      content: response,
    });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: `agent error ${error}` });
  }
};
