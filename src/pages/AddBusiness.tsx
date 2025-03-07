import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Link as LinkIcon, 
  ImagePlus,
  Clock,
  Info,
  ListChecks,
  Upload,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { fetchCategories, fetchSubcategories, createBusiness } from "@/services/apiService";
import { assertArray } from "@/utils/typeGuards";
import { Category, Subcategory, BusinessInput, BusinessCreate } from "@/types";
import { supportedLanguages } from "@/contexts/LanguageContext";

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
  
  const categories = assertArray<Category>(categoriesData);
  
  const { data: subcategoriesData } = useQuery({
    queryKey: ['subcategories', category_id],
    queryFn: () => fetchSubcategories(Number(category_id)),
    enabled: !!category_id && category_id !== ""
  });
  
  const subcategories = assertArray<Subcategory>(subcategoriesData);
  
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{t("addBusiness.title")}</h1>
      <p className="text-gray-600 mb-8">{t("addBusiness.subtitle")}</p>
      
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <div className="flex flex-col items-center">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
              activeStep >= 1 ? "bg-primary text-white" : "bg-gray-200 text-gray-600"
            }`}>
              <Info className="h-5 w-5" />
            </div>
            <span className="text-sm mt-2">{t("addBusiness.steps.basicInfo")}</span>
          </div>
          <div className="h-1 flex-grow mx-2 bg-gray-200">
            <div className={`h-full bg-primary ${activeStep >= 2 ? "w-full" : "w-0"}`}></div>
          </div>
          <div className="flex flex-col items-center">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
              activeStep >= 2 ? "bg-primary text-white" : "bg-gray-200 text-gray-600"
            }`}>
              <MapPin className="h-5 w-5" />
            </div>
            <span className="text-sm mt-2">{t("addBusiness.steps.contact")}</span>
          </div>
          <div className="h-1 flex-grow mx-2 bg-gray-200">
            <div className={`h-full bg-primary ${activeStep >= 3 ? "w-full" : "w-0"}`}></div>
          </div>
          <div className="flex flex-col items-center">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
              activeStep >= 3 ? "bg-primary text-white" : "bg-gray-200 text-gray-600"
            }`}>
              <ListChecks className="h-5 w-5" />
            </div>
            <span className="text-sm mt-2">{t("addBusiness.steps.additional")}</span>
          </div>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-3xl mx-auto">
          <Card className="mb-8">
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
              )}
              
              {activeStep === 2 && (
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
              )}
              
              {activeStep === 3 && (
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
                <Button type="button" onClick={goToNextStep}>
                  {t("general.next")}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? t("general.submitting") : t("addBusiness.submitBusiness")}
                </Button>
              )}
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default AddBusiness;
