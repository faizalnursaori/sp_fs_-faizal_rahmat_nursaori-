"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { taskService, projectService, authService } from "@/lib/api";
import { Task } from "@/lib/types";
import { toast } from "react-hot-toast";
import { KanbanBoard } from "@/components/KanbanBoard";
import { AddTaskModal } from "@/components/AddTaskModal";

export default function ProjectBoardPage() {
  const router = useRouter();
  const { id: projectId } = useParams<{ id: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projectName, setProjectName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = authService.getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    const loadData = async () => {
      try {
        const project = await projectService.getProject(projectId, token);
        const fetchedTasks = await taskService.getTasks(projectId, token);
        setProjectName(project.name);
        setTasks(fetchedTasks);
      } catch (err) {
        toast.error("Failed to load project or tasks");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [projectId, router]);

  const refetchTasks = async () => {
    const token = authService.getToken();
    if (!token) return;
    const updated = await taskService.getTasks(projectId, token);
    setTasks(updated);
  };

  const handleUpdateTask = async (taskId: string, newStatus: Task["status"]) => {
    const token = authService.getToken();
    if (!token) return;

    try {
      await taskService.updateTask(taskId, { status: newStatus }, token);
      const updated = await taskService.getTasks(projectId, token);
      setTasks(updated);
      toast.success("Task updated");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update task");
    }
  };

  if (isLoading) {
    return <p className="text-center py-10">Loading...</p>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">{projectName} — Board</h1>

      <KanbanBoard tasks={tasks} onTaskUpdate={handleUpdateTask} />

      <div className="mt-8 text-center">
        <AddTaskModal projectId={projectId} onTaskAdded={refetchTasks} />
      </div>
    </div>
  );
}
