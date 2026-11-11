import { StateGraph } from "@langchain/langgraph";
import { agentState } from "./state.js";
import { router } from "./router.js";
import { chatAgent } from "../agents/chatAgent.js";
import { codingAgent } from "../agents/codingAgent.js";
import { imageGenAgent } from "../agents/imageGenAgent.js";
import { searchAgent } from "../agents/searchAgent.js";

const graph = new StateGraph(agentState)

graph.addNode("router",router)
graph.addNode("chat",chatAgent)
graph.addNode("coding",codingAgent)
graph.addNode("vision",imageGenAgent)
graph.addNode("search",searchAgent)

graph.addEdge("__start__","router")
graph.addConditionalEdges("router", (state) => {
    if(state.agent==="chat") return "chat"
    if(state.agent==="coding") return "coding"
    if(state.agent==="vision") return "vision"
    if(state.agent==="search") return "search"
},{
    chat: "chat",
    coding: "coding",
    vision: "vision",
    search: "search"
})
graph.addEdge("search","chat")
graph.addEdge("chat","__end__")
graph.addEdge("coding","__end__")
graph.addEdge("vision","__end__")
graph.addEdge("coding","__end__")

export const compiledGraph = graph.compile()
