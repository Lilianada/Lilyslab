import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date for display in the UI with Month Day, Year format
 */
export function formatDate(dateString: string | Date | undefined) {
  if (!dateString) {
    return "N/A";
  }
  
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    
    if (isNaN(date.getTime())) {
      return "N/A";
    }
    
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  } catch {
    return "N/A";
  }
}

/**
 * Safely parse and format dates to ISO string - used primarily for content sorting
 * and storing standardized dates in data files
 */
export function safeFormatDate(dateValue: string | Date | undefined): string {
  if (!dateValue) return new Date().toISOString();
  
  try {
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    
    if (isNaN(date.getTime())) {
      return new Date().toISOString();
    }
    
    return date.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

/**
 * Format a date string to a compact display format (dd-mm-yyyy)
 */
export function formatDateForDisplay(dateStr: string): string {
  if (!dateStr) {
    return "n/a";
  }

  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return "n/a";
    }
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  } catch {
    return "n/a";
  }
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
