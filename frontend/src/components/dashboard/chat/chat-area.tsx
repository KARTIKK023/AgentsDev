"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { cn } from "@/lib/utils";
import type { RootState } from "@/redux/store";

import getMessages from "@/features/message/getMessages";
import { setMessages } from "@/redux/messageSlice";

import { ChatHeader } from "./chat-header";
import { ChatInput } from "./chat-input";
import { ChatMessages } from "./chat-messages";

export function ChatArea() {
  const dispatch = useDispatch();

  const { selectedConversation } = useSelector((state: RootState) => state.conversations);

  const { Messages } = useSelector((state: RootState) => state.messages);

  useEffect(() => {
    if (!selectedConversation) return;

    let cancelled = false;

    const fetchMessages = async () => {
      try {
        const data = await getMessages(selectedConversation._id);

        if (!cancelled) {
          dispatch(setMessages(data));
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Error fetching messages:", error);
        }
      }
    };

    fetchMessages();

    return () => {
      cancelled = true;
    };
  }, [selectedConversation, dispatch]);

  if (!selectedConversation) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        Select a conversation to start chatting
      </div>
    );
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden">
      {/* Fixed header */}
      <ChatHeader />

      {/* Scrollable messages */}
      <ChatMessages messages={Messages} />

      {/* Fixed input */}
      <div className="shrink-0">
        <ChatInput />
      </div>
    </section>
  );
}

export default ChatArea;
