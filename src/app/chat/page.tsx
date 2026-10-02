import React from "react";
import { ChatInterface } from "@/components/chat/ChatInterface";

export const metadata = {
  title: "AI Market Intelligence Chat — Market Stalker",
  description: "Ask questions and receive institutional AI market insights with verified citations.",
};

export default function ChatPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <ChatInterface />
    </div>
  );
}
