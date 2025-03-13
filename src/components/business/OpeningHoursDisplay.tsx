
import React from 'react';
import { OpeningHoursDisplayProps } from './OpeningHoursDisplayProps';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const OpeningHoursDisplay: React.FC<OpeningHoursDisplayProps> = ({ 
  openingHours = {}, 
  className = ""
}) => {
  const { t } = useLanguage();
  
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  
  return (
    <div className={cn("space-y-2", className)}>
      {days.map(day => (
        <div key={day} className="flex justify-between">
          <span className="font-medium">{t(`business.businessDetails.${day}`)}</span>
          <span>{openingHours[day] || t('business.businessDetails.closed')}</span>
        </div>
      ))}
    </div>
  );
};

export default OpeningHoursDisplay;
