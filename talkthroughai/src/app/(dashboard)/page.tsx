import { HomeView } from "@/modules/home/ui/views/home-view";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { session } from "@/db/schema";
import { redirect } from "next/navigation";
import { caller } from "@/trpc/server";

const Page = async () => {

  const data = await caller.hello({text:"Adarsha Server"});

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if(!session){
  redirect("/sign-in");
  }

  return <p>{data.greeting}</p>
  return <HomeView />;
};


export default Page;