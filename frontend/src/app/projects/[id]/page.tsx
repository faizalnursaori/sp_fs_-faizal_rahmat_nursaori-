"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { taskService, projectService, authService } from "@/lib/api";
import { Task } from "@/lib/types";
import { toast } from "react-hot-toast";
import { KanbanBoard } from "@/components/KanbanBoard";
import { AddTaskModal } from "@/components/AddTaskModal";
import { MoveLeft, Settings } from "lucide-react";
import Link from "next/link";

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

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const handleTaskDeleted = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  if (isLoading) {
    return <p className="text-center py-10">Loading...</p>;
  }

  return (
    <div className="container mx-auto py-8 mb-6">
      <div className="flex items-center justify-between mx-10">
        <Link href="/dashboard">
          <MoveLeft />
        </Link>
        <h1 className="text-2xl font-bold">{projectName} — Board</h1>
        <Link href={`/projects/${projectId}/settings`}>
          <Settings />
        </Link>
      </div>

      <KanbanBoard
        tasks={tasks}
        onTaskUpdate={handleUpdateTask}
        onTaskUpdated={handleTaskUpdated}
        onTaskDeleted={handleTaskDeleted}
      />

      <div className="flex mt-8 justify-center gap-1">
        <AddTaskModal projectId={projectId} onTaskAdded={refetchTasks} />
      </div>
    </div>
  );
}
