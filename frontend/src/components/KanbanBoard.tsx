"use client";

import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { PlusIcon } from "lucide-react";
import type { TaskStatus } from "@/lib/types";
import type { Task } from "@/lib/types";
import { TaskCard } from "./TaskCard";

type KanbanBoardProps = {
  tasks: Task[];
  onTaskUpdate: (taskId: string, status: TaskStatus) => Promise<void>;
  onAddTask?: (status: TaskStatus) => void;
};

export function KanbanBoard({ tasks, onTaskUpdate, onAddTask }: KanbanBoardProps) {
  const statuses: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDrop = async (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");

    try {
      await onTaskUpdate(taskId, status);
      toast.success(`Task moved to ${status.replace("_", " ")}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update task status");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 py-6">
      {statuses.map((status) => (
        <div
          key={status}
          className="bg-muted rounded-xl p-4 min-h-[300px]"
          onDrop={(e) => handleDrop(e, status)}
          onDragOver={handleDragOver}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold capitalize">{status.replace("_", " ")}</h2>
            {onAddTask && (
              <Button variant="ghost" size="icon" onClick={() => onAddTask(status)}>
                <PlusIcon className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {tasks
              .filter((task) => task.status === status)
              .map((task) => (
                <div key={task.id} draggable onDragStart={(e) => handleDragStart(e, task.id)}>
                  <TaskCard task={task} />
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
