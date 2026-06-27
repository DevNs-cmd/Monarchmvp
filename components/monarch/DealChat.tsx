"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const participants = ["A. Laurent", "K. Singh", "J. Park", "M. Chen"];

export default function DealChat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, sender: "A. Laurent", text: "Share updated projections by EOD." },
    { id: 2, sender: "K. Singh", text: "Boardroom slots available Thursday." },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, sender: "You", text: message.trim() },
    ]);
    setMessage("");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <Card className="space-y-4">
        <p className="text-xs uppercase tracking-[0.3em] text-secondary">Participants</p>
        <div className="space-y-3 text-sm text-foreground">
          {participants.map((name) => (
            <div key={name} className="flex items-center justify-between">
              <span>{name}</span>
              <span className="h-2 w-2 rounded-full bg-accent/70" />
            </div>
          ))}
        </div>
      </Card>
      <Card className="flex h-full flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto pr-2">
          {messages.map((msg) => (
            <div key={msg.id} className="space-y-1">
              <p className="text-xs uppercase tracking-[0.3em] text-secondary">{msg.sender}</p>
              <p className="text-sm text-foreground">{msg.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Secure note"
          />
          <Button type="button" onClick={handleSend} className="sm:w-40">
            Send
          </Button>
        </div>
      </Card>
    </div>
  );
}
