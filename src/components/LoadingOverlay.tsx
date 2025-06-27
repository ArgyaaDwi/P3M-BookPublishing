"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const LoadingOverlay = () => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timeout);
  }, [pathname]);
  if (!loading) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="flex space-x-2">
        <div className="w-7 h-7 bg-secondary rounded-full animate-bounce"></div>
        <div className="w-8 h-8 bg-primary rounded-full animate-bounce delay-200"></div>
        <div className="w-7 h-7 bg-secondary rounded-full animate-bounce"></div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
