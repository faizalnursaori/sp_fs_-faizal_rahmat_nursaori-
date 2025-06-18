"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { authService, projectService } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { InviteMemberModal } from "@/components/InviteMemberModal";
import { toast } from "react-hot-toast";

export default function ProjectSettingsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = authService.getToken();

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchProject = async () => {
      try {
        const data = await projectService.getProject(id, token);
        setName(data.name);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load project");
        router.push("/dashboard");
      }
    };

    fetchProject();
  }, [id, token, router]);

  const handleRename = async () => {
    if (!name.trim()) return;
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      setIsSubmitting(true);
      await projectService.updateProject(id, { name }, token);
      toast.success("Project name updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this project?");
    if (!confirmed) return;

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      await projectService.deleteProject(id, token);
      toast.success("Project deleted");
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete project");
    }
  };

  return (
    <div className="container py-8 space-y-8">
      <h1 className="text-2xl font-bold">Project Settings</h1>

      <div className="space-y-4">
        <Label htmlFor="name">Project Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        <Button onClick={handleRename} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Invite Member</h2>
        <InviteMemberModal projectId={id} />
      </div>

      <div className="pt-8 border-t border-gray-300">
        <h2 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h2>
        <Button variant="destructive" onClick={handleDelete}>
          Delete Project
        </Button>
      </div>
    </div>
  );
}
