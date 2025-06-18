"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { projectService, authService } from "@/lib/api";
import { toast } from "react-hot-toast";

export function InviteMemberModal({ projectId }: { projectId: string }) {
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInvite = async () => {
    const token = authService.getToken();
    if (!token || !email) return;

    try {
      setLoading(true);
      await projectService.inviteMember(projectId, email, token);
      toast.success("Member invited!");
      setEmail("");
      setOpen(false);
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "status" in err) {
        const status = (err as { status: number }).status;
        if (status === 404) {
          toast.error("User not found");
        } else if (status === 403) {
          toast.error("Only project owner can invite");
        } else {
          toast.error("Failed to invite member");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Invite Member</Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>
          <DialogDescription>Enter the user email to invite to this project.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
            />
          </div>
          <Button onClick={handleInvite} disabled={loading} className="w-full">
            {loading ? "Inviting..." : "Send Invite"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
