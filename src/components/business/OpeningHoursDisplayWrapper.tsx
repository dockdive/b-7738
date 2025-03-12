
import React from 'react';
import OpeningHoursDisplay from './OpeningHoursDisplay';

interface OpeningHoursDisplayWrapperProps {
  openingHours: Record<string, string>;
}

const OpeningHoursDisplayWrapper: React.FC<OpeningHoursDisplayWrapperProps> = ({ openingHours }) => {
  return <OpeningHoursDisplay openingHours={openingHours} />;
};

export default OpeningHoursDisplayWrapper;
