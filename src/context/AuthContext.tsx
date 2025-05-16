
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";
import { toast } from "@/components/ui/use-toast";

// Define user roles type based on the Supabase enum
type UserRole = 'buyer' | 'seller' | 'admin';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string, role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  updateUserRole: (role: UserRole) => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  generateAnonymousSession: () => Promise<void>;
  linkAnonymousAccount: (email: string, password: string, username: string) => Promise<void>;
};

// Define user profile type to match the users table in Supabase
type UserProfile = {
  id: string;
  username: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  city?: string;
  country?: string;
  phone_number?: string;
  role: UserRole;
  is_verified: boolean;
  last_seen: string;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  userProfile: null,
  isLoading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  isAuthenticated: false,
  updateUserRole: async () => {},
  updateProfile: async () => {},
  generateAnonymousSession: async () => {},
  linkAnonymousAccount: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isAuthenticated = !!session;

  // Fetch user profile data from the users table
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        
        // If no profile exists, create one for the authenticated user
        if (error.code === "PGRST116") {
          const authUser = await supabase.auth.getUser();
          
          if (authUser.data?.user) {
            const userData = authUser.data.user;
            const username = userData.user_metadata?.username || 
                            userData.email?.split('@')[0] || 
                            `user_${Math.floor(Math.random() * 100000)}`;
            
            // Create a new profile with data from auth
            const newProfile = {
              id: userId,
              username: username,
              email: userData.email,
              role: (userData.user_metadata?.role as UserRole) || 'buyer',
              is_verified: !!userData.email_confirmed_at,
              last_seen: new Date().toISOString()
            };
            
            const { data: createdProfile, error: createError } = await supabase
              .from("users")
              .insert(newProfile)
              .select()
              .single();
              
            if (createError) {
              console.error("Error creating user profile:", createError);
              return null;
            }
            
            toast({
              title: "Profile created",
              description: "Your user profile has been automatically created."
            });
            
            return createdProfile as UserProfile;
          }
        }
        
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
      return null;
    }
  };

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Update user profile when auth state changes
        if (session?.user) {
          // Using setTimeout to prevent blocking the onAuthStateChange callback
          setTimeout(async () => {
            const profile = await fetchUserProfile(session.user.id);
            setUserProfile(profile);
            updateLastSeen(session.user.id).catch(console.error);
            setIsLoading(false);
          }, 0);
        } else {
          setUserProfile(null);
          setIsLoading(false);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Got existing session:", session);
      setSession(session);
      setUser(session?.user ?? null);
      
      // Fetch user profile if session exists
      if (session?.user) {
        fetchUserProfile(session.user.id).then(profile => {
          setUserProfile(profile);
          updateLastSeen(session.user.id).catch(console.error);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);
  
  // Function to update the user's last_seen timestamp
  const updateLastSeen = async (userId: string) => {
    try {
      await supabase
        .from("users")
        .update({ last_seen: new Date().toISOString() })
        .eq("id", userId);
    } catch (error) {
      console.error("Error updating last_seen:", error);
    }
  };

  // Function to generate a fingerprint for anonymous authentication
  const generateFingerprint = async (): Promise<string> => {
    // Simple fingerprint based on navigator and screen properties
    const fingerprint = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      colorDepth: window.screen.colorDepth,
      pixelRatio: window.devicePixelRatio,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    
    // Convert to string and hash using SubtleCrypto API
    const msgUint8 = new TextEncoder().encode(JSON.stringify(fingerprint));
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  // Generate anonymous session based on device fingerprint
  const generateAnonymousSession = async () => {
    try {
      setIsLoading(true);
      const fingerprintHash = await generateFingerprint();
      
      // Check if we have a matching device fingerprint in the database
      const { data: existingDevice } = await supabase
        .from("device_fingerprints")
        .select("user_id")
        .eq("fingerprint_hash", fingerprintHash)
        .maybeSingle();
      
      if (existingDevice?.user_id) {
        // Instead of using signInWithId (which doesn't exist), 
        // we'll find the user information and sign in with email/password
        const { data, error: getUserError } = await supabase
          .from("users")
          .select("email")
          .eq("id", existingDevice.user_id)
          .maybeSingle();
        
        if (getUserError || !data?.email) {
          throw new Error("Failed to retrieve user information");
        }
        
        if (data.email) {
          // Sign in with the existing user's email
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: fingerprintHash, // Use the fingerprint as the password
          });
          
          if (signInError) {
            throw signInError;
          }
        } else {
          // If we can't sign in the existing user, create a new one
          await createNewAnonymousUser(fingerprintHash);
        }
        
        toast({
          title: "Welcome back!",
          description: "You've been automatically signed in.",
        });
      } else {
        // Create a new anonymous user
        await createNewAnonymousUser(fingerprintHash);
        
        toast({
          title: "Welcome to Gamana!",
          description: "You've been automatically signed in as a guest user.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Automatic login failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function to create a new anonymous user
  const createNewAnonymousUser = async (fingerprintHash: string) => {
    // Create a new anonymous user with a valid email format
    const randomId = crypto.randomUUID().substring(0, 8);
    const email = `anonymous-${randomId}@gamana.app`;
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: email,
      password: fingerprintHash, // Use the fingerprint as the password
      options: {
        data: {
          is_anonymous: true,
          username: `user_${Math.floor(Math.random() * 100000)}`,
          role: 'buyer' as UserRole
        }
      }
    });
    
    if (signUpError) {
      throw signUpError;
    }
    
    // Store the device fingerprint
    if (signUpData?.user) {
      await supabase
        .from("device_fingerprints")
        .insert({
          user_id: signUpData.user.id,
          fingerprint_hash: fingerprintHash,
          user_agent: navigator.userAgent,
          ip_address: null // We can't get the IP from the client
        });
        
      // Profile will be created automatically by the fetchUserProfile function
      // when the auth state changes and triggers the onAuthStateChange event
    }
  };

  // Link anonymous account to a real account
  const linkAnonymousAccount = async (email: string, password: string, username: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "No anonymous session to link",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // First check if the username already exists
      const { data: existingUsers, error: checkError } = await supabase
        .from("users")
        .select("username")
        .eq("username", username)
        .maybeSingle();
      
      if (checkError) {
        console.error("Error checking username:", checkError);
      }
      
      if (existingUsers) {
        toast({
          title: "Account linking failed",
          description: "Username already exists. Please choose another username.",
          variant: "destructive",
        });
        throw new Error("Username already exists");
      }
      
      // Update the email and password for the current user
      const { error } = await supabase.auth.updateUser({
        email,
        password,
        data: {
          is_anonymous: false,
          username
        }
      });
      
      if (error) throw error;
      
      // Update the user profile in the database
      await supabase
        .from("users")
        .update({
          email,
          username,
          is_verified: true
        })
        .eq("id", user.id);
      
      toast({
        title: "Account linked successfully",
        description: "Your anonymous account has been linked to your email.",
      });
      
      // Refresh user profile
      const profile = await fetchUserProfile(user.id);
      setUserProfile(profile);
    } catch (error: any) {
      toast({
        title: "Account linking failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Profile will be created automatically by the fetchUserProfile function if needed
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, username: string, role: UserRole = 'buyer') => {
    try {
      setIsLoading(true);
      // First check if the username already exists to provide a better error message
      const { data: existingUsers, error: checkError } = await supabase
        .from("users")
        .select("username")
        .eq("username", username)
        .maybeSingle();
      
      if (checkError) {
        console.error("Error checking username:", checkError);
      }
      
      if (existingUsers) {
        toast({
          title: "Signup failed",
          description: "Username already exists. Please choose another username.",
          variant: "destructive",
        });
        throw new Error("Username already exists");
      }
      
      // If username is available, proceed with signup
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            role,
          },
        },
      });
      
      if (error) throw error;
      
      // Profile will be created automatically by the fetchUserProfile function
      toast({
        title: "Account created",
        description: "Please check your email to verify your account.",
      });
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      });
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update user role
  const updateUserRole = async (role: UserRole) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Update metadata in auth
      const { error: authError } = await supabase.auth.updateUser({
        data: { role }
      });
      
      if (authError) throw authError;
      
      // Update role in users table
      const { error: dbError } = await supabase
        .from("users")
        .update({ role })
        .eq("id", user.id);
      
      if (dbError) throw dbError;
      
      // Refresh user profile
      const updatedProfile = await fetchUserProfile(user.id);
      setUserProfile(updatedProfile);
      
      toast({
        title: "Role updated",
        description: `Your account role has been updated to ${role}.`,
      });
    } catch (error: any) {
      toast({
        title: "Failed to update role",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (profile: Partial<UserProfile>) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Update profile in users table
      const { error } = await supabase
        .from("users")
        .update(profile)
        .eq("id", user.id);
      
      if (error) throw error;
      
      // Refresh user profile
      const updatedProfile = await fetchUserProfile(user.id);
      setUserProfile(updatedProfile);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Profile update failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        userProfile,
        isLoading,
        signIn,
        signUp,
        signOut,
        isAuthenticated,
        updateUserRole,
        updateProfile,
        generateAnonymousSession,
        linkAnonymousAccount
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
