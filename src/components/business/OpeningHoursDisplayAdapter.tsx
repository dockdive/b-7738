
import React from 'react';
import OpeningHoursDisplay from './OpeningHoursDisplay';

interface OpeningHoursDisplayAdapterProps {
  openingHours: string | Record<string, string>;
  className?: string;
}

// This component adapts different formats of opening hours to be used with OpeningHoursDisplay
const OpeningHoursDisplayAdapter: React.FC<OpeningHoursDisplayAdapterProps> = ({ 
  openingHours,
  className 
}) => {
  // Handle string format (convert to object if needed)
  const formattedHours: Record<string, string> = 
    typeof openingHours === 'string' 
      ? { default: openingHours } 
      : openingHours;
  
  return <OpeningHoursDisplay openingHours={formattedHours} className={className} />;
};

export default OpeningHoursDisplayAdapter;
