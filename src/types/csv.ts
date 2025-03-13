
export interface CSVResult {
  success: boolean;
  data?: any[] | string[][];
  count?: number;
  error?: string; // Changed from errors to error to match the API
}

export interface CSVImportOptions {
  entityType: string;
  onProgress?: (progress: number) => void;
  onSuccess?: (result: CSVResult) => void;
  onError?: (error: string) => void;
}

export interface CSVExportOptions {
  entityType: string;
  filename?: string;
}
