"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiErrorWarningFill } from "@remixicon/react";
import { AlertCircle, Eye, EyeOff, LoaderCircleIcon } from "lucide-react";
import { useForm } from "react-hook-form";

import { Alert, AlertIcon, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getSigninSchema, SigninSchemaType } from "../forms/signin-schema";
import LoginService from "@/lib/api/login-service";
import SharedPreferences from "@/lib/shared-preferences";

export default function SignInPage() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const form = useForm<SigninSchemaType>({
    resolver: zodResolver(getSigninSchema()),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Check if user is already authenticated and load saved email on component mount
  useEffect(() => {
    const checkAuthentication = () => {
      try {
        const bearerToken = SharedPreferences.getBearerToken();
        
        if (bearerToken) {
          console.log('User already authenticated, redirecting to dashboard...');
          // User is already logged in, redirect to dashboard
          router.push('/');
          return;
        }
        
        // User is not authenticated, load saved email and password if they exist
        const savedEmail = SharedPreferences.getSavedEmail();
        const savedPassword = SharedPreferences.getSavedPassword();
        const rememberMe = SharedPreferences.getRememberMe();
        
        // Auto-fill if we have saved credentials (regardless of rememberMe flag)
        if (savedEmail) {
          console.log('Loading saved email:', savedEmail);
          form.setValue('email', savedEmail);
          
          // If password is also saved, auto-fill it and check "Remember me"
          if (savedPassword) {
            console.log('Loading saved password');
            form.setValue('password', savedPassword);
            form.setValue('rememberMe', true);
          }
          // If only email is saved, check if rememberMe was previously set
          else if (rememberMe) {
            form.setValue('rememberMe', true);
          }
        }
        
        // Show the login form
        setIsCheckingAuth(false);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsCheckingAuth(false);
      }
    };

    checkAuthentication();
  }, [router, form]);

  async function onSubmit(values: SigninSchemaType) {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await LoginService.login({
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
      });

      // Login successful - redirect to dashboard
      console.log('Login successful, redirecting to dashboard...');
      
      // Small delay to ensure localStorage is updated
      setTimeout(() => {
        // Force a page reload to ensure authentication state is updated
        window.location.href = '/';
      }, 100);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <Form {...form}>
      {/* Show loading while checking authentication */}
      {isCheckingAuth ? (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2">
            <LoaderCircleIcon className="size-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Checking authentication...</span>
          </div>
        </div>
      ) : (
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="block w-full space-y-5"
        >
        <div className="space-y-1.5 pb-3">
          <h1 className="text-2xl font-semibold tracking-tight text-center">
            Sign in to <span className="text-primary">Bison360</span>
          </h1>
        </div>

        <Alert size="sm" close={false}>
          <AlertIcon>
            <RiErrorWarningFill className="text-primary" />
          </AlertIcon>
          <AlertTitle className="text-accent-foreground">
            Enter your email and password to sign in to Bison360.
          </AlertTitle>
        </Alert>

        {error && (
          <Alert variant="destructive">
            <AlertIcon>
              <AlertCircle />
            </AlertIcon>
            <AlertTitle>{error}</AlertTitle>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center gap-2.5">
                <FormLabel>Password</FormLabel>
                <Link
                  href="/reset-password"
                  className="text-sm font-semibold text-foreground hover:text-primary"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  placeholder="Your password"
                  type={passwordVisible ? "text" : "password"}
                  {...field}
                />
                <Button
                  type="button"
                  variant="ghost"
                  mode="icon"
                  size="sm"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute end-0 top-1/2 -translate-y-1/2 h-7 w-7 me-1.5"
                  aria-label={
                    passwordVisible ? "Hide password" : "Show password"
                  }
                >
                  {passwordVisible ? (
                    <EyeOff className="text-muted-foreground" />
                  ) : (
                    <Eye className="text-muted-foreground" />
                  )}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center space-x-2">
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <>
                <Checkbox
                  id="remember-me"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(!!checked)}
                />
                <label
                  htmlFor="remember-me"
                  className="text-sm leading-none text-muted-foreground"
                >
                  Remember me
                </label>
              </>
            )}
          />
        </div>

        <div className="flex flex-col gap-2.5">
          <Button type="submit" disabled={isProcessing}>
            {isProcessing ? (
              <LoaderCircleIcon className="size-4 animate-spin" />
            ) : null}
            Continue
          </Button>
        </div>

       {/*  <p className="text-sm text-muted-foreground text-center">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-sm font-semibold text-foreground hover:text-primary"
          >
            Sign Up
          </Link>
        </p> */}
        </form>
      )}
    </Form>
  );
}
