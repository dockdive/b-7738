
import { UseFormReturn } from 'react-hook-form';

export interface AdditionalDetailsStepProps {
  form?: UseFormReturn<any>; // Make optional for backward compatibility
  services?: string[];
  serviceInput?: string;
  setServiceInput?: (value: string) => void;
  handleAddService?: () => void;
  handleRemoveService?: (index: number) => void;
  // Backward compatibility for EditBusiness.tsx
  formData?: any;
  updateFormData?: (data: any) => void;
  onBack?: () => void;
  onSubmit?: () => void;
}

export default AdditionalDetailsStepProps;
