import { useContext } from "react";
import { AuthContext } from "@/context/auth.context.tsx";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.log("useAuth must be used within AuthProvider");
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
