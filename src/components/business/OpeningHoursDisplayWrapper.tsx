
import React from 'react';
import OpeningHoursDisplay from '@/components/business/OpeningHoursDisplay';

// Define props interface that matches what OpeningHoursDisplay expects
interface OpeningHoursWrapperProps {
  hours: Record<string, string> | undefined;
}

// Get the actual component to understand its prop requirements
const OpeningHoursDisplayWrapper: React.FC<OpeningHoursWrapperProps> = ({ hours }) => {
  if (!hours || Object.keys(hours).length === 0) {
    return <p className="text-gray-500">No opening hours available</p>;
  }

  // Pass hours as a prop directly to the component
  return (
    <div className="opening-hours-container">
      <OpeningHoursDisplay hours={hours} />
    </div>
  );
};

export default OpeningHoursDisplayWrapper;
