import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const RootPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (session) {
    // Since we're using route groups, this will go to (dashboard)/page.tsx
    return null; // Let Next.js render the (dashboard) route naturally
  } else {
    redirect("/sign-in");
  }
};

export default RootPage;