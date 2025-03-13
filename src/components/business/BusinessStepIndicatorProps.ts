
export interface BusinessStepIndicatorProps {
  activeStep?: number; // Support both activeStep and currentStep for compatibility
  currentStep?: number; // Added for backward compatibility
  totalSteps?: number;
}

export default BusinessStepIndicatorProps;
