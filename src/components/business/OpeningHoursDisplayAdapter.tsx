
import React from 'react';
import OpeningHoursDisplay from './OpeningHoursDisplay';

interface OpeningHoursDisplayAdapterProps {
  openingHours: string | Record<string, string>;
}

const OpeningHoursDisplayAdapter: React.FC<OpeningHoursDisplayAdapterProps> = ({ openingHours }) => {
  // Handle string format (convert to object if needed)
  const formattedHours: Record<string, string> = 
    typeof openingHours === 'string' 
      ? { default: openingHours } 
      : openingHours;
  
  return <OpeningHoursDisplay openingHours={formattedHours} />;
};

export default OpeningHoursDisplayAdapter;
