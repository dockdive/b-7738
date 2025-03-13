
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Grid, List, Map } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface BusinessViewSelectorProps {
  view: 'grid' | 'list' | 'map';
  onChange: (value: string) => void;
}

const BusinessViewSelector = ({ view, onChange }: BusinessViewSelectorProps) => {
  const { t } = useLanguage();
  
  return (
    <Tabs value={view} onValueChange={onChange}>
      <TabsList>
        <TabsTrigger value="grid" title={t('business.view.grid')}>
          <Grid className="h-4 w-4" />
          <span className="sr-only">{t('business.view.grid')}</span>
        </TabsTrigger>
        <TabsTrigger value="list" title={t('business.view.list')}>
          <List className="h-4 w-4" />
          <span className="sr-only">{t('business.view.list')}</span>
        </TabsTrigger>
        <TabsTrigger value="map" title={t('business.view.map')}>
          <Map className="h-4 w-4" />
          <span className="sr-only">{t('business.view.map')}</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default BusinessViewSelector;
