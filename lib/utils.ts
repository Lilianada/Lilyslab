import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

// New function to format Unix timestamp (seconds) to yy/mm/dd
export function formatTimestampToYYMMDD(timestamp?: number): string | null {
    if (timestamp === undefined || timestamp === null) return null;
    try {
        // Assuming timestamp is Unix epoch *seconds*
        const date = new Date(timestamp * 1000);
        if (isNaN(date.getTime())) {
            console.warn("Invalid date timestamp for formatting:", timestamp);
            return null;
        }
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
        const year = String(date.getFullYear()).slice(-2); // Get last two digits of year
        return `${year}/${month}/${day}`; // Format as yy/mm/dd
    } catch (error) {
        console.error("Error formatting timestamp:", error);
        return null;
    }
}
