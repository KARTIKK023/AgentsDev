import { ChatSidebar} from "@/components/dashboard/chat/chat-sidebar";
import { ChatArea } from "@/components/dashboard/chat/chat-area";
import { ChatInput } from "@/components/dashboard/chat/chat-input";
import { ChatArtifact } from "@/components/dashboard/chat/chat-artifact";

export function ChatPage() {
    return (
        <div className="flex h-[calc(100dvh-4rem)] overflow-hidden">
            <ChatSidebar />
            <div className="flex flex-1 flex-col">
                <ChatArea />
                <ChatInput />
            </div>
            <ChatArtifact />
        </div>
    );
}