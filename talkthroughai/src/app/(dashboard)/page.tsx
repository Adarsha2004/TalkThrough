import { HomeView } from "@/modules/home/ui/views/home-view";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { agents } from "@/db/schema";
import { eq } from "drizzle-orm";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if(!session){
    redirect("/sign-in");
  }

  // Check if user has agents, if not seed them (only for new users)
  const userId = session.user.id;
  const existingAgents = await db.select().from(agents).where(eq(agents.userId, userId));
  
  if (existingAgents.length === 0) {
    const defaultAgents = [
      {
        name: "Financial Advisory",
        instructions: "Provides investment guidance, portfolio analysis, budget planning, and financial goal tracking with regulatory compliance considerations."
      },
      {
        name: "Startup Advisor",
        instructions: "Offers guidance on business planning, funding strategies, product development, market validation, and scaling operations."
      },
      {
        name: "Healthcare",
        instructions: "Assists with appointment scheduling, symptom assessment, medication reminders, and health monitoring guidance."
      },
      {
        name: "Academic Research",
        instructions: "Conducts literature reviews, data analysis, citation management, and research methodology guidance."
      }
    ];

    await db.insert(agents).values(
      defaultAgents.map(agent => ({
        ...agent,
        userId: userId,
      }))
    );
  }

  return <HomeView />;
};

export default Page;