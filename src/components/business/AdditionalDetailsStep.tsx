
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { supportedLanguages } from '@/constants/languageConstants';

interface AdditionalDetailsStepProps {
  form: UseFormReturn<any>;
  services: string[];
  serviceInput: string;
  setServiceInput: (value: string) => void;
  handleAddService: () => void;
  handleRemoveService: (index: number) => void;
}

const AdditionalDetailsStep: React.FC<AdditionalDetailsStepProps> = ({
  form,
  services,
  serviceInput,
  setServiceInput,
  handleAddService,
  handleRemoveService
}) => {
  const { t } = useLanguage();

  return (
    <>
      <div>
        <FormLabel>{t("addBusiness.services")}</FormLabel>
        <div className="flex items-center gap-2 mt-2">
          <Input
            value={serviceInput}
            onChange={(e) => setServiceInput(e.target.value)}
            placeholder={t("addBusiness.servicesPlaceholder")}
            className="flex-grow"
          />
          <Button type="button" onClick={handleAddService}>
            {t("addBusiness.addService")}
          </Button>
        </div>
        <FormDescription className="mt-2">
          {t("addBusiness.servicesDescription")}
        </FormDescription>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center"
            >
              <span>{service}</span>
              <button
                type="button"
                className="ml-2 text-primary/70 hover:text-primary focus:outline-none"
                onClick={() => handleRemoveService(index)}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="primary_language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("addBusiness.primaryLanguage")}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("addBusiness.selectLanguage")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {supportedLanguages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div> 
          <FormField
            control={form.control}
            name="is_featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    {t("addBusiness.featuredListing")}
                  </FormLabel>
                  <FormDescription>
                    {t("addBusiness.featuredListingDescription")}
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
      
      <FormField
        control={form.control}
        name="agreed_to_terms"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                {t("addBusiness.agreeToTerms")}
              </FormLabel>
              <FormDescription>
                {t("addBusiness.agreeToTermsDescription")}
              </FormDescription>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
    </>
  );
};

export default AdditionalDetailsStep;
