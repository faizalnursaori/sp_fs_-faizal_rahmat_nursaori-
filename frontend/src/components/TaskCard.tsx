import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Task } from "@/lib/types";

export function TaskCard({ task }: { task: Task }) {
  return (
    <Card className="hover:shadow transition">
      <CardHeader>
        <CardTitle className="text-sm">{task.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{task.description}</p>
        <p className="text-xs text-gray-500 mt-2">Assignee: {task.assignee?.email}</p>
      </CardContent>
    </Card>
  );
}
