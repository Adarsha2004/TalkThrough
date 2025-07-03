import JSONL from "jsonl-parse-stringify";

import { inngest } from "@/inngest/client";
import { StreamTranscriptItem } from "@/modules/meetings/types";
import { db } from "@/db";
import { eq, inArray } from "drizzle-orm";
import { user,agents,meetings } from "@/db/schema";
import { createAgent,openai,TextMessage } from "@inngest/agent-kit";


const summarizer = createAgent ({
  name:"Summarizer",
  system:`
  Overview
Craft a clear, engaging summary of the meetings content. Focus on the main topics discussed, key decisions made, and any notable demonstrations or workflows. Use a narrative style with full sentences. Highlight unique features, important outcomes, and any next steps or action items. Make sure the summary is easy to understand and captures the essence of the discussion.

Notes
Organize the meeting content into thematic sections, each with relevant timestamp ranges. Use bullet points to summarize the main points, actions, demos, or discussions within each section.

[Section Name] (e.g., Introduction, Feature Demo, Q&A) [00:00-05:15]
Summarize the main point, topic, or demo presented

Note any important questions, responses, or clarifications

Highlight key decisions or agreements

[Next Section Name] [05:16-10:30]
Describe further features, workflows, or discussions

Mention any integrations, follow-up actions, or unique insights

Capture any closing remarks or next steps

Instructions for Use:

Replace section names and timestamps as appropriate.

Ensure each bullet is concise and actionable.

Use simple language, avoiding jargon.

Focus on clarity, structure, and readability for quick reference.

This format ensures every summary is comprehensive, easy to scan, and highly useful for future reference or sharing.`
.trim(),
model:openai({model:"gpt-4o-mini",apiKey:process.env.OPENAI_API_KEY}),
})



export const meetingProcessing = inngest.createFunction(
  {id:"meetings/processing"},
  { event: "meetings/processing" },
  async ({event,step})=>{
    const response = await step.run("fetch-transcript", async () => {
      return await fetch(event.data.transcriptURL).then(res=>res.text());
    });

    const transcript = await step.run("parse-transcript",async()=>{
      return JSONL.parse<StreamTranscriptItem>(response);
    });

    const transcriptWithSpeakers = await step.run("add-speakers",async()=>{
      const speakerIds = [
        ...new Set(transcript.map(item=>item.speaker_id)),
      ];

      const userSpeakers = await db
      .select()
      .from(user)
      .where(inArray(user.id,speakerIds))
      .then((users) => 
      users.map((user) => ({
        ...user,
      }))
    );

    const agentSpeakers = await db
      .select()
      .from(agents)
      .where(inArray(agents.id,speakerIds))
      .then((agents) => 
      agents.map((agent) => ({
        ...agent,
      }))
    );


    const speakers = [...userSpeakers,...agentSpeakers];

    return transcript.map((item)=>{
      const speaker = speakers.find(
        (speaker) => speaker.id === item.speaker_id
      );

      if(!speaker){
        return {
          ...item,
          user:{
            name:"Unknown",
          }
        }
      }

      return {
        ...item,
        user:{
          name:speaker.name,
        }
      }
    })
    });

    const {output} = await summarizer.run(
      "Summarize the Following transcript:"+
      JSON.stringify(transcriptWithSpeakers),
     );

     await step.run("save-summary",async()=>{
      await db
      .update(meetings)
      .set({
        summary:(output[0] as TextMessage).content as string,
        status:"completed"
      })
      .where(eq(meetings.id,event.data.meetingId))
     })
  }
)
