"use client";

import type React from 'react';
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AddTaskFormProps {
  onAddTask: (text: string) => void;
}

export function AddTaskForm({ onAddTask }: AddTaskFormProps) {
  const [taskText, setTaskText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskText.trim()) {
      onAddTask(taskText.trim());
      setTaskText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
        placeholder="What needs to be done?"
        className="flex-grow"
        aria-label="New task"
      />
      <Button type="submit" aria-label="Add task">
        <Plus className="mr-2 h-4 w-4" /> Add Task
      </Button>
    </form>
  );
}
