"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FaGithub, FaGoogle ,FaTwitter} from "react-icons/fa";

import { authClient } from "@/lib/auth-client"

const signInSchema = z.object({
  email: z.string(),
  password: z.string()
})

type SignInSchema = z.infer<typeof signInSchema>

export const SignInView = () => {
    const router = useRouter();
    const [error,setError]=useState<string | null>(null)

  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const handleSubmit = async (data: SignInSchema) => {
    if (!data.email || !data.password) {
      setError("Please fill in all fields")
      return
    }
    if (!data.email.includes('@')) {
      setError("Please enter a valid email")
      return
    }
    
    setError(null)
    setIsLoading(true)
    authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
        callbackURL:"/"
      },
      {
        onSuccess: async (session) => {
          setIsLoading(false)
          // Use userId from session if available
          const userId = session?.data?.user?.id || session?.data?.id;
          if (userId) {
            await fetch("/api/agents/seed-defaults", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId })
            });
          }
          router.push("/");
        },
        onError: () => {
          setError("Invalid email or password")
          setIsLoading(false)
        }
      }
    );
  };

   const onSocial = async (provider:"github" | "google") => {
    setError(null)
    setIsLoading(true)
    authClient.signIn.social(
      {
        provider: provider,
        callbackURL:"/"
      },
      {
        onSuccess: async (session) => {
          setIsLoading(false)
          // Use userId from session if available
          const userId = session?.data?.user?.id || session?.data?.id;
          if (userId) {
            await fetch("/api/agents/seed-defaults", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId })
            });
          }
          router.push("/");
        },
        onError: ({ error }) => {
          setError(error.message)
          setIsLoading(false)
        }
      }
    );
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#111] text-gray-200 font-sans p-4">
      <style jsx global>{`
        .form-error {
          color: #666 !important;
          font-size: 0.75rem !important;
        }
        input {
          border-color: #333 !important;
        }
        input:focus {
          border-color: #666 !important;
          box-shadow: none !important;
        }
      `}</style>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-6 top-0 h-full w-px bg-gray-800" />
        <div className="absolute right-6 top-0 h-full w-px bg-gray-800" />
        <div className="absolute top-6 left-0 w-full h-px bg-gray-800" />
        <div className="absolute bottom-6 left-0 w-full h-px bg-gray-800" />
      </div>

      <div className="relative w-full max-w-sm p-8 space-y-6 bg-[#181818] border border-gray-700">
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gray-500 -mt-px -ml-px" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-gray-500 -mt-px -mr-px" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-gray-500 -mb-px -ml-px" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-gray-500 -mb-px -mr-px" />
        
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Log in</h1>
        </div>
        
        <div className="space-y-3">
           <Button type="button" variant="outline" className="w-full flex items-center justify-center gap-2 bg-transparent border-gray-700 hover:bg-gray-800 hover:text-white rounded-none"
              onClick={()=> onSocial("google")}>
              <FaGoogle /> Log in with Google
          </Button>
          <Button type="button" variant="outline" className="w-full flex items-center justify-center gap-2 bg-transparent border-gray-700 hover:bg-gray-800 hover:text-white rounded-none"
              onClick={() => onSocial("github")}>
              <FaGithub /> Log in with GitHub
          </Button>
          <Button type="button" variant="outline" className="w-full flex items-center justify-center gap-2 bg-transparent border-gray-700 hover:bg-gray-800 hover:text-white rounded-none">
              <FaTwitter /> Log in with Twitter
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-gray-700" />
          <span className="text-gray-500 text-xs">or log in with email</span>
          <div className="flex-1 h-px bg-gray-700" />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-sm font-medium text-gray-400">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      className="h-10 bg-black/20 text-white placeholder:text-gray-500 rounded-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-sm font-medium text-gray-400">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="h-10 bg-black/20 text-white placeholder:text-gray-500 rounded-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && (
              <div className="text-gray-500 text-sm text-center py-2">
                {error}
              </div>
            )}
            <Button 
              type="submit" 
              variant="outline" 
              className="w-full h-10 bg-transparent border-gray-700 hover:bg-gray-800 hover:text-white disabled:opacity-60 rounded-none" 
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Continue"}
            </Button>
          </form>
        </Form>
         <div className="text-center text-sm">
              <p className="text-gray-400">Don&apos;t have an account? <Link href="/sign-up" className="font-semibold text-white hover:underline">Sign up</Link></p>
          </div>
        <div className="text-center text-xs text-gray-500">
          By logging in, you agree to our <a href="#" className="underline hover:text-white">Terms and Conditions</a> and <a href="#" className="underline hover:text-white">Privacy Policy</a>.
        </div>
      </div>

      {error && (
        <div className="mt-4 max-w-sm w-full">
          <Alert className="bg-red-900/50 border-red-800 text-red-300">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  )
}