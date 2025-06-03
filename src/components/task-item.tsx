"use client";

import type { Task } from "@/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export function TaskItem({ task, onToggleComplete, onDeleteTask }: TaskItemProps) {
  return (
    <div
      className={cn(
        "flex items-center p-3 rounded-md border transition-all duration-200 ease-in-out",
        task.completed ? "bg-card border-l-4 border-accent" : "bg-card hover:bg-secondary/50"
      )}
    >
      <Checkbox
        id={`task-${task.id}`}
        checked={task.completed}
        onCheckedChange={() => onToggleComplete(task.id)}
        aria-labelledby={`task-label-${task.id}`}
        className="mr-3 shrink-0"
      />
      <label
        id={`task-label-${task.id}`}
        htmlFor={`task-${task.id}`}
        className={cn(
          "flex-grow cursor-pointer",
          task.completed ? "line-through text-muted-foreground" : "text-card-foreground"
        )}
      >
        {task.text}
      </label>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDeleteTask(task.id)}
        className="ml-2 shrink-0 text-destructive hover:bg-destructive/10"
        aria-label={`Delete task: ${task.text}`}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
