
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface OpeningHoursDisplayWrapperProps {
  hours: Record<string, string>;
  className?: string;
}

const OpeningHoursDisplayWrapper: React.FC<OpeningHoursDisplayWrapperProps> = ({ hours, className = '' }) => {
  const { t } = useLanguage();
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div className={`space-y-2 ${className}`}>
      {days.map(day => (
        <div key={day} className="flex justify-between">
          <span className="font-medium capitalize">{t(`business.businessDetails.${day}`)}</span>
          <span>{hours[day] || t('business.businessDetails.closed')}</span>
        </div>
      ))}
    </div>
  );
};

export default OpeningHoursDisplayWrapper;
