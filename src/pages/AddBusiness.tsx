
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchCategories, fetchSubcategories, createBusiness } from "@/services/apiService";
import { assertArray } from "@/utils/typeGuards";
import { BusinessCreate } from "@/types";

// Import our new components
import BusinessStepIndicator from "@/components/business/BusinessStepIndicator";
import BasicInfoStep from "@/components/business/BasicInfoStep";
import ContactDetailsStep from "@/components/business/ContactDetailsStep";
import AdditionalDetailsStep from "@/components/business/AdditionalDetailsStep";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Business name must be at least 2 characters.",
  }),
  category_id: z.string().min(1, {
    message: "Please select a category.",
  }),
  subcategory_id: z.string().optional(),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  services: z.array(z.string()).optional(),
  address: z.string().min(1, {
    message: "Address is required.",
  }),
  city: z.string().min(1, {
    message: "City is required.",
  }),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().min(1, {
    message: "Country is required.",
  }),
  phone: z.string().optional(),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  website: z.string().url({
    message: "Please enter a valid URL.",
  }).optional().or(z.literal("")),
  opening_hours: z.string().optional(),
  primary_language: z.string().min(1, {
    message: "Please select a primary language.",
  }),
  additional_languages: z.array(z.string()).optional(),
  is_featured: z.boolean().default(false),
  agreed_to_terms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const AddBusiness = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeStep, setActiveStep] = useState(1);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [serviceInput, setServiceInput] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category_id: "",
      subcategory_id: "",
      description: "",
      services: [],
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      phone: "",
      email: "",
      website: "",
      opening_hours: "",
      primary_language: "en",
      additional_languages: [],
      is_featured: false,
      agreed_to_terms: false,
    },
  });
  
  const category_id = form.watch("category_id");
  
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });
  
  const categories = assertArray(categoriesData);
  
  const { data: subcategoriesData } = useQuery({
    queryKey: ['subcategories', category_id],
    queryFn: () => fetchSubcategories(Number(category_id)),
    enabled: !!category_id && category_id !== ""
  });
  
  const subcategories = assertArray(subcategoriesData);
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleAddService = () => {
    if (serviceInput.trim() && !services.includes(serviceInput.trim())) {
      const updatedServices = [...services, serviceInput.trim()];
      setServices(updatedServices);
      form.setValue("services", updatedServices);
      setServiceInput("");
    }
  };
  
  const handleRemoveService = (index: number) => {
    const updatedServices = services.filter((_, i) => i !== index);
    setServices(updatedServices);
    form.setValue("services", updatedServices);
  };
  
  const goToNextStep = () => {
    if (activeStep === 1) {
      form.trigger(["name", "category_id", "description"]);
      if (
        !form.formState.errors.name &&
        !form.formState.errors.category_id &&
        !form.formState.errors.description
      ) {
        setActiveStep(2);
      }
    } else if (activeStep === 2) {
      form.trigger(["address", "city", "country", "email"]);
      if (
        !form.formState.errors.address &&
        !form.formState.errors.city &&
        !form.formState.errors.country &&
        !form.formState.errors.email
      ) {
        setActiveStep(3);
      }
    }
  };
  
  const goToPreviousStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };
  
  const onSubmit = async (values: FormValues) => {
    if (!values.agreed_to_terms) {
      toast({
        title: t("addBusiness.termsRequired"),
        description: t("addBusiness.pleaseAgreeToTerms"),
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const businessData: BusinessCreate = {
        name: values.name,
        category_id: Number(values.category_id),
        subcategory_id: values.subcategory_id ? Number(values.subcategory_id) : null,
        description: values.description,
        address: values.address,
        city: values.city,
        state: values.state || null,
        zip: values.zip || null,
        country: values.country,
        phone: values.phone || null,
        email: values.email,
        website: values.website || null,
        owner_id: '',
        status: "pending",
        is_featured: values.is_featured,
        logo_url: null,
        latitude: null,
        longitude: null
      };
      
      const result = await createBusiness(businessData);
      
      toast({
        title: t("addBusiness.submissionSuccessful"),
        description: t("addBusiness.businessUnderReview"),
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting business:", error);
      toast({
        title: t("addBusiness.submissionFailed"),
        description: t("addBusiness.pleaseTryAgain"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div 
      className="min-h-screen bg-cover bg-center pt-8 pb-16" 
      style={{ 
        backgroundImage: "url('/lovable-uploads/4894803f-1792-4467-b635-ac19a05864b6.png')",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        backgroundBlendMode: "overlay"
      }}
    >
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">{t("addBusiness.title")}</h1>
        <p className="text-gray-600 mb-8">{t("addBusiness.subtitle")}</p>
        
        <div className="mb-8">
          <BusinessStepIndicator activeStep={activeStep} />
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-3xl mx-auto">
            <Card className="mb-8 glass-card">
              <CardHeader>
                <CardTitle>
                  {activeStep === 1 && t("addBusiness.steps.basicInfo")}
                  {activeStep === 2 && t("addBusiness.steps.contact")}
                  {activeStep === 3 && t("addBusiness.steps.additional")}
                </CardTitle>
                <CardDescription>
                  {activeStep === 1 && t("addBusiness.steps.basicInfoDesc")}
                  {activeStep === 2 && t("addBusiness.steps.contactDesc")}
                  {activeStep === 3 && t("addBusiness.steps.additionalDesc")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {activeStep === 1 && (
                  <BasicInfoStep
                    form={form}
                    categories={categories}
                    subcategories={subcategories}
                    logoPreview={logoPreview}
                    handleLogoChange={handleLogoChange}
                  />
                )}
                
                {activeStep === 2 && (
                  <ContactDetailsStep form={form} />
                )}
                
                {activeStep === 3 && (
                  <AdditionalDetailsStep
                    form={form}
                    services={services}
                    serviceInput={serviceInput}
                    setServiceInput={setServiceInput}
                    handleAddService={handleAddService}
                    handleRemoveService={handleRemoveService}
                  />
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                {activeStep > 1 ? (
                  <Button type="button" variant="outline" onClick={goToPreviousStep}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    {t("general.previous")}
                  </Button>
                ) : (
                  <div></div>
                )}
                
                {activeStep < 3 ? (
                  <Button type="button" onClick={goToNextStep} className="button-primary">
                    {t("general.next")}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting} className="button-primary">
                    {isSubmitting ? t("general.submitting") : t("addBusiness.submitBusiness")}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddBusiness;
