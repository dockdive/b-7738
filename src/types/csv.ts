
// Define the expected result format for CSV operations
export interface CSVResult {
  success: boolean;
  data?: any[] | string[][];
  count?: number;
  error?: string; // Use error instead of errors to match the actual implementation
}

// Re-export ProgressCallback for use across the application
export type ProgressCallback = (progress: number) => void;
