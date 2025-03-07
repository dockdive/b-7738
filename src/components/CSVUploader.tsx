
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { uploadCSV } from '@/services/csvService';

type CSVUploaderProps = {
  onComplete?: (success: boolean, count: number) => void;
  entityType: 'business' | 'category' | 'review';
};

const CSVUploader: React.FC<CSVUploaderProps> = ({ onComplete, entityType }) => {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    count?: number;
  } | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setProgress(0);
    setResult(null);

    try {
      const result = await uploadCSV(file, entityType, (progress) => {
        setProgress(progress);
      });
      
      setResult({
        success: true,
        message: t('csvUpload.successMessage', { count: result.count.toString() }),
        count: result.count
      });
      
      if (onComplete) {
        onComplete(true, result.count);
      }
    } catch (error) {
      console.error('CSV upload error:', error);
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
    // This would download the template for the specific entity type
    const templates = {
      business: '/templates/business_template.csv',
      category: '/templates/category_template.csv',
      review: '/templates/review_template.csv'
    };
    
    window.open(templates[entityType], '_blank');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t('csvUpload.title')}</CardTitle>
        <CardDescription>{t('csvUpload.description', { entityType: t(`csvUpload.entityTypes.${entityType}`) })}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => document.getElementById('csv-upload')?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
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
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            {t('csvUpload.downloadTemplate')}
          </Button>
        </div>
        
        {file && (
          <div className="p-4 border rounded-md bg-muted/50">
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
          </div>
        )}
        
        {isUploading && (
          <div className="space-y-2">
            <Progress value={progress} />
            <p className="text-sm text-center">{progress}% {t('csvUpload.uploading')}</p>
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
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleUpload} 
          disabled={!file || isUploading}
          className="w-full"
        >
          {isUploading 
            ? t('csvUpload.uploading') 
            : t('csvUpload.uploadButton')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CSVUploader;
