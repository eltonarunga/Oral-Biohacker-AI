// ==================== TIME UTILITIES ====================

/**
 * Formats an ISO string or Date object into a readable time format (e.g., "3:45 PM").
 * @param timestamp The date/time to format.
 * @returns A formatted time string.
 */
export const formatTimestamp = (timestamp: string | Date): string => {
  try {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch (error) {
    console.error("Invalid timestamp for formatting:", timestamp);
    return "Invalid time";
  }
};
