
import { BusinessFormData } from '@/types/business';

export interface AdditionalDetailsStepProps {
  formData?: BusinessFormData;
  updateFormData?: (data: Partial<BusinessFormData>) => void;
  onBack?: () => void;
  onSubmit?: () => void;
}
