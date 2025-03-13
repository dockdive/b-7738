
import { UseFormReturn } from 'react-hook-form';

export interface ContactDetailsStepProps {
  form?: UseFormReturn<any>; // Make optional for backward compatibility
  // Backward compatibility for EditBusiness.tsx
  formData?: any;
  updateFormData?: (data: any) => void;
  onBack?: () => void;
  onNext?: () => void;
}

export default ContactDetailsStepProps;
