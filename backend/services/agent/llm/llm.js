import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";

export const llm = new ChatOpenAI({
  model: "openai/gpt-oss-120b",
  temperature: 0,
  apiKey: process.env.GROQ_API_KEY,

  configuration: {
    baseURL: "https://api.groq.com/openai/v1",
  },
});



