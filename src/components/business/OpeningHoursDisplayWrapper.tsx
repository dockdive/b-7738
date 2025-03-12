
import React from 'react';
import OpeningHoursDisplay from './OpeningHoursDisplay';
import { OpeningHoursDisplayWrapperProps } from './OpeningHoursDisplayProps';

const OpeningHoursDisplayWrapper: React.FC<OpeningHoursDisplayWrapperProps> = ({ hours }) => {
  if (!hours) {
    return null;
  }
  
  return <OpeningHoursDisplay openingHours={hours} />;
};

export default OpeningHoursDisplayWrapper;
