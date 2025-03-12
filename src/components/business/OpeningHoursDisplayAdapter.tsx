
import React from 'react';
import { OpeningHoursDisplay } from './OpeningHoursDisplay';

interface OpeningHoursDisplayAdapterProps {
  openingHours: Record<string, string>;
  className?: string;
}

// This component adapts a Record<string, string> to be used as ReactNode
const OpeningHoursDisplayAdapter: React.FC<OpeningHoursDisplayAdapterProps> = ({ 
  openingHours,
  className 
}) => {
  return <OpeningHoursDisplay openingHours={openingHours} className={className} />;
};

export default OpeningHoursDisplayAdapter;
