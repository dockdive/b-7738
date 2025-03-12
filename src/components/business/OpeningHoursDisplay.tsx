
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface OpeningHoursDisplayProps {
  openingHours: Record<string, string> | undefined;
}

const OpeningHoursDisplay: React.FC<OpeningHoursDisplayProps> = ({ openingHours }) => {
  const { t } = useLanguage();
  
  if (!openingHours || Object.keys(openingHours).length === 0) {
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
          {t('business.openingHours')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {days.map(day => (
            <div key={day} className="flex justify-between">
              <span className="capitalize font-medium">{t(`business.days.${day}`)}</span>
              <span>{openingHours[day] || t('business.closed')}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OpeningHoursDisplay;
