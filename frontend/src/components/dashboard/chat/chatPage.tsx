
import { ChatSidebar } from "@/components/dashboard/chat/chat-sidebar";
import { ChatArea } from "@/components/dashboard/chat/chat-area";
import { ChatArtifact } from "@/components/dashboard/chat/chat-artifact";

export function ChatPage() {
  return (
    <div className="flex h-[calc(100dvh-4rem)] min-h-0 overflow-hidden">
      <ChatSidebar />

      <div className="flex min-w-0 min-h-0 flex-1 flex-col">
        <ChatArea />
      </div>

      <ChatArtifact />
    </div>
  );
}
