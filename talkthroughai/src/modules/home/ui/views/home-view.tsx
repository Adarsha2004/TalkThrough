"use client"

import { useState } from "react";

import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export const HomeView = () => {
  const router = useRouter();
  const { data:session, isPending} = authClient.useSession();
  
  if(isPending){
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin" size={24}/>
      </div>
    )
  }
  
  if(!session){
    return null
  }

  return (
     <div className="flex-1 w-full bg-[#111] text-gray-200">
        <div className="flex flex-col items-center justify-center h-full gap-y-4">
            <p className="text-xl">Logged in as {session.user.name}</p>
            <Button 
                variant="outline"
                className="bg-transparent border-gray-700 hover:bg-gray-800 hover:text-white rounded-none"
                onClick={()=>authClient.signOut({
                    fetchOptions:{onSuccess: () => router.push("/sign-in")}
                })}
            >
                Sign Out
            </Button>
        </div>
      </div>
  )
}