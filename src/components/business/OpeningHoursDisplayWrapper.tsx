
import React from 'react';
import OpeningHoursDisplay from '@/components/business/OpeningHoursDisplay';

// This component serves as a wrapper to ensure type compatibility
// It accepts Record<string, string> and passes it correctly to OpeningHoursDisplay
interface OpeningHoursDisplayWrapperProps {
  hours: Record<string, string> | undefined;
}

// Make sure we understand the props expected by OpeningHoursDisplay
interface OpeningHoursProps {
  hours: Record<string, string>;
}

const OpeningHoursDisplayWrapper: React.FC<OpeningHoursDisplayWrapperProps> = ({ hours }) => {
  if (!hours || Object.keys(hours).length === 0) {
    return <p className="text-gray-500">No opening hours available</p>;
  }

  // Now correctly pass the hours prop to OpeningHoursDisplay
  return <OpeningHoursDisplay hours={hours} />;
};

export default OpeningHoursDisplayWrapper;
