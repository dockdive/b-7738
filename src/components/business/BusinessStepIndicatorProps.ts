
export interface BusinessStepIndicatorProps {
  currentStep: number;
  activeStep?: number;
  onStepClick?: (step: number) => void;
}

// Remove default export and use named export to match import usage
export { BusinessStepIndicatorProps };
