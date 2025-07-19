"use client";

import { BarChart, CheckCircle2, Users, Video, MessageSquare, Calendar } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { FC, ReactNode } from "react";
import { authClient } from "@/lib/auth-client";
import { GeneratedAvatar } from "@/components/generated-avatar";

// Feature Card Component
interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}
const FeatureCard: FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="flex flex-col space-y-3 rounded-2xl border border-gray-800 bg-gray-900/50 p-4 backdrop-blur">
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-900/50">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

export const HomeView: FC = () => {
  const features = [
    {
      icon: <Users className="h-6 w-6 text-purple-400" aria-hidden="true" />, 
      title: "AI Agents",
      description: "Create and manage custom AI agents with unique instructions to participate in your meetings."
    },
    {
      icon: <Video className="h-6 w-6 text-purple-400" aria-hidden="true" />,
      title: "Live Video Calls",
      description: "Integrated video conferencing with a lobby for camera and mic setup before joining."
    },
    {
      icon: <CheckCircle2 className="h-6 w-6 text-purple-400" aria-hidden="true" />,
      title: "Automated Transcription & Recording",
      description: "Meetings are automatically recorded and transcribed, with assets saved for later access."
    },
    {
      icon: <Video className="h-6 w-6 text-purple-400" aria-hidden="true" />,
      title: "AI-Powered Summarization",
      description: "After meetings, GPT-4o generates detailed summaries from the transcript."
    },
    {
      icon: <BarChart className="h-6 w-6 text-purple-400" aria-hidden="true" />,
      title: "Post-Meeting Dashboard",
      description: "Access AI summaries, searchable transcripts with speaker IDs, and full video recordings."
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-purple-400" aria-hidden="true" />,
      title: '"Ask AI" Chat',
      description: "Interactively ask questions about any completed meeting and get instant, AI-powered answers."
    }
  ];

  const upcomingFeatures = [
    {
      icon: <Calendar className="h-6 w-6 text-purple-400" aria-hidden="true" />,
      title: "Meeting Scheduling",
      description: "Easily schedule meetings with AI agents and participants. (Coming soon)"
    },
    {
      icon: <Users className="h-6 w-6 text-purple-400" aria-hidden="true" />,
      title: "Collaborative AI Agents",
      description: "Multiple users will soon be able to interact with the same agent in meetings and chat. (Coming soon)"
    }
  ];

  const { data: session } = authClient.useSession();

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden bg-black">
      {/* Navigation */}
      <header className="w-full border-b border-white/10 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60 overflow-visible relative z-50">
        <div className="container mx-auto max-w-7xl px-0 flex h-16 items-center justify-between relative">
          <div className="flex items-center gap-2">
            <Image src="/logo_temp.svg" alt="Logo" width={40} height={40} className="invert" />
            <span className="text-xl font-bold text-white">TalkThroughAI</span>
          </div>
          <nav className="hidden md:flex items-center gap-12 text-base font-normal absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2" aria-label="Main navigation">
            <Link href="#features" className="text-white hover:text-purple-400 transition-colors" tabIndex={0} aria-label="Features">Features</Link>
            <Link href="#about" className="text-white hover:text-purple-400 transition-colors" tabIndex={0} aria-label="About">About</Link>
            <Link href="#contact" className="text-white hover:text-purple-400 transition-colors" tabIndex={0} aria-label="Contact">Contact</Link>
          </nav>
          <HeaderUserOrLogin />
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-8 md:py-5 lg:py-5 bg-black relative overflow-hidden">
          <div className="container mx-auto max-w-7xl px-0 relative z-10">
            <div className="px-4 sm:px-0">
              <div className="rounded-3xl overflow-hidden border border-gray-800 bg-gradient-to-br from-black via-purple-950 to-black relative">
                <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-purple-700/20 to-purple-900/20 blur-3xl"></div>
                <div className="px-4 sm:px-6 md:px-8 py-4 md:py-6 lg:py-20 space-y-4 md:space-y-6 relative z-10">
                  <div className="flex flex-col items-center space-y-12 md:space-y-16 text-center">
                    <div className="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-sm text-purple-300">
                      <span>AI-Powered Meeting</span>
                    </div>
                    <div className="space-y-6 md:space-y-8">
                      <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none text-white">
                        Run Smarter Meetings<br />
                        with TalkThroughAI
                      </h1>
                      <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
                        Automate your entire meeting lifecycle—from scheduling and live video calls to AI-generated summaries, searchable transcripts, and instant answers about any meeting. Let AI handle the details so you can focus on what matters.
                      </p>
                    </div>
                    <div className="flex flex-col gap-3 min-[400px]:flex-row pt-4">
                      <Link
                        href={session?.user ? "/meetings" : "/sign-in"}
                        tabIndex={0}
                        aria-label={session?.user ? "Go to Meetings" : "Sign In"}
                      >
                        <Button size="lg" className="bg-white text-black hover:bg-gray-200 px-10 py-7 rounded-full text-lg">
                          Get Started
                        </Button>
                      </Link>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 pt-16 md:pt-20">
                      <div className="inline-flex items-center rounded-full border border-gray-700 bg-gray-800/50 px-4 py-2 text-sm text-gray-300">
                        <Users className="mr-2 h-4 w-4 text-purple-400" aria-hidden="true" />
                        <span>Custom AI Agents</span>
                      </div>
                      <div className="inline-flex items-center rounded-full border border-gray-700 bg-gray-800/50 px-4 py-2 text-sm text-gray-300">
                        <Video className="mr-2 h-4 w-4 text-purple-400" aria-hidden="true" />
                        <span>Live Video Meetings</span>
                      </div>
                      <div className="inline-flex items-center rounded-full border border-gray-700 bg-gray-800/50 px-4 py-2 text-sm text-gray-300">
                        <Video className="mr-2 h-4 w-4 text-purple-400" aria-hidden="true" />
                        <span>AI Summaries & Insights</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-8 md:py-16 lg:py-24 w-full bg-black">
          <div className="container mx-auto max-w-7xl px-0">
            <div className="px-4 sm:px-0">
              <div className="rounded-3xl overflow-hidden border border-gray-800 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative p-6 md:p-8 lg:p-10">
                <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-10"></div>
                <div className="relative z-10">
                  <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
                    <div className="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-sm text-purple-300 mb-4">
                      <span>Core Features</span>
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl text-white">AI for Every Step of Your Meeting</h2>
                      <p className="max-w-[700px] text-gray-400 md:text-xl/relaxed">
                        From live video to post-meeting insights, TalkThroughAI automates and enhances your workflow with powerful, integrated AI features.
                      </p>
                    </div>
                  </div>
                  <div className="mx-auto grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, idx) => (
                      <FeatureCard key={feature.title + idx} {...feature} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Features Section */}
        <section id="upcoming-features" className="py-8 w-full bg-black">
          <div className="container mx-auto max-w-4xl px-4">
            <div className="rounded-3xl overflow-hidden border border-dashed border-purple-700 bg-gradient-to-br from-black via-purple-950 to-black relative p-6 md:p-8">
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
                <div className="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-sm text-purple-300 mb-2">
                  <span>Upcoming Features</span>
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-white">What’s Next for TalkThroughAI?</h3>
                <p className="max-w-xl text-gray-400 md:text-lg/relaxed">
                  We’re always building. Here’s what’s coming soon:
                </p>
              </div>
              <div className="mx-auto grid gap-4 sm:grid-cols-2">
                {upcomingFeatures.map((feature, idx) => (
                  <FeatureCard key={feature.title + idx} {...feature} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-8 md:py-16 lg:py-24 w-full bg-black">
          <div className="container mx-auto max-w-4xl px-4">
            <div className="rounded-3xl overflow-hidden border border-gray-800 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative p-6 md:p-8 lg:p-10">
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
                <div className="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-sm text-purple-300 mb-2">
                  <span>About</span>
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-white">What is TalkThroughAI?</h3>
                <p className="max-w-xl text-gray-400 md:text-lg/relaxed">
                  TalkThroughAI is an all-in-one platform for smarter, AI-powered meetings. We help teams automate meeting notes, summaries, and follow-ups, so you can focus on what matters. With live video, custom AI agents, and instant insights, TalkThroughAI transforms the way you collaborate.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-8 md:py-16 lg:py-24 w-full bg-black">
          <div className="container mx-auto max-w-4xl px-4">
            <div className="rounded-3xl overflow-hidden border border-gray-800 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative p-6 md:p-8 lg:p-10">
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
                <div className="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-sm text-purple-300 mb-2">
                  <span>Contact</span>
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-white">Get in Touch</h3>
                <p className="max-w-xl text-gray-400 md:text-lg/relaxed mb-4">
                  Have questions, feedback, or need support? Reach out to me.
                </p>
                <a href="mailto:adarshanatia@gmail.com" className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-full transition-colors">adarshanatia@gmail.com</a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-8 md:py-16 lg:py-24 w-full bg-black relative overflow-hidden">
          <div className="container mx-auto max-w-7xl px-0 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-8 text-center py-12 md:py-16 lg:py-20">
              <div className="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-sm text-purple-300">
                <span>Ready to Get Started?</span>
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl text-white">Experience AI-Powered Meetings Today</h2>
                <p className="max-w-[600px] text-gray-300 md:text-xl/relaxed mx-auto text-center">
                  Sign up and let TalkThroughAI handle your meetings—from live calls to actionable insights and everything in between.
                </p>
              </div>
              <div className="flex flex-col gap-3 min-[400px]:flex-row pt-4">
                <Link
                  href={session?.user ? "/meetings" : "/sign-in"}
                  tabIndex={0}
                  aria-label={session?.user ? "Go to Meetings" : "Sign In"}
                >
                  <Button size="lg" className="bg-white text-black hover:bg-gray-200 px-8 py-6 rounded-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 w-full bg-black border-t border-gray-800">
        <div className="container mx-auto max-w-7xl px-0 flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex items-center gap-2">
            <Image src="/logo_temp.svg" alt="Logo" width={32} height={32} className="invert" />
            <span className="text-lg font-bold text-white">TalkThroughAI</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/Adarsha2004/TalkThrough"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaGithub className="w-6 h-6" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Header user/profile or login button with logout dropdown
const HeaderUserOrLogin: FC = () => {
  const { data, isPending } = authClient.useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  if (isPending) return null;
  if (data?.user) {
    return (
      <div
        className="relative flex items-center gap-2 group cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        <GeneratedAvatar seed={data.user.name || "User"} variant="initials" className="size-8" />
        <span className="text-white font-medium text-sm max-w-[120px] truncate">{data.user.name}</span>
        {open && (
          <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded shadow-lg z-50 py-2">
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={async (e) => {
                e.stopPropagation();
                setOpen(false);
                await authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => router.push("/")
                  }
                });
                router.push("/");
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="flex items-center gap-4">
      <Link href="/sign-in" className="ml-6 pr-4" tabIndex={0} aria-label="Login">
        <Button className="bg-purple-600 hover:bg-purple-700 text-white" size="sm">Login</Button>
      </Link>
    </div>
  );
};