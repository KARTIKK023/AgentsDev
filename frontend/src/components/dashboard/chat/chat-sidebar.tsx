"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  ChevronLeft,
  MessageSquare,
  Bookmark,
  MoreHorizontal,
  Trash2,
  PenSquare,
  Plus,
} from "lucide-react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import getConversations from "../../../features/conversation/getConversations";
import {
  addConversation,
  removeConversation,
  setConversations,
  setSelectedConversation,
} from "@/redux/conversationSlice";
import createConversation from "@/features/conversation/createConversation";
import { RootState } from "@/redux/store";
import deleteConversation from "@/features/conversation/deleteConversation";

// MOCK DATA: Wire this up to your Redux chat slice later
const MOCK_CHATS = [
  { id: "1", title: "React Component Refactoring", isActive: true },
  { id: "2", title: "Explain Quantum Computing", isActive: false },
  { id: "3", title: "Next.js Middleware Setup", isActive: false },
];

export function ChatSidebar() {
  const [isOpen, setIsOpen] = React.useState(true);
  const pathname = usePathname();

  // REDUX WIRING PLACEHOLDERS:
  const { conversations, selectedConversation } = useSelector(
    (state: RootState) => state.conversations,
  );
  const dispatch = useDispatch();
  useEffect(() => {
    const getChatHistory = async () => {
      const data = await getConversations();
      dispatch(setConversations(data));
    };
    getChatHistory();
  }, []);

  const handleCreateConversation = async () => {
    const newConversation = await createConversation();
    dispatch(addConversation(newConversation));
  };

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      await deleteConversation(conversationId);
      dispatch(removeConversation(conversationId));
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  if (!isOpen) {
    return (
      <div className="flex h-full w-12 flex-col items-center border-r border-border/50 bg-background py-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="ghost"
                size="icon"
                className="mb-4 size-8 text-muted-foreground hover:text-foreground"
                onClick={() => setIsOpen(true)}
              >
                <ChevronRight className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Expand Sidebar</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="flex flex-col gap-2">
          <Button
            type="button"
            onClick={handleCreateConversation}
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-foreground"
          >
            <Plus className="size-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-[300px] shrink-0 flex-col border-r border-border/50 bg-background transition-all duration-300">
      <Tabs defaultValue="recent" className="flex h-full flex-col">
        {/* HEADER */}
        <div className="flex h-12 items-center justify-between border-b border-border/50 px-3">
          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            onClick={() => setIsOpen(false)}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <TabsList className="h-auto bg-transparent p-0 gap-1">
            <TabsTrigger
              value="recent"
              className="rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground data-[state=active]:bg-muted/50 data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              <MessageSquare className="mr-1.5 size-3.5" />
              Recent
            </TabsTrigger>
            <TabsTrigger
              value="saved"
              className="rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground data-[state=active]:bg-muted/50 data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              <Bookmark className="mr-1.5 size-3.5" />
              Saved
            </TabsTrigger>
          </TabsList>
        </div>

        {/* QUICK ACTION: New Chat */}
        <div className="px-3 pt-3">
          <Button
            variant="outline"
            className="h-8 w-full justify-start border-border/50 bg-transparent text-xs text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            onClick={handleCreateConversation}
          >
            <Plus className="mr-2 size-3.5" />
            New Conversation
          </Button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <ScrollArea className="flex-1 px-2 py-3">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <MessageSquare className="mb-3 size-6 text-muted-foreground/30" />
              <p className="text-xs text-muted-foreground">
                No conversations yet. Start a new one!
              </p>
            </div>
          ) : (
            <TabsContent
              value="recent"
              className="m-0 focus-visible:outline-none"
            >
              <div className="flex flex-col gap-0.5">
                {conversations.map((chat, i) => {
                  // In reality, use: const isActive = pathname === `/dashboard/chat/${chat.id}`
                  const isActive = selectedConversation?._id === chat?._id;

                  return (
                    <div
                      key={chat._id}
                      className={`group flex items-center justify-between rounded-md px-2 py-1.5 transition-colors hover:bg-muted/50 ${
                        isActive ? "bg-muted/30" : "transparent"
                      }`}
                    >
                      <div
                        onClick={() => dispatch(setSelectedConversation(chat))}
                        className="flex flex-1 items-center gap-2 overflow-hidden outline-none"
                      >
                        <span
                          className={`truncate text-xs ${isActive ? "font-medium text-foreground" : "text-muted-foreground group-hover:text-foreground/80"}`}
                        >
                          {chat.title}
                        </span>
                        <span
                          className={`ml-auto text-xs ${isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground/80"}`}
                        >
                          {chat.createdAt
                            ? new Date(chat.createdAt).toLocaleString()
                            : ""}
                        </span>
                      </div>

                      {/* Chat Actions Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-6 shrink-0 opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100"
                          >
                            <MoreHorizontal className="size-3.5 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-40 border-border/50"
                        >
                          <DropdownMenuItem 
                            className="text-xs cursor-pointer">
                            <PenSquare className="mr-2 size-3.5 text-muted-foreground" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-border/50" />
                          <DropdownMenuItem
                            className="text-xs text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                            onClick={() => handleDeleteConversation(chat._id)}
                          >
                            <Trash2 className="mr-2 size-3.5" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          )}

          <TabsContent value="saved" className="m-0 focus-visible:outline-none">
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Bookmark className="mb-3 size-6 text-muted-foreground/30" />
              <p className="text-xs text-muted-foreground">
                No saved conversations yet.
              </p>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
