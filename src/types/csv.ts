
import { ProgressCallback } from '@/utils/csvServiceWrapper';

// Define the expected result format for CSV operations
export interface CSVResult {
  success: boolean;
  data?: any[] | string[][];
  count?: number;
  error?: string;
}

// Re-export ProgressCallback for use across the application
export type { ProgressCallback };
