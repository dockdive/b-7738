
export interface AdditionalDetailsStepProps {
  formData?: {
    name?: string;
    description?: string;
    category_id?: any;
    subcategory_id?: any;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
    zip?: string;
    email?: string;
    phone?: string;
    website?: string;
    opening_hours?: Record<string, string>;
    services?: any[];
    logo_url?: string;
  };
  updateFormData?: (data: Partial<any>) => void;
  onBack?: () => void;
  onSubmit?: () => void;
}
