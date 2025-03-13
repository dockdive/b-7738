
import { ReactNode } from 'react';

export interface OpeningHoursDisplayProps {
  openingHours?: Record<string, string>;
  className?: string;
}

export interface OpeningHoursDisplayWrapperProps {
  hours?: Record<string, string>;
}
