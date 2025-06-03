"use client";

import { useState, useEffect, useMemo } from "react";
import type { Task, FilterType } from "@/types";
import { AddTaskForm } from "@/components/add-task-form";
import { TaskItem } from "@/components/task-item";
import { TaskFilters } from "@/components/task-filters";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== 'undefined') {
      const savedTasks = localStorage.getItem("tasks");
      return savedTasks ? JSON.parse(savedTasks) : [];
    }
    return [];
  });
  const [filter, setFilter] = useState<FilterType>("all");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks, isMounted]);

  const handleAddTask = (text: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      completed: false,
    };
    setTasks((prevTasks) => [newTask, ...prevTasks]);
  };

  const handleToggleComplete = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const filteredTasks = useMemo(() => {
    if (!isMounted) return []; 
    switch (filter) {
      case "active":
        return tasks.filter((task) => !task.completed);
      case "completed":
        return tasks.filter((task) => task.completed);
      default:
        return tasks;
    }
  }, [tasks, filter, isMounted]);

  const activeTasksCount = useMemo(() => tasks.filter(task => !task.completed).length, [tasks]);
  const completedTasksCount = useMemo(() => tasks.filter(task => task.completed).length, [tasks]);

  if (!isMounted) {
    return (
      <div className="flex flex-col items-center justify-start p-4 sm:p-8 lg:p-12 font-body">
        <div className="w-full max-w-2xl">
          <Card className="shadow-xl rounded-lg">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-3xl sm:text-4xl font-headline text-primary">TaskMaster</CardTitle>
              <CardDescription className="text-sm sm:text-base">Loading tasks...</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start p-4 sm:p-8 lg:p-12">
      <div className="w-full max-w-2xl">
        <Card className="shadow-xl rounded-lg overflow-hidden">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-3xl sm:text-4xl font-headline text-primary">TaskMaster</CardTitle>
            <CardDescription className="text-sm sm:text-base text-muted-foreground">
              Organize your day, one task at a time.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-4 sm:px-6">
            <AddTaskForm onAddTask={handleAddTask} />
            <Separator />
            <TaskFilters currentFilter={filter} onFilterChange={setFilter} />
            <ScrollArea className="h-[300px] sm:h-[350px] lg:h-[400px] pr-3">
              {filteredTasks.length > 0 ? (
                <div className="space-y-3">
                  {filteredTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggleComplete={handleToggleComplete}
                      onDeleteTask={handleDeleteTask}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground pt-8">
                  {filter === "completed" ? "No completed tasks." : (filter === "active" ? "No active tasks." : "No tasks yet. Add one above!")}
                </p>
              )}
            </ScrollArea>
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground justify-center pt-4 pb-4 bg-secondary/30">
            <p>{activeTasksCount} active | {completedTasksCount} completed | {tasks.length} total</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
