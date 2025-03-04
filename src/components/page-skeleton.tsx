import { Skeleton } from "@/components/ui/skeleton.tsx";
import React from "react";

export const PageSkeleton: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Skeleton className="h-12 w-12 rounded-full" />
    </div>
  );
};
