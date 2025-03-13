import { BusinessFormData } from '@/types/business';

export interface BasicInfoStepProps {
  formData?: BusinessFormData;
  updateFormData?: (data: Partial<BusinessFormData>) => void;
  onNext?: () => void;
}
