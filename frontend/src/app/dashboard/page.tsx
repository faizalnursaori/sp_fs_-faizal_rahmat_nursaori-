"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { projectService, authService } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";
import type { Project } from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push("/login");
      return;
    }

    const fetchProjects = async () => {
      try {
        const data: Project[] = await projectService.getProjects();
        setProjects(data);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        if (errorMessage.includes("401") || errorMessage.includes("Unauthorized")) {
          authService.logout();
          router.push("/login");
          return;
        }
        toast.error("Failed to fetch projects");
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [router]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Projects</h1>
          <Button disabled>
            <PlusIcon className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="h-40 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Projects</h1>
        <div className="flex gap-2">
          <Link href="/projects/new">
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </Link>
          <Button
            variant="ghost"
            onClick={() => {
              authService.logout();
              router.push("/login");
            }}
          >
            Logout
          </Button>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">You don&apos;t have any projects yet.</p>
          <Link href="/projects/new" className="mt-4 inline-block">
            <Button variant="outline">
              <PlusIcon className="mr-2 h-4 w-4" />
              Create Your First Project
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <CardDescription>
                    {project.description || "No description provided"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Created: {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
