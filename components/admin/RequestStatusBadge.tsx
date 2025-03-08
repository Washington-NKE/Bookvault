import React from "react";

const RequestStatusBadge = ({ status }: { status: 'BORROWED' | 'RETURNED' | 'PENDING' }) => {
  let bgColor = "";
  let textColor = "";
  
  switch (status) {
    case "BORROWED":
      bgColor = "bg-blue-100";
      textColor = "text-blue-800";
      break;
    case "RETURNED":
      bgColor = "bg-green-100";
      textColor = "text-green-800";
      break;
    case "PENDING":
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-800";
      break;
    default:
      bgColor = "bg-gray-100";
      textColor = "text-gray-800";
  }
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${bgColor} ${textColor}`}>
      {status}
    </span>
  );
};

export default RequestStatusBadge;