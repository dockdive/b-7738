
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Grid, List, Map } from 'lucide-react';

interface BusinessViewSelectorProps {
  view: 'grid' | 'list' | 'map';
  onChange: (value: string) => void;
}

const BusinessViewSelector = ({ view, onChange }: BusinessViewSelectorProps) => {
  return (
    <Tabs value={view} onValueChange={onChange}>
      <TabsList>
        <TabsTrigger value="grid" title="Grid View">
          <Grid className="h-4 w-4" />
        </TabsTrigger>
        <TabsTrigger value="list" title="List View">
          <List className="h-4 w-4" />
        </TabsTrigger>
        <TabsTrigger value="map" title="Map View">
          <Map className="h-4 w-4" />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default BusinessViewSelector;
