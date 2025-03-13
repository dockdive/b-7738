import React from 'react';
import CSVUploaderPatch from '@/components/CSVUploaderPatch';
import { CSVResult } from '@/types/csv';
import { ProgressCallback } from '@/types/business';

// This adapter component fixes the TypeScript issues in CSVUploader
const CSVUploaderAdapter: React.FC<{
  entityType: string;
  onSuccess?: (result: CSVResult) => void;
  onError?: (error: string) => void;
}> = ({ entityType, onSuccess, onError }) => {
  // Fix the error handling to match the correct property name
  const handleError = (result: CSVResult) => {
    if (onError && result.error) {
      onError(result.error);
    }
  };

  // Process progress callback properly
  const handleProgress = (progress: number) => {
    console.log(`Upload progress: ${progress}%`);
    return progress; // Just return the progress value, not using it as a string
  };

  return (
    <CSVUploaderPatch 
      entityType={entityType}
      onSuccess={onSuccess}
      onError={handleError as any}
      progressCallback={handleProgress}
    />
  );
};

export default CSVUploaderAdapter;
