
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";

const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hash, setHash] = useState<string | null>(null);
  const [validHash, setValidHash] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    // Extract hash from URL
    const urlHash = window.location.hash;
    const urlParams = new URLSearchParams(urlHash.substring(1));
    const type = urlParams.get('type');
    const accessToken = urlParams.get('access_token');
    
    if (type === 'recovery' && accessToken) {
      setHash(accessToken);
      setValidHash(true);
    } else {
      toast.error(t('auth.resetPassword.invalidLink'));
      setValidHash(false);
    }
  }, [t]);

  const onSubmit = async (data: ResetPasswordForm) => {
    try {
      setIsLoading(true);
      
      if (!hash) {
        throw new Error("No valid reset hash found");
      }
      
      const { error } = await supabase.auth.updateUser({
        password: data.password
      });

      if (error) throw error;
      
      toast.success(t('auth.resetPassword.success'));
      navigate('/auth/signin');
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error(t('auth.resetPassword.error'));
      api.utils.logError(error as Error, "ResetPassword form submission");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('auth.resetPassword.title')}</CardTitle>
          <CardDescription>
            {t('auth.resetPassword.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!validHash ? (
            <div className="text-center p-4">
              <p className="text-red-600 font-medium mb-2">{t('auth.resetPassword.invalidLink')}</p>
              <p className="text-gray-600 mb-4">{t('auth.resetPassword.tryAgain')}</p>
              <Button variant="outline" asChild>
                <Link to="/auth/forgot-password">{t('auth.resetPassword.requestNewLink')}</Link>
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('auth.newPassword')}</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('auth.confirmPassword')}</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? t('common.loading') : t('auth.resetPassword.submit')}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            <Link to="/auth/signin" className="text-primary hover:underline">
              {t('auth.backToSignIn')}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetPassword;
