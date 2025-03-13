
export interface BusinessStepIndicatorProps {
  activeStep: number;
  currentStep?: number; // Add for backward compatibility
  onStepClick?: (step: number) => void; // Make optional for backward compatibility
}

export default BusinessStepIndicatorProps;
