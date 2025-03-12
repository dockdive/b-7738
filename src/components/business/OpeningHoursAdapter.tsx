
import React from 'react';
import OpeningHoursDisplayWrapper from '@/components/business/OpeningHoursDisplayWrapper';

interface OpeningHoursAdapterProps {
  hours?: Record<string, string>;
}

// Adapter component to convert hours to a React node
const OpeningHoursAdapter: React.FC<OpeningHoursAdapterProps> = ({ hours }) => {
  if (!hours) {
    return <p className="text-gray-500">No opening hours available</p>;
  }
  
  return <OpeningHoursDisplayWrapper hours={hours} />;
};

export default OpeningHoursAdapter;
