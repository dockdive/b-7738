
export interface BusinessStepIndicatorProps {
  activeStep?: number; // Support both activeStep and currentStep for compatibility
  currentStep?: number; // Added for backward compatibility
  totalSteps?: number;
  onStepClick?: (step: number) => void; // Add onStepClick property
}

export default BusinessStepIndicatorProps;
