import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LogOut, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  uploadCSV,
  generateCSVTemplate,
  loadSampleBusinessData
} from '@/services/csvServiceAdapter';
import logger from '@/services/loggerService';

// Import refactored components
import CSVFileInput from '@/components/csv/CSVFileInput';
import ProgressIndicator from '@/components/csv/ProgressIndicator';
import UploadResult from '@/components/csv/UploadResult';
import LogViewer from '@/components/csv/LogViewer';

type CSVUploaderProps = {
  onComplete?: (success: boolean, count: number) => void;
  entityType: 'business' | 'category' | 'review';
};

const CSVUploader: React.FC<CSVUploaderProps> = ({ onComplete, entityType }) => {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    count?: number;
  } | null>(null);
  const [showLogs, setShowLogs] = useState(false);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setProgress(0);
    setResult(null);

    try {
      logger.info(`Starting upload of file: ${file.name}`);
      const result = await uploadCSV(file, entityType, (progress) => {
        setProgress(progress);
      });
      
      logger.info(`Upload complete: ${result.count} items processed, ${result.errors.length} errors`);
      
      setResult({
        success: true,
        message: t('csvUpload.successMessage', { count: result.count.toString() }),
        count: result.count
      });
      
      if (onComplete) {
        onComplete(true, result.count);
      }
    } catch (error) {
      logger.error('CSV upload failed:', error);
      
      setResult({
        success: false,
        message: typeof error === 'string' 
          ? error 
          : (error as Error)?.message || t('csvUpload.errorGeneric')
      });
      
      if (onComplete) {
        onComplete(false, 0);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadTemplate = () => {
    try {
      logger.info(`Downloading template for entity type: ${entityType}`);
      
      const csvContent = generateCSVTemplate(entityType);
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${entityType}_template.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      logger.info(`Template download successful for entity type: ${entityType}`);
    } catch (error) {
      logger.error('Template download failed:', error);
    }
  };

  const handleLoadSampleData = async () => {
    if (entityType !== 'business') {
      logger.warning('Sample data loading is only available for businesses');
      return;
    }
    
    setIsLoading(true);
    setProgress(0);
    setResult(null);

    try {
      logger.info('Starting sample business data loading');
      
      const result = await loadSampleBusinessData((progress) => {
        setProgress(progress);
      });
      
      logger.info(`Sample data loading complete: ${result.count} items processed, ${result.errors.length} errors`);
      
      setResult({
        success: true,
        message: t('csvUpload.sampleDataMessage', { count: result.count.toString() }),
        count: result.count
      });
      
      if (onComplete) {
        onComplete(true, result.count);
      }
    } catch (error) {
      logger.error('Sample data loading failed:', error);
      
      setResult({
        success: false,
        message: typeof error === 'string' 
          ? error 
          : (error as Error)?.message || t('csvUpload.errorGeneric')
      });
      
      if (onComplete) {
        onComplete(false, 0);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t('csvUpload.title')}</CardTitle>
        <CardDescription>{t('csvUpload.description', { entityType: t(`csvUpload.entityTypes.${entityType}`) })}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <CSVFileInput 
          onFileSelect={handleFileSelect}
          onDownloadTemplate={handleDownloadTemplate}
          onLoadSampleData={handleLoadSampleData}
          onToggleLogs={() => setShowLogs(!showLogs)}
          showLogs={showLogs}
          isLoading={isLoading}
          entityType={entityType}
          selectedFile={file}
        />
        
        <ProgressIndicator 
          isUploading={isUploading} 
          isLoading={isLoading} 
          progress={progress} 
        />
        
        <UploadResult result={result} />
        
        <LogViewer visible={showLogs} />
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleUpload} 
          disabled={!file || isUploading || isLoading}
          className="w-full gap-2"
        >
          {isUploading 
            ? t('csvUpload.uploading') 
            : t('csvUpload.uploadButton')}
          {isUploading ? <LogOut className="h-4 w-4 animate-pulse" /> : <Upload className="h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CSVUploader;
