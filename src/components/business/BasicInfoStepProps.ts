
import { UseFormReturn } from 'react-hook-form';

export interface BasicInfoStepProps {
  form: UseFormReturn<any>;
  // Backward compatibility for EditBusiness.tsx
  formData?: any;
  updateFormData?: (data: any) => void;
  onNext?: () => void;
}

export default BasicInfoStepProps;
