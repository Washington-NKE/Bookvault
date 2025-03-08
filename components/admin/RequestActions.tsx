"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

type RequestStatus = 'PENDING' | 'BORROWED' | 'RETURNED' | 'REJECTED';

interface RequestActionsProps {
  requestId: string;
  currentStatus: RequestStatus;
}

const RequestActions = ({ requestId, currentStatus }: RequestActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  
  const handleStatusChange = async (newStatus: RequestStatus) => {
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch(`/api/borrow-requests/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          ...(newStatus === "RETURNED" ? { returnDate: new Date() } : {}),
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update request status");
      }
      
      // Refresh the page to show updated status
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      {error && (
        <div className="text-red-500 text-sm mb-3">{error}</div>
      )}
      
      <div className="flex flex-wrap gap-3">
        {currentStatus === "BORROWED" && (
          <button
            onClick={() => handleStatusChange("RETURNED")}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm disabled:opacity-50"
          >
            {isLoading ? "Processing..." : "Mark as Returned"}
          </button>
        )}
        
        {currentStatus === "PENDING" && (
          <>
            <button
              onClick={() => handleStatusChange("BORROWED")}
              disabled={isLoading}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm disabled:opacity-50"
            >
              {isLoading ? "Processing..." : "Approve & Mark as Borrowed"}
            </button>
            
            <button
              onClick={() => handleStatusChange("REJECTED")}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm disabled:opacity-50"
            >
              {isLoading ? "Processing..." : "Reject Request"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default RequestActions;