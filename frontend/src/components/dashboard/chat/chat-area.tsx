"use client";

import { cn } from "cn";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {useEffect } from "react";
import getMessages from "@/features/message/getMessages";
import { setMessages } from "@/redux/messageSlice";
import {ChatHeader} from "./chat-header";



export function ChatArea() {
 const dispatch = useDispatch();
 const {selectedConversation} = useSelector((state: RootState) => state.conversations);
 const {Messages} = useSelector((state: RootState) => state.messages);
 
 useEffect(() =>{
  const fetchMessages = async () => {
    if(selectedConversation){
      try {
        const data = await getMessages(selectedConversation._id)
        dispatch(setMessages(data))
      } catch (error) {
        console.log("Error fetching messages:", error);
      }
    }

  }
  fetchMessages();
  
 },[selectedConversation])
  return (
    (selectedConversation) ? ( 
    <section className="flex-1 flex flex-col gap-4">
      <ChatHeader/>
      {Messages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          No messages yet. Start the conversation!
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-4">
            {/* Chat messages will go here */}
          </div>
      </ScrollArea>
      )}
    </section>
    ) : (
      <div className={cn("flex-1 flex items-center justify-center text-muted-foreground")}>
        Select a conversation to start chatting
      </div>
    )
  );
}
export default ChatArea;
