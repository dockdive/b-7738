
import React from 'react';
import OpeningHoursDisplay from '@/components/business/OpeningHoursDisplay';
import { OpeningHoursDisplayProps } from './OpeningHoursDisplayProps';

// Define props interface that matches what the component expects
interface OpeningHoursWrapperProps {
  hours: Record<string, string> | undefined;
}

// Create a wrapper component for OpeningHoursDisplay
const OpeningHoursDisplayWrapper: React.FC<OpeningHoursWrapperProps> = ({ hours }) => {
  if (!hours || Object.keys(hours).length === 0) {
    return <p className="text-gray-500">No opening hours available</p>;
  }

  // Pass the hours prop to OpeningHoursDisplay with the correct typing
  return (
    <div className="opening-hours-container">
      <OpeningHoursDisplay hours={hours} />
    </div>
  );
};

export default OpeningHoursDisplayWrapper;
