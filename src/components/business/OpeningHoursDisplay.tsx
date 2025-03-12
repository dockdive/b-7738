
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { OpeningHoursDisplayProps } from './OpeningHoursDisplayProps';

const OpeningHoursDisplay: React.FC<OpeningHoursDisplayProps> = ({ hours, openingHours }) => {
  const { t } = useLanguage();
  
  // Use either hours or openingHours prop, with hours taking precedence
  const displayHours = hours || openingHours || {};
  
  if (Object.keys(displayHours).length === 0) {
    return null;
  }
  
  const days = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
  ];
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          {t('businessDetails.openingHours')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {days.map(day => (
            <div key={day} className="flex justify-between">
              <span className="capitalize font-medium">{t(`businessDetails.${day}`)}</span>
              <span>{displayHours[day] || t('businessDetails.closed')}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OpeningHoursDisplay;
