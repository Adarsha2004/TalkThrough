
import { agentRouter } from '@/modules/agents/server/procedures';
import { createTRPCRouter } from '../init';
import { meetingRouter } from '@/modules/meetings/server/procedures';
export const appRouter = createTRPCRouter({
  agents : agentRouter,
  meetings: meetingRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;