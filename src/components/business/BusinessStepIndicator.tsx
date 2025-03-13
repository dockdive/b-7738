
import React from 'react';
import { Info, MapPin, ListChecks } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import BusinessStepIndicatorProps from './BusinessStepIndicatorProps';

const BusinessStepIndicator: React.FC<BusinessStepIndicatorProps> = ({ 
  activeStep, 
  currentStep, 
  onStepClick 
}) => {
  // Use activeStep if provided, otherwise fall back to currentStep for backward compatibility
  const currentActiveStep = activeStep || currentStep || 1;
  const { t } = useLanguage();

  const handleStepClick = (step: number) => {
    if (onStepClick) {
      onStepClick(step);
    }
  };

  return (
    <div className="flex items-center justify-between max-w-3xl mx-auto">
      <div 
        className="flex flex-col items-center cursor-pointer" 
        onClick={() => handleStepClick(1)}
      >
        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
          currentActiveStep >= 1 ? "bg-primary text-white" : "bg-gray-200 text-gray-600"
        }`}>
          <Info className="h-5 w-5" />
        </div>
        <span className="text-sm mt-2">{t("addBusiness.steps.basicInfo")}</span>
      </div>
      <div className="h-1 flex-grow mx-2 bg-gray-200">
        <div className={`h-full bg-primary ${currentActiveStep >= 2 ? "w-full" : "w-0"} transition-all duration-300`}></div>
      </div>
      <div 
        className="flex flex-col items-center cursor-pointer" 
        onClick={() => handleStepClick(2)}
      >
        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
          currentActiveStep >= 2 ? "bg-primary text-white" : "bg-gray-200 text-gray-600"
        }`}>
          <MapPin className="h-5 w-5" />
        </div>
        <span className="text-sm mt-2">{t("addBusiness.steps.contact")}</span>
      </div>
      <div className="h-1 flex-grow mx-2 bg-gray-200">
        <div className={`h-full bg-primary ${currentActiveStep >= 3 ? "w-full" : "w-0"} transition-all duration-300`}></div>
      </div>
      <div 
        className="flex flex-col items-center cursor-pointer" 
        onClick={() => handleStepClick(3)}
      >
        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
          currentActiveStep >= 3 ? "bg-primary text-white" : "bg-gray-200 text-gray-600"
        }`}>
          <ListChecks className="h-5 w-5" />
        </div>
        <span className="text-sm mt-2">{t("addBusiness.steps.additional")}</span>
      </div>
    </div>
  );
};

export default BusinessStepIndicator;
