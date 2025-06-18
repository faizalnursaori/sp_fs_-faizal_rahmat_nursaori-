"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrashIcon, PencilIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { taskService, authService } from "@/lib/api";
import type { Task } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function TaskCard({
  task,
  onDeleted,
  onUpdated,
}: {
  task: Task;
  onDeleted?: (id: string) => void;
  onUpdated?: (task: Task) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description);
  }, [task.title, task.description]);

  const handleDelete = async () => {
    const token = authService.getToken();
    if (!token) return;

    try {
      await taskService.deleteTask(task.id, token);
      toast.success("Task deleted");
      onDeleted?.(task.id);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete task");
    }
  };

  const handleUpdate = async () => {
    const token = authService.getToken();
    if (!token) return;

    if (!title.trim()) {
      toast.error("Title cannot be empty");
      return;
    }

    try {
      setLoading(true);
      const updated = await taskService.updateTask(task.id, { title, description }, token);
      toast.success("Task updated");
      onUpdated?.(updated);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update task");
      setTitle(task.title);
      setDescription(task.description);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="hover:shadow transition">
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div className="flex-1">
          {isEditing ? (
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          ) : (
            <CardTitle className="text-sm">{task.title}</CardTitle>
          )}
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
            <PencilIcon className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDelete}>
            <TrashIcon className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {isEditing ? (
          <>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            <Button onClick={handleUpdate} size="sm" disabled={loading}>
              Save
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">{task.description}</p>
            <p className="text-xs text-gray-500 mt-2">Assignee: {task.assignee?.email}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
