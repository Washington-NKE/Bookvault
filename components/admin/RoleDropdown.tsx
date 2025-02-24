'use client';

import React, {useTransition} from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type UserRole = "ADMIN" | "USER";

interface RoleDropdownProps {
  currentRole: UserRole;
  userId: string;
  onUpdateRole: (userId: string, role: UserRole) => Promise<void>;
}

export const RoleDropdown = ({ currentRole, userId, onUpdateRole }: RoleDropdownProps) => {
  const roles: UserRole[] = ["ADMIN", "USER"];

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  const handleRoleChange = async (newRole: UserRole) => {
    try {
      await onUpdateRole(userId, newRole);
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
      startTransition(() => {
        router.refresh(); 
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
      console.log(error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-24" disabled={isPending}>
          <Badge variant={currentRole === "ADMIN" ? "default" : "secondary"} className={currentRole === "ADMIN" ? "bg-green-200 text-green-600" : "bg-red-200  text-red-800"}>
            {currentRole}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {roles.map((role) => (
          <DropdownMenuItem
            key={role}
            onClick={() => handleRoleChange(role)}
            className="flex justify-between"
          >
            {role}
            {role === currentRole && <Check className="size-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};