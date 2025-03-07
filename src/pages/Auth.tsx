
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Mail, Lock, UserPlus, LogIn, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const Auth = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  
  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/");
      }
    };
    
    checkSession();
  }, [navigate]);
  
  const validateForm = () => {
    setError(null);
    
    if (!email) {
      setError(t("validation.emailRequired"));
      return false;
    }
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError(t("validation.invalidEmail"));
      return false;
    }
    
    if (!password) {
      setError(t("validation.passwordRequired"));
      return false;
    }
    
    if (mode === "signup") {
      if (password.length < 8) {
        setError(t("validation.passwordLength"));
        return false;
      }
      
      if (password !== confirmPassword) {
        setError(t("validation.passwordsDoNotMatch"));
        return false;
      }
    }
    
    return true;
  };
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      if (data.session) {
        toast({
          title: t("auth.signInSuccess"),
          description: t("auth.welcomeBack"),
        });
        navigate("/");
      }
    } catch (error: any) {
      setError(error.message || t("auth.signInError"));
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: "",
            last_name: "",
          },
        },
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        toast({
          title: t("auth.signUpSuccess"),
          description: t("auth.checkEmail"),
        });
        
        // Auto sign in (if email confirmation is disabled)
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (!signInError && signInData.session) {
          navigate("/");
        }
      }
    } catch (error: any) {
      setError(error.message || t("auth.signUpError"));
    } finally {
      setLoading(false);
    }
  };
  
  const handlePasswordReset = async () => {
    if (!email) {
      setError(t("validation.emailRequired"));
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: t("auth.passwordResetSent"),
        description: t("auth.checkEmailForReset"),
      });
    } catch (error: any) {
      setError(error.message || t("auth.passwordResetError"));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-160px)] p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {mode === "signin" ? t("auth.signIn") : t("auth.signUp")}
          </CardTitle>
          <CardDescription className="text-center">
            {mode === "signin" 
              ? t("auth.signInDescription") 
              : t("auth.signUpDescription")}
          </CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="signin" value={mode} onValueChange={(v) => setMode(v as "signin" | "signup")}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="signin">{t("auth.signIn")}</TabsTrigger>
            <TabsTrigger value="signup">{t("auth.signUp")}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <form onSubmit={handleSignIn}>
              <CardContent className="space-y-4 pt-6">
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="signin-email">{t("auth.email")}</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">
                      <Mail className="h-4 w-4" />
                    </span>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="email@example.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="signin-password">{t("auth.password")}</Label>
                    <button
                      type="button"
                      className="text-sm text-primary hover:underline"
                      onClick={handlePasswordReset}
                    >
                      {t("auth.forgotPassword")}
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">
                      <Lock className="h-4 w-4" />
                    </span>
                    <Input
                      id="signin-password"
                      type="password"
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("general.loading")}
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      {t("auth.signIn")}
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignUp}>
              <CardContent className="space-y-4 pt-6">
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="signup-email">{t("auth.email")}</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">
                      <Mail className="h-4 w-4" />
                    </span>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="email@example.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">{t("auth.password")}</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">
                      <Lock className="h-4 w-4" />
                    </span>
                    <Input
                      id="signup-password"
                      type="password"
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    {t("auth.passwordRequirements")}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">{t("auth.confirmPassword")}</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">
                      <Lock className="h-4 w-4" />
                    </span>
                    <Input
                      id="confirm-password"
                      type="password"
                      className="pl-10"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("general.loading")}
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      {t("auth.signUp")}
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;
