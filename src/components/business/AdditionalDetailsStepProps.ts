
import { UseFormReturn } from 'react-hook-form';

export interface AdditionalDetailsStepProps {
  form: UseFormReturn<any>;
  services: string[];
  serviceInput: string;
  setServiceInput: (value: string) => void;
  handleAddService: () => void;
  handleRemoveService: (index: number) => void;
}

export default AdditionalDetailsStepProps;
