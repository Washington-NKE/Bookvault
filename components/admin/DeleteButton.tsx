'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface DeleteButtonProps {
  userId: string;
  onDelete: (userId: string) => Promise<void>;
}

export const DeleteButton = ({ userId, onDelete }: DeleteButtonProps) => {
  const handleDelete = async () => {
    try {
      await onDelete(userId);
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={handleDelete}
      variant="ghost"
      size="icon"
      className="text-red-500 hover:text-red-700"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
};