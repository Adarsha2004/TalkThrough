"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
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
  email: z.string().email({ message: "Enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
})

type SignInSchema = z.infer<typeof signInSchema>

export const SignInView = () => {
    const router = useRouter();
    const [error,setError]=useState<string | null>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  })

  const handleSubmit = (data: SignInSchema) => {
    setError(null)
    setIsLoading(true)
    authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
        callbackURL:"/"
      },
      {
        onSuccess: () => {
          setIsLoading(false)
          router.push("/");
        },
        onError: ({ error }) => {
          setError(error.message)
          setIsLoading(false)
        }
      }
    );
  };

   const onSocial = (provider:"github" | "google") => {
    setError(null)
    setIsLoading(true)
    authClient.signIn.social(
      {
        provider: provider,
        callbackURL:"/"
      },
      {
        onSuccess: () => {
          setIsLoading(false)
        },
        onError: ({ error }) => {
          setError(error.message)
          setIsLoading(false)
        }
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a101a] p-4">
      <div className="w-full max-w-4xl">
        <Card className="flex flex-col md:flex-row overflow-hidden shadow-2xl border-0 bg-[#181f2a] rounded-3xl items-stretch">
          {/* Left: Form */}
          <div className="flex-1 flex flex-col justify-center items-center pl-8 pr-2 py-6 md:pl-12 md:pr-2 md:py-8">
            <div className="w-full max-w-lg">
              <h2 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-2 text-white">Welcome back <span className="text-2xl">👋</span></h2>
              <p className="text-gray-400 mb-8">Login to your account</p>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Email"
                            className="h-11 bg-[#232b3a] border-gray-700 text-white placeholder:text-gray-500"
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
                      <FormItem>
                        <FormLabel className="text-gray-200">Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Password"
                            className="h-11 bg-[#232b3a] border-gray-700 text-white placeholder:text-gray-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {error && (
                    <Alert variant="destructive" className="mb-4 bg-red-500/10 border border-red-400 text-red-300">
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="flex justify-end text-xs text-gray-400">
                    <a href="#" className="text-gray-400 hover:underline">Forgot password?</a>
                  </div>
                  <Button type="submit" className="w-full h-11 bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-semibold shadow-none border-0 hover:from-indigo-600 hover:to-blue-700 disabled:opacity-60" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Log in"}
                  </Button>
                  <div className="flex items-center gap-2 my-4">
                    <div className="flex-1 h-px bg-gray-700" />
                    <span className="text-gray-500 text-xs font-medium">or</span>
                    <div className="flex-1 h-px bg-gray-700" />
                  </div>
                  <div className="flex flex-row gap-3">
                    <Button type="button" className="flex-1 h-11 flex items-center justify-center rounded-lg bg-[#232b3a] border border-gray-700 shadow-sm hover:shadow-md transition-all"
                    onClick={()=> onSocial("google")}>
                      <FaGoogle />
                    </Button>
                    <Button type="button" className="flex-1 h-11 flex items-center justify-center rounded-lg bg-[#232b3a] border border-gray-700 shadow-sm hover:shadow-md transition-all"
                    onClick={() => onSocial("github")}>
                      <FaGithub />
                    </Button>
                    <Button type="button" className="flex-1 h-11 flex items-center justify-center rounded-lg bg-[#232b3a] border border-gray-700 shadow-sm hover:shadow-md transition-all">
                      <FaTwitter />
                    </Button>
                  </div>
                </form>
              </Form>
              {showSuccess && (
                <div className="mt-4">
                  <Alert className="bg-green-700/20 border-green-600 text-green-300">
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>
                      You have signed in successfully!
                    </AlertDescription>
                  </Alert>
                </div>
              )}
              <div className="mt-6 text-center text-sm text-gray-400">
                Don't have an account?{' '}
                <a href="/sign-up" className="text-blue-400 font-semibold hover:underline">Sign Up</a>
              </div>
              <div className="w-full max-w-lg mx-auto text-center text-xs text-gray-500 mt-6">
                By clicking continue, you are agreeing to our{' '}
                <a href="#" className="underline">Terms of Service</a> and{' '}
                <a href="#" className="underline">Privacy Policy</a>.
              </div>
            </div>
          </div>
          {/* Right: Image (hidden on small screens) */}
          <div className="hidden md:flex flex-1 bg-[#181f2a] items-stretch">
            <div className="flex-1 flex pr-6">
              <img
                src="/WhatsApp Image 2025-06-18 at 23.57.13_a77d2b61.jpg"
                alt="Sign in visual"
                className="w-full h-full object-cover rounded-3xl opacity-80"
                style={{ minHeight: 0 }}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}