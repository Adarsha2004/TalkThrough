import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { agents } from "@/db/schema";
import { eq } from "drizzle-orm";

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

export async function POST(req: NextRequest) {
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  // Check if user already has agents
  const existing = await db.select().from(agents).where(eq(agents.userId, userId));
  if (existing.length > 0) {
    return NextResponse.json({ status: "already seeded" });
  }

  await db.insert(agents).values(
    defaultAgents.map(agent => ({
      ...agent,
      userId,
    }))
  );

  return NextResponse.json({ status: "seeded" });
} 