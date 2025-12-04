import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// เพิ่มตรงนี้ถ้าต้องการใช้จริง
export function createPageUrl(path) {
  return `/dashboard/${path}`;
}
