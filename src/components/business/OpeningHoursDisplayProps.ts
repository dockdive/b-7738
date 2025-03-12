
/**
 * Props for the OpeningHoursDisplay component
 */
export interface OpeningHoursDisplayProps {
  hours: Record<string, string>;
  openingHours?: Record<string, string>; // Alternative prop name for backward compatibility
}
