import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import useCSVServiceAdapter from '@/hooks/useCSVServiceAdapter';
import UploadResult from '@/components/csv/UploadResult';
import CSVFileInput from '@/components/csv/CSVFileInput';
import LogViewer from '@/components/csv/LogViewer';
import ProgressIndicator from '@/components/csv/ProgressIndicator';
import { CSVResult } from '@/types/csv';
import { ProgressCallback } from '@/types/business';
import logger from '@/services/loggerService';

// This is a patched version to resolve TypeScript errors
interface CSVUploaderProps {
  entityType: string;
  onSuccess?: (result: CSVResult) => void;
  onError?: (result: CSVResult) => void;
  progressCallback?: ProgressCallback;
}

const CSVUploaderPatch: React.FC<CSVUploaderProps> = ({
  entityType,
  onSuccess,
  onError,
  progressCallback
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    count?: number;
  } | null>(null);
  const [showLogs, setShowLogs] = useState(false);
  
  const csvService = useCSVServiceAdapter();

  useEffect(() => {
    logger.info(`CSV Uploader initialized for entity type: ${entityType}`);
  }, [entityType]);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setResult(null);
    logger.info(`File selected: ${file.name}`);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      logger.warn('No file selected');
      return;
    }

    setIsUploading(true);
    setProgress(0);
    setResult(null);

    try {
      const handleProgress = (value: number) => {
        setProgress(value);
        if (progressCallback) {
          progressCallback(value);
        }
      };

      logger.info(`Processing CSV file: ${selectedFile.name}`);
      const result = await csvService.processCSV(
        selectedFile,
        entityType,
        handleProgress
      );

      setIsUploading(false);
      
      if (result.success) {
        logger.info(`CSV import successful: ${result.count || 0} records`);
        setResult({
          success: true,
          message: `Successfully imported ${result.count || 0} ${entityType}(s)`,
          count: result.count
        });
        
        if (onSuccess) {
          onSuccess(result);
        }
      } else {
        logger.error(`CSV import failed: ${result.error || 'Unknown error'}`);
        setResult({
          success: false,
          message: result.error || 'Failed to import CSV file'
        });
        
        if (onError) {
          onError(result);
        }
      }
    } catch (error) {
      logger.error('Error uploading CSV file', error);
      setIsUploading(false);
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
      
      if (onError) {
        onError({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  };

  const handleDownloadTemplate = () => {
    try {
      logger.info(`Downloading template for ${entityType}`);
      const blob = csvService.downloadTemplate(entityType);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${entityType}_template.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      logger.error('Error downloading template', error);
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to download template'
      });
    }
  };

  const handleLoadSampleData = async () => {
    setIsLoading(true);
    setProgress(0);
    setResult(null);
    
    try {
      const handleProgress = (value: number) => {
        setProgress(value);
        if (progressCallback) {
          progressCallback(value);
        }
      };
      
      logger.info(`Loading sample data for ${entityType}`);
      
      let result;
      if (entityType === 'business') {
        result = await csvService.loadSampleBusinessData(handleProgress);
      } else {
        result = await csvService.loadSampleData(entityType, 5);
      }
      
      setIsLoading(false);
      
      if (result.success) {
        logger.info(`Sample data loaded successfully: ${result.count || 0} records`);
        setResult({
          success: true,
          message: `Successfully loaded ${result.count || 0} sample ${entityType}(s)`,
          count: result.count
        });
        
        if (onSuccess) {
          onSuccess(result);
        }
      } else {
        logger.error(`Failed to load sample data: ${result.error || 'Unknown error'}`);
        setResult({
          success: false,
          message: result.error || 'Failed to load sample data'
        });
        
        if (onError) {
          onError(result);
        }
      }
    } catch (error) {
      logger.error('Error loading sample data', error);
      setIsLoading(false);
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
      
      if (onError) {
        onError({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  };
  
  const toggleLogs = () => {
    setShowLogs(!showLogs);
  };

  return (
    <div className="space-y-6">
      <CSVFileInput
        onFileSelect={handleFileSelect}
        onDownloadTemplate={handleDownloadTemplate}
        onLoadSampleData={handleLoadSampleData}
        onToggleLogs={toggleLogs}
        showLogs={showLogs}
        isLoading={isLoading}
        entityType={entityType as any}
        selectedFile={selectedFile}
      />
      
      {selectedFile && !isUploading && !result && (
        <div className="flex justify-center mt-4">
          <Button onClick={handleUpload} className="w-full sm:w-auto">
            Upload CSV
          </Button>
        </div>
      )}
      
      <ProgressIndicator
        isUploading={isUploading}
        isLoading={isLoading}
        progress={progress}
      />
      
      <UploadResult result={result} />
      
      <LogViewer visible={showLogs} />
    </div>
  );
};

export default CSVUploaderPatch;
