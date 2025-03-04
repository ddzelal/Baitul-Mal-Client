import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name?: string) {
  if (!name) return "";

  const nameParts = name.split(" ");
  if (nameParts.length >= 2) {
    return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`;
  }
  return name.charAt(0);
}

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("sr-RS", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
