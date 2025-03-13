
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Download, Database, List } from "lucide-react";
import logger from "@/services/loggerService";

interface CSVFileInputProps {
  onFileSelect: (file: File) => void;
  onDownloadTemplate: () => void;
  onLoadSampleData?: () => void;
  onToggleLogs: () => void;
  showLogs: boolean;
  isLoading: boolean;
  entityType: 'business' | 'category' | 'review';
  selectedFile: File | null;
}

const CSVFileInput: React.FC<CSVFileInputProps> = ({
  onFileSelect,
  onDownloadTemplate,
  onLoadSampleData,
  onToggleLogs,
  showLogs,
  isLoading,
  entityType,
  selectedFile
}) => {
  const { t } = useLanguage();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onFileSelect(file);
      logger.info(`File selected: ${file.name} (${file.size} bytes)`);
    }
  };

  return (
    <div className="space-y-4">
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
          onClick={onDownloadTemplate}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          {t('csvUpload.downloadTemplate')}
        </Button>
        
        {entityType === 'business' && onLoadSampleData && (
          <Button 
            variant="outline" 
            onClick={onLoadSampleData}
            disabled={isLoading}
            className="gap-2"
          >
            <Database className="h-4 w-4" />
            {isLoading ? t('csvUpload.loading') : t('csvUpload.loadSampleData')}
          </Button>
        )}
        
        <Button 
          variant="ghost" 
          onClick={onToggleLogs}
          className="gap-2 ml-auto"
        >
          <List className="h-4 w-4" />
          {showLogs ? t('csvUpload.hideLogs') : t('csvUpload.showLogs')}
        </Button>
      </div>
      
      {selectedFile && (
        <div className="p-4 border rounded-md bg-muted/50">
          <p className="font-medium">{selectedFile.name}</p>
          <p className="text-sm text-muted-foreground">{(selectedFile.size / 1024).toFixed(2)} KB</p>
        </div>
      )}
    </div>
  );
};

export default CSVFileInput;
