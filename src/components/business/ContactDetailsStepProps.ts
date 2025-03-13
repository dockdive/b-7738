
import { UseFormReturn } from 'react-hook-form';

export interface ContactDetailsStepProps {
  form: UseFormReturn<any>;
  // Backward compatibility for EditBusiness.tsx
  formData?: any;
  updateFormData?: (data: any) => void;
  onBack?: () => void;
  onNext?: () => void;
}

export default ContactDetailsStepProps;
