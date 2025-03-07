
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sailboat, Mail, Lock, Loader2 } from 'lucide-react';

type AuthMode = 'signin' | 'signup' | 'reset-password';

const Auth = () => {
  const { signIn, signUp, resetPassword, user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<AuthMode>('signin');
  
  // Parse mode from URL query params
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const modeParam = queryParams.get('mode');
    
    if (modeParam === 'signin' || modeParam === 'signup' || modeParam === 'reset-password') {
      setMode(modeParam);
    }
  }, [location]);
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password);
        
        if (error) throw error;
        
        toast({
          title: 'Welcome back!',
          description: 'You have successfully signed in.',
        });
        
        navigate('/');
      } else if (mode === 'signup') {
        if (password !== confirmPassword) {
          toast({
            variant: 'destructive',
            title: 'Passwords do not match',
            description: 'Please make sure your passwords match.',
          });
          return;
        }
        
        const { error } = await signUp(email, password);
        
        if (error) throw error;
        
        toast({
          title: 'Account created',
          description: 'Your account has been created. You can now sign in.',
        });
        
        setMode('signin');
      } else if (mode === 'reset-password') {
        const { error } = await resetPassword(email);
        
        if (error) throw error;
        
        toast({
          title: 'Password reset email sent',
          description: 'Check your email for a link to reset your password.',
        });
        
        setMode('signin');
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      toast({
        variant: 'destructive',
        title: 'Authentication failed',
        description: error.message || 'An error occurred during authentication.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    navigate(`/auth?mode=${newMode}`);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Sailboat className="h-12 w-12 text-primary" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {mode === 'signin' && t('auth.signIn')}
          {mode === 'signup' && t('auth.signUp')}
          {mode === 'reset-password' && t('auth.resetPassword')}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {mode === 'signin' && (
            <>
              {t('auth.newHere')}{' '}
              <button
                className="font-medium text-primary hover:text-primary-hover focus:outline-none focus:underline transition ease-in-out duration-150"
                onClick={() => switchMode('signup')}
              >
                {t('auth.createAccount')}
              </button>
            </>
          )}
          {mode === 'signup' && (
            <>
              {t('auth.alreadyHaveAccount')}{' '}
              <button
                className="font-medium text-primary hover:text-primary-hover focus:outline-none focus:underline transition ease-in-out duration-150"
                onClick={() => switchMode('signin')}
              >
                {t('auth.signIn')}
              </button>
            </>
          )}
          {mode === 'reset-password' && (
            <>
              Remember your password?{' '}
              <button
                className="font-medium text-primary hover:text-primary-hover focus:outline-none focus:underline transition ease-in-out duration-150"
                onClick={() => switchMode('signin')}
              >
                {t('auth.signIn')}
              </button>
            </>
          )}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email">{t('auth.email')}</Label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {mode !== 'reset-password' && (
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{t('auth.password')}</Label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      className="text-sm font-medium text-primary hover:text-primary-hover focus:outline-none focus:underline transition ease-in-out duration-150"
                      onClick={() => switchMode('reset-password')}
                    >
                      {t('auth.forgotPassword')}
                    </button>
                  )}
                </div>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <Button 
                type="submit" 
                className="w-full flex justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                ) : null}
                {mode === 'signin' && t('auth.signIn')}
                {mode === 'signup' && t('auth.signUp')}
                {mode === 'reset-password' && t('auth.resetPassword')}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full inline-flex justify-center"
                  disabled={true}
                >
                  <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335"/>
                    <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4"/>
                    <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05"/>
                    <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853"/>
                  </svg>
                  <span className="ml-2">Google</span>
                </Button>
              </div>

              <div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full inline-flex justify-center"
                  disabled={true}
                >
                  <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.7903 16.6401C19.7457 16.7183 19.7055 16.7965 19.6608 16.8747C19.1532 17.8543 18.5377 18.7471 17.8085 19.53C17.2866 20.0731 16.8567 20.4588 16.5313 20.6848C16.028 21.029 15.4909 21.2029 14.9253 21.2029C14.5133 21.2029 14.0343 21.1035 13.4923 20.9046C12.9456 20.7057 12.4425 20.6063 11.9746 20.6063C11.4846 20.6063 10.9659 20.7057 10.4282 20.9046C9.89056 21.1035 9.44669 21.2076 9.09384 21.2168C8.55306 21.2353 8.01228 21.0568 7.46842 20.6848C7.11864 20.4403 6.66861 20.0359 6.1138 19.4714C5.5166 18.8654 5.02209 18.1401 4.63366 17.2983C4.21647 16.3917 4 15.5036 4 14.6247C4 13.5923 4.28576 12.7042 4.85959 11.9697C5.29901 11.3868 5.86669 10.9271 6.56261 10.5874C7.25852 10.2477 8.00296 10.0741 8.7937 10.0649C9.23004 10.0649 9.78622 10.1828 10.4638 10.414C11.1368 10.6452 11.5553 10.7631 11.7149 10.7631C11.8365 10.7631 12.3289 10.6221 13.186 10.3447C14.0028 10.0834 14.6938 9.97471 15.263 10.0187C16.7512 10.1366 17.8673 10.7076 18.6113 11.7456C17.2857 12.5316 16.6298 13.6471 16.6432 15.0852C16.6566 16.2068 17.085 17.1181 17.9242 17.8146C18.3004 18.139 18.7147 18.3887 19.167 18.5668C19.3669 18.6477 19.5534 18.7009 19.7457 18.7378C19.761 18.705 19.7768 18.6754 19.7903 18.6413V16.6401ZM15.384 5.05156C15.384 5.91628 15.047 6.72941 14.3778 7.48695C13.5611 8.38047 12.589 8.83738 11.5352 8.77267C11.5219 8.66789 11.5129 8.55694 11.5129 8.43982C11.5129 7.61835 11.8993 6.73318 12.5747 6.00029C12.9119 5.63015 13.3396 5.32138 13.8565 5.0726C14.3733 4.82797 14.8675 4.69632 15.348 4.67791C15.3616 4.80333 15.3683 4.92876 15.3683 5.05156H15.384Z" fill="#000000"/>
                  </svg>
                  <span className="ml-2">Apple</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
