
import React from 'react';
import OpeningHoursDisplay from './OpeningHoursDisplay';

interface OpeningHoursDisplayAdapterProps {
  hours: Record<string, string>;
}

/**
 * Adapter component that transforms hours data into a format
 * acceptable by the BusinessDetail component
 */
const OpeningHoursDisplayAdapter: React.FC<OpeningHoursDisplayAdapterProps> = ({ hours }) => {
  return <OpeningHoursDisplay hours={hours} />;
};

export default OpeningHoursDisplayAdapter;
