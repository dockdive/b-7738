
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const BulkUploadButton = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const handleClick = () => {
    navigate('/bulk-upload');
  };
  
  return (
    <Button 
      onClick={handleClick} 
      variant="outline" 
      className="flex items-center gap-2"
    >
      <Upload size={16} />
      {t('bulkupload.title') || 'Bulk Upload'}
    </Button>
  );
};

export default BulkUploadButton;
