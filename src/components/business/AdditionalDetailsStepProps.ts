
import { UseFormReturn } from 'react-hook-form';

export interface AdditionalDetailsStepProps {
  form?: UseFormReturn<any>; // Make optional for backward compatibility
  // Backward compatibility for EditBusiness.tsx
  formData?: any;
  updateFormData?: (data: any) => void;
  onBack?: () => void;
  onSubmit?: () => void;
}

export default AdditionalDetailsStepProps;
