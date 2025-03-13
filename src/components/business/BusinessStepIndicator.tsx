
import React from 'react';
import { Info, MapPin, ListChecks } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface BusinessStepIndicatorProps {
  activeStep: number;
}

const BusinessStepIndicator: React.FC<BusinessStepIndicatorProps> = ({ activeStep }) => {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-between max-w-3xl mx-auto">
      <div className="flex flex-col items-center">
        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
          activeStep >= 1 ? "bg-primary text-white" : "bg-gray-200 text-gray-600"
        }`}>
          <Info className="h-5 w-5" />
        </div>
        <span className="text-sm mt-2">{t("addBusiness.steps.basicInfo")}</span>
      </div>
      <div className="h-1 flex-grow mx-2 bg-gray-200">
        <div className={`h-full bg-primary ${activeStep >= 2 ? "w-full" : "w-0"} transition-all duration-300`}></div>
      </div>
      <div className="flex flex-col items-center">
        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
          activeStep >= 2 ? "bg-primary text-white" : "bg-gray-200 text-gray-600"
        }`}>
          <MapPin className="h-5 w-5" />
        </div>
        <span className="text-sm mt-2">{t("addBusiness.steps.contact")}</span>
      </div>
      <div className="h-1 flex-grow mx-2 bg-gray-200">
        <div className={`h-full bg-primary ${activeStep >= 3 ? "w-full" : "w-0"} transition-all duration-300`}></div>
      </div>
      <div className="flex flex-col items-center">
        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
          activeStep >= 3 ? "bg-primary text-white" : "bg-gray-200 text-gray-600"
        }`}>
          <ListChecks className="h-5 w-5" />
        </div>
        <span className="text-sm mt-2">{t("addBusiness.steps.additional")}</span>
      </div>
    </div>
  );
};

export default BusinessStepIndicator;
