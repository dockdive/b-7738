
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Progress } from "@/components/ui/progress";

interface ProgressIndicatorProps {
  isUploading: boolean;
  isLoading: boolean;
  progress: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  isUploading, 
  isLoading, 
  progress 
}) => {
  const { t } = useLanguage();
  
  if (!isUploading && !isLoading) return null;
  
  return (
    <div className="space-y-2">
      <Progress value={progress} />
      <p className="text-sm text-center">
        {progress}% {isUploading ? t('csvUpload.uploading') : t('csvUpload.loading')}
      </p>
    </div>
  );
};

export default ProgressIndicator;
