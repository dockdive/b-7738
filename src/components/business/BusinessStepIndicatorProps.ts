
export interface BusinessStepIndicatorProps {
  activeStep?: number; // Make optional for backward compatibility
  currentStep?: number; // Add for backward compatibility
  onStepClick?: (step: number) => void; // Make optional for backward compatibility
}

export default BusinessStepIndicatorProps;
