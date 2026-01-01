import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Fungsi untuk menggabungkan class Tailwind dengan aman.
 * Menangani penggabungan kondisional dan konflik class.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}