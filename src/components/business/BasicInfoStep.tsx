
import React, { useState } from 'react';
import { useLanguage } from "@/contexts/LanguageContext";
import { UseFormReturn } from 'react-hook-form';
import { Building2, Upload } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Category, Subcategory } from '@/types';

interface BasicInfoStepProps {
  form: UseFormReturn<any>;
  categories: Category[];
  subcategories: Subcategory[];
  logoPreview: string | null;
  handleLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  form,
  categories,
  subcategories,
  logoPreview,
  handleLogoChange
}) => {
  const { t } = useLanguage();
  const category_id = form.watch("category_id");

  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("addBusiness.businessName")}</FormLabel>
            <FormControl>
              <Input placeholder={t("addBusiness.businessNamePlaceholder")} {...field} />
            </FormControl>
            <FormDescription>
              {t("addBusiness.businessNameDescription")}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("addBusiness.category")}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("addBusiness.selectCategory")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category: Category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {t(`categories.${category.name.toLowerCase().replace(/\s+/g, '')}.name`) || category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {category_id && subcategories && subcategories.length > 0 && (
          <FormField
            control={form.control}
            name="subcategory_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("addBusiness.subcategory")}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("addBusiness.selectSubcategory")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subcategories.map((subcategory: Subcategory) => (
                      <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                        {subcategory.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("addBusiness.description")}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={t("addBusiness.descriptionPlaceholder")}
                className="min-h-32"
                {...field}
              />
            </FormControl>
            <FormDescription>
              {t("addBusiness.descriptionDescription")}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div>
        <FormLabel>{t("addBusiness.companyLogo")}</FormLabel>
        <div className="mt-2 flex items-center gap-4">
          <div className="h-24 w-24 border rounded-md overflow-hidden flex items-center justify-center bg-gray-50">
            {logoPreview ? (
              <img src={logoPreview} alt="Logo preview" className="h-full w-full object-contain" />
            ) : (
              <Building2 className="h-12 w-12 text-gray-300" />
            )}
          </div>
          <div>
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("logo-upload")?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              {t("addBusiness.uploadLogo")}
            </Button>
            <Input
              id="logo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoChange}
            />
            <FormDescription className="mt-2">
              {t("addBusiness.logoDescription")}
            </FormDescription>
          </div>
        </div>
      </div>
    </>
  );
};

export default BasicInfoStep;
