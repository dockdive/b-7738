
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface UploadResultProps {
  result: {
    success: boolean;
    message: string;
    count?: number;
  } | null;
}

const UploadResult: React.FC<UploadResultProps> = ({ result }) => {
  const { t } = useLanguage();
  
  if (!result) return null;
  
  return (
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
  );
};

export default UploadResult;
