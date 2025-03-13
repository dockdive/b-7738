
import { UseFormReturn } from 'react-hook-form';

export interface BasicInfoStepProps {
  form?: UseFormReturn<any>; // Make optional for backward compatibility
  // Backward compatibility for EditBusiness.tsx
  formData?: any;
  updateFormData?: (data: any) => void;
  onNext?: () => void;
}

export default BasicInfoStepProps;
