
import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/context/AuthContext";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, CheckCircle, User, Building } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type UserRole = 'buyer' | 'seller' | 'admin';

const Auth = () => {
  const { isAuthenticated, signIn, signUp, isLoading: authLoading, userProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get("redirect") || "/";
  const initialTab = searchParams.get("signup") === "true" ? "register" : "login";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('buyer');
  const [formError, setFormError] = useState<string | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");

  // Clear form errors when changing tabs
  useEffect(() => {
    setFormError(null);
  }, [activeTab]);

  // Only redirect if user profile is fully loaded
  useEffect(() => {
    if (isAuthenticated && userProfile && !isLoading && !authLoading) {
      navigate(redirectTo);
    }
  }, [isAuthenticated, userProfile, navigate, redirectTo, isLoading, authLoading]);

  // Don't automatically redirect on page load - wait for explicit authentication
  // We'll only show the "Navigate" component after a successful login/signup

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError(null);

    try {
      if (!loginEmail.trim() || !loginPassword.trim()) {
        throw new Error("Please fill in all required fields");
      }

      await signIn(loginEmail, loginPassword);
    } catch (error: any) {
      console.error("Login error:", error);
      setFormError(error.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError(null);

    try {
      // Form validation
      if (!registerEmail.trim() || !registerPassword.trim() || !username.trim() || !confirmPassword.trim()) {
        throw new Error("Please fill in all required fields");
      }

      if (registerPassword !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (registerPassword.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      await signUp(registerEmail, registerPassword, username, selectedRole);
      setShowSuccessDialog(true);
      
      // Reset the form
      setRegisterEmail("");
      setRegisterPassword("");
      setConfirmPassword("");
      setUsername("");
      setSelectedRole('buyer');
    } catch (error: any) {
      console.error("Registration error:", error);
      setFormError(error.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-md mx-auto py-12">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Welcome to Gamana</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Morocco's premium hardware marketplace
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            {formError && (
              <Alert className="mt-4 border-destructive/50 text-destructive">
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                        disabled={isLoading || authLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        disabled={isLoading || authLoading}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isLoading || authLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Create an account</CardTitle>
                  <CardDescription>
                    Enter your details to create a new account
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleRegister}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        placeholder="johndoe"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="name@example.com"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <Input
                        id="register-password"
                        type="password"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        minLength={6}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label>I want to join Gamana as a:</Label>
                      <RadioGroup 
                        value={selectedRole} 
                        onValueChange={(value) => setSelectedRole(value as UserRole)}
                        className="grid grid-cols-1 gap-4 pt-2"
                      >
                        <div>
                          <RadioGroupItem 
                            value="buyer" 
                            id="buyer" 
                            className="peer sr-only" 
                          />
                          <Label 
                            htmlFor="buyer" 
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            <div className="mb-3 rounded-full bg-primary/10 p-2">
                              <User className="h-6 w-6 text-primary" />
                            </div>
                            <div className="space-y-1 text-center">
                              <h3 className="font-semibold">Buyer</h3>
                              <p className="text-sm text-muted-foreground">
                                I want to browse and buy products
                              </p>
                            </div>
                          </Label>
                        </div>

                        <div>
                          <RadioGroupItem 
                            value="seller" 
                            id="seller" 
                            className="peer sr-only" 
                          />
                          <Label 
                            htmlFor="seller" 
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            <div className="mb-3 rounded-full bg-primary/10 p-2">
                              <Building className="h-6 w-6 text-primary" />
                            </div>
                            <div className="space-y-1 text-center">
                              <h3 className="font-semibold">Seller</h3>
                              <p className="text-sm text-muted-foreground">
                                I want to list and sell products
                              </p>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isLoading || authLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Success Dialog */}
          <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
            <DialogContent className="sm:max-w-md">
              <div className="flex flex-col items-center text-center pt-4">
                <div className="rounded-full bg-green-100 p-3 mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <DialogTitle className="text-xl">Account Created Successfully</DialogTitle>
                <DialogDescription className="pt-2 pb-4">
                  Your account has been created. You can now sign in with your credentials.
                </DialogDescription>
                <Button onClick={() => {
                  setShowSuccessDialog(false);
                  setActiveTab("login");
                }}>
                  Go to Login
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;
