
export interface BusinessStepIndicatorProps {
  currentStep: number;
  activeStep?: number;
  onStepClick?: (step: number) => void;
}

export default BusinessStepIndicatorProps;
