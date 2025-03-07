
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, Download, Database, List, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  uploadCSV,
  generateCSVTemplate,
  loadSampleBusinessData
} from '@/services/csvService';
import logger, { getLogs, LogLevel, getLogsByLevel } from '@/services/loggerService';

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
  const [logTab, setLogTab] = useState<LogLevel | 'all'>('all');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      logger.info(`File selected: ${e.target.files[0].name} (${e.target.files[0].size} bytes)`);
    }
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
      
      // Generate the CSV content
      const csvContent = generateCSVTemplate(entityType);
      
      // Create a blob and download link
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

  // Get filtered logs based on current tab
  const filteredLogs = React.useMemo(() => {
    if (logTab === 'all') {
      return getLogs();
    }
    return getLogsByLevel(logTab as LogLevel);
  }, [logTab]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t('csvUpload.title')}</CardTitle>
        <CardDescription>{t('csvUpload.description', { entityType: t(`csvUpload.entityTypes.${entityType}`) })}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => document.getElementById('csv-upload')?.click()}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            {t('csvUpload.selectFile')}
          </Button>
          <Input
            id="csv-upload"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileSelect}
          />
          <Button 
            variant="outline" 
            onClick={handleDownloadTemplate}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            {t('csvUpload.downloadTemplate')}
          </Button>
          
          {entityType === 'business' && (
            <Button 
              variant="outline" 
              onClick={handleLoadSampleData}
              disabled={isLoading}
              className="gap-2"
            >
              <Database className="h-4 w-4" />
              {isLoading ? t('csvUpload.loading') : t('csvUpload.loadSampleData')}
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            onClick={() => setShowLogs(!showLogs)}
            className="gap-2 ml-auto"
          >
            <List className="h-4 w-4" />
            {showLogs ? t('csvUpload.hideLogs') : t('csvUpload.showLogs')}
          </Button>
        </div>
        
        {file && (
          <div className="p-4 border rounded-md bg-muted/50">
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
          </div>
        )}
        
        {(isUploading || isLoading) && (
          <div className="space-y-2">
            <Progress value={progress} />
            <p className="text-sm text-center">{progress}% {isUploading ? t('csvUpload.uploading') : t('csvUpload.loading')}</p>
          </div>
        )}
        
        {result && (
          <Alert variant={result.success ? "default" : "destructive"}>
            {result.success 
              ? <CheckCircle2 className="h-4 w-4" /> 
              : <AlertCircle className="h-4 w-4" />
            }
            <AlertTitle>
              {result.success ? t('csvUpload.success') : t('csvUpload.error')}
            </AlertTitle>
            <AlertDescription>
              {result.message}
            </AlertDescription>
          </Alert>
        )}
        
        {showLogs && (
          <Accordion type="single" collapsible className="mt-4 border rounded-md">
            <AccordionItem value="logs">
              <AccordionTrigger className="px-4">
                {t('csvUpload.logs')} ({filteredLogs.length})
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <Tabs defaultValue="all" onValueChange={(value) => setLogTab(value as LogLevel | 'all')}>
                  <TabsList className="grid grid-cols-5 mb-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="debug">Debug</TabsTrigger>
                    <TabsTrigger value="info">Info</TabsTrigger>
                    <TabsTrigger value="warning">Warning</TabsTrigger>
                    <TabsTrigger value="error">Error</TabsTrigger>
                  </TabsList>
                  
                  <div className="max-h-60 overflow-y-auto border rounded-md p-2 bg-slate-50">
                    {filteredLogs.length > 0 ? (
                      filteredLogs.map((log, index) => (
                        <div 
                          key={index} 
                          className={`text-xs my-1 p-1 ${
                            log.level === LogLevel.ERROR ? 'text-red-600 bg-red-50' :
                            log.level === LogLevel.WARNING ? 'text-amber-600 bg-amber-50' :
                            log.level === LogLevel.INFO ? 'text-blue-600 bg-blue-50' :
                            'text-gray-600 bg-gray-50'
                          } rounded`}
                        >
                          <span className="font-mono">
                            [{new Date(log.timestamp).toLocaleTimeString()}] 
                            [{log.level.toUpperCase()}] {log.message}
                          </span>
                          {log.data && (
                            <pre className="mt-1 whitespace-pre-wrap overflow-x-auto">
                              {typeof log.data === 'object' 
                                ? JSON.stringify(log.data, null, 2) 
                                : log.data
                              }
                            </pre>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-sm text-gray-500 py-4">
                        {t('csvUpload.noLogs')}
                      </p>
                    )}
                  </div>
                </Tabs>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
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
