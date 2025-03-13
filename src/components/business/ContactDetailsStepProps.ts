
import { BusinessFormData } from '@/types/business';

export interface ContactDetailsStepProps {
  formData?: BusinessFormData;
  updateFormData?: (data: Partial<BusinessFormData>) => void;
  onBack?: () => void;
  onNext?: () => void;
}
