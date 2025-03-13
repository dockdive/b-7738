
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ContactDetailsStepProps {
  form: UseFormReturn<any>;
}

const ContactDetailsStep: React.FC<ContactDetailsStepProps> = ({ form }) => {
  const { t } = useLanguage();

  return (
    <>
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("addBusiness.address")}</FormLabel>
            <FormControl>
              <Input placeholder={t("addBusiness.addressPlaceholder")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("addBusiness.city")}</FormLabel>
              <FormControl>
                <Input placeholder={t("addBusiness.cityPlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("addBusiness.state")}</FormLabel>
              <FormControl>
                <Input placeholder={t("addBusiness.statePlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="zip"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("addBusiness.zip")}</FormLabel>
              <FormControl>
                <Input placeholder={t("addBusiness.zipPlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("addBusiness.country")}</FormLabel>
              <FormControl>
                <Input placeholder={t("addBusiness.countryPlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("addBusiness.phone")}</FormLabel>
              <FormControl>
                <Input placeholder={t("addBusiness.phonePlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("addBusiness.email")}</FormLabel>
              <FormControl>
                <Input placeholder={t("addBusiness.emailPlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="website"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("addBusiness.website")}</FormLabel>
            <FormControl>
              <Input placeholder={t("addBusiness.websitePlaceholder")} {...field} />
            </FormControl>
            <FormDescription>
              {t("addBusiness.websiteDescription")}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="opening_hours"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("addBusiness.openingHours")}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={t("addBusiness.openingHoursPlaceholder")}
                {...field}
              />
            </FormControl>
            <FormDescription>
              {t("addBusiness.openingHoursDescription")}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default ContactDetailsStep;
