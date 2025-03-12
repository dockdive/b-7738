
import React from 'react';
import { OpeningHoursDisplayProps } from './OpeningHoursDisplayProps';

/**
 * Adapter component that converts opening hours object to JSX
 * to solve the ReactNode type issue
 */
export const OpeningHoursDisplayAdapter: React.FC<OpeningHoursDisplayProps> = ({ 
  hours, 
  openingHours 
}) => {
  // Use either hours or openingHours prop, preferring hours if both are provided
  const displayHours = hours || openingHours || {};
  
  return (
    <div className="opening-hours">
      {Object.entries(displayHours).length > 0 ? (
        <ul className="space-y-1">
          {Object.entries(displayHours).map(([day, time]) => (
            <li key={day} className="flex justify-between">
              <span className="font-medium capitalize">{day}:</span>
              <span>{time}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic">No opening hours available</p>
      )}
    </div>
  );
};

export default OpeningHoursDisplayAdapter;
