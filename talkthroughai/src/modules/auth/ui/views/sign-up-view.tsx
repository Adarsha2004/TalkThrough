"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card } from "@/components/ui/card"
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
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { FaGithub, FaGoogle ,FaTwitter} from "react-icons/fa";


const signUpSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Enter a valid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type SignUpSchema = z.infer<typeof signUpSchema>

export const SignUpView = () => {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  })

  const handleSubmit = (data: SignUpSchema) => {
    setError(null)
    setIsLoading(true)
    authClient.signUp.email(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        callbackURL:"/"
      },
      {
        onSuccess: () => {
          setShowSuccess(true)
          setIsLoading(false)
          setTimeout(() => {
            router.push("/")
          }, 1500)
        },
        onError: ({ error }) => {
          setError(error.message)
          setIsLoading(false)
        },
      }
    )
  }

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
          <div className="flex-1 flex flex-col justify-center pl-8 pr-2 py-6 md:pl-12 md:pr-2 md:py-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-2 text-white">Create your account <span className="text-2xl"></span></h2>
            <p className="text-gray-400 mb-8">Sign up to get started</p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Name"
                          className="h-11 bg-[#232b3a] border-gray-700 text-white placeholder:text-gray-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <FormField
                  name="confirmPassword"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirm Password"
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
                <Button type="submit" className="w-full h-11 bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-semibold shadow-none border-0 hover:from-indigo-600 hover:to-blue-700 disabled:opacity-60" disabled={isLoading}>
                  {isLoading ? "Signing up..." : "Sign up"}
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
                  onClick={()=> onSocial("github")}>
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
                    Account created successfully! Redirecting to home...
                  </AlertDescription>
                </Alert>
              </div>
            )}
            <div className="mt-6 text-center text-sm text-gray-400">
              Already have an account?{' '}
              <a href="/sign-in" className="text-blue-400 font-semibold hover:underline">Sign In</a>
            </div>
            <div className="w-full max-w-4xl mx-auto text-center text-xs text-gray-500 mt-6">
              By clicking continue, you are agreeing to our{' '}
              <a href="#" className="underline">Terms of Service</a> and{' '}
              <a href="#" className="underline">Privacy Policy</a>.
            </div>
          </div>
          {/* Right: Image (hidden on small screens) */}
          <div className="hidden md:flex flex-1 bg-[#181f2a] items-stretch">
            <div className="flex-1 flex pr-6">
              <img
                src="/WhatsApp Image 2025-06-18 at 23.57.13_a77d2b61.jpg"
                alt="Sign up visual"
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