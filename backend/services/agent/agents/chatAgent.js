import { llm } from "../llm/llm.js";

export const chatAgent = async (state) => {
  const SystemPrompt =
    "You are AI assistant by Devsphere which is by Kartik Chaudhary if asked the owner. youw will help people.";
  const response = await llm.invoke([
    {
      role: "system",
      content: SystemPrompt,
    },
    {
      role: "human",
      content: state.prompt,
    },
  ]);

  return {
    ...state,
    aiResponse: response.content
  }
};
