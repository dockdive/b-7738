
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AlertCircle } from "lucide-react"; // Using lucide-react instead of @radix-ui/react-icons
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth(); // Removed setSession since it doesn't exist in AuthContext
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // No need to manually set session, Supabase handles this
      
      toast.success(t('auth.loginSuccess') || "Successfully signed in!");
      navigate("/");
    } catch (error: any) {
      console.error("Sign-in error:", error);
      setError(error.message || (t('auth.signInError') || "Failed to sign in"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Helmet>
        <title>{t('auth.signIn')} | DockDive</title>
      </Helmet>
      
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-20">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">{t('auth.signIn') || "Sign In"}</CardTitle>
            <CardDescription>
              {t('auth.signInDescription') || "Enter your credentials to access your account"}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-1">
                <TabsTrigger value="email">{t('auth.emailPassword') || "Email & Password"}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="email">
                <form onSubmit={handleSignIn} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('auth.email') || "Email"}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">{t('auth.password') || "Password"}</Label>
                      <Link 
                        to="/forgot-password"
                        className="text-sm text-primary hover:underline"
                      >
                        {t('auth.forgotPassword') || "Forgot password?"}
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (t('auth.signingIn') || "Signing in...") : (t('auth.signIn') || "Sign In")}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center mt-2">
              {t('auth.noAccount') || "Don't have an account?"}{" "}
              <Link 
                to="/signup"
                className="text-primary hover:underline"
              >
                {t('auth.signUp') || "Sign up"}
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default SignIn;
