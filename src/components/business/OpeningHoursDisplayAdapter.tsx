
import React from 'react';
import OpeningHoursDisplay from './OpeningHoursDisplay';

interface OpeningHoursDisplayAdapterProps {
  hours: Record<string, string>;
  className?: string;
}

// This adapter component converts a Record<string, string> to a proper ReactNode
// to fix the type error in BusinessDetail.tsx
const OpeningHoursDisplayAdapter: React.FC<OpeningHoursDisplayAdapterProps> = ({ 
  hours, 
  className 
}) => {
  return <OpeningHoursDisplay hours={hours} className={className} />;
};

export default OpeningHoursDisplayAdapter;
