"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { taskService, authService, projectService } from "@/lib/api";
import { toast } from "react-hot-toast";

interface AddTaskModalProps {
  projectId: string;
  onTaskAdded: () => void;
}

export function AddTaskModal({ projectId, onTaskAdded }: AddTaskModalProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [users, setUsers] = useState<{ id: string; email: string }[]>([]);

  const fetchMembers = async () => {
    const token = authService.getToken();
    if (!token) return;
    try {
      const getMembers = await projectService.getProjectMembers(projectId, token);
      setUsers(getMembers);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const handleSubmit = async () => {
    const token = authService.getToken();
    if (!token || !title || !assigneeId) return;

    try {
      await taskService.createTask(
        projectId,
        {
          title,
          description,
          status: "TODO",
          assigneeId,
        },
        token
      );
      toast.success("Task created!");
      setOpen(false);
      setTitle("");
      setDescription("");
      setAssigneeId("");
      onTaskAdded();
    } catch (err) {
      toast.error("Failed to create task");
      console.error(err);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (val) fetchMembers();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Add Task</Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <DialogDescription>
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </DialogDescription>
          <div>
            <Label>Assign to</Label>
            <select
              className="w-full border border-gray-300 dark:border-gray-700 rounded px-2 py-1"
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
            >
              <option value="">-- Select Member --</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.email}
                </option>
              ))}
            </select>
          </div>
          <Button onClick={handleSubmit} className="w-full">
            Create Task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
