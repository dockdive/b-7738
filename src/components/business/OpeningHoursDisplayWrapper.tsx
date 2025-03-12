
import React from 'react';
import { OpeningHoursDisplayWrapperProps } from './OpeningHoursDisplayProps';
import OpeningHoursDisplay from './OpeningHoursDisplay';

const OpeningHoursDisplayWrapper: React.FC<OpeningHoursDisplayWrapperProps> = ({ hours }) => {
  return <OpeningHoursDisplay openingHours={hours} />;
};

export default OpeningHoursDisplayWrapper;
