import type React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface InterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dateTime: string, message: string) => void;
  type: "schedule" | "postpone" | "cancel" | "reopen";
}

export function InterviewModal({
  isOpen,
  onClose,
  onSubmit,
  type,
}: InterviewModalProps) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  console.log("date", date);
  console.log("time", time);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dateTime = type === "cancel" ? "" : `${date}T${time}`;
    onSubmit(dateTime, message);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>
            {type === "schedule" && "Schedule Interview"}
            {type === "postpone" && "Postpone Interview"}
            {type === "cancel" && "Cancel Interview"}
            {type === "reopen" && "Reopen Interview"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {type !== "cancel" && (
            <>
              <div>
                <label htmlFor="date">Date</label>
                <Input
                  id="date"
                  type="date"
                  className="text-gray-900"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="time">Time</label>
                <Input
                  id="time"
                  type="time"
                  className="text-gray-900"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
            </>
          )}
          <div>
            <label htmlFor="message">Message</label>
            <Textarea
              id="message"
              className="text-gray-900"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
          <Button type="submit">
            {type === "schedule" && "Schedule"}
            {type === "postpone" && "Postpone"}
            {type === "cancel" && "Cancel"}
            {type === "reopen" && "Reopen"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
