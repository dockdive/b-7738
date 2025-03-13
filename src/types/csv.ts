
import { ProgressCallback } from './business';

export interface CSVResult {
  success: boolean;
  data?: any[];
  count?: number;
  error?: string; // Note: Using error (singular) instead of errors
  message?: string;
}

export interface CSVServiceWrapper {
  parseCSV: (file: File) => Promise<any[]>;
  validateCSV: (records: any[], templateType: string) => Promise<any>;
  importCSV: (records: any[], templateType: string) => Promise<any>;
  downloadTemplate: (templateType: string) => Blob;
  prepareDataForImport: (records: any[], templateType: string) => any[];
  generateExampleData: (templateType: string, count?: number) => any[];
  processCSV: (file: File, templateType: string, onProgress?: ProgressCallback) => Promise<CSVResult>;
  loadSampleData: (templateType: string, count?: number) => Promise<CSVResult>;
}
