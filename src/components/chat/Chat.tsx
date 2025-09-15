"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Message {
  sender: "Você" | "Oponente";
  text: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "Oponente", text: "Boa sorte, divirta-se!" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { sender: "Você", text: input.trim() }]);
      setInput("");
    }
  };

  useEffect(() => {
    const scrollArea = document.getElementById("chat-scroll-area");
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full gap-4">
      <h3 className="flex items-center gap-2 font-semibold text-lg">
        <MessageSquare className="h-5 w-5" />
        Bate-papo com o Oponente
      </h3>
      <div className="flex-grow flex flex-col gap-4">
        <ScrollArea className="flex-grow h-48 pr-4" id="chat-scroll-area">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-2 ${
                  msg.sender === "Você" ? "justify-end" : ""
                }`}
              >
                {msg.sender === "Oponente" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>O</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg px-3 py-2 text-sm max-w-xs ${
                    msg.sender === "Você"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {msg.text}
                </div>
                {msg.sender === "Você" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>V</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="flex w-full items-center space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Digite uma mensagem..."
          />
          <Button onClick={handleSend} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
