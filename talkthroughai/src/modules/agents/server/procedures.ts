import { db } from "@/db";
import { z } from "zod";
import { agents } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { agentsInsertSchema, agentsUpdateSchema } from "../schema";
import { and, count, desc, eq, getTableColumns, ilike } from "drizzle-orm"
import { sql } from "drizzle-orm";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";
import { TRPCError } from "@trpc/server";


export const agentRouter = createTRPCRouter({

    update:protectedProcedure
    .input(agentsUpdateSchema)
    .mutation(async({ctx,input})=>{
        const [updatedAgent] = await db
        .update(agents)
        .set(input)
        .where(
            and(
                eq(agents.id,input.id),
                eq(agents.userId,ctx.auth.user.id)
            )
        )
        .returning();
        if(!updatedAgent){
            throw new TRPCError({
                code:"NOT_FOUND",
                message:"Agent not Found"
            })
        }
        return updatedAgent;
    }),
    remove:protectedProcedure
    .input(z.object({ id:z.string()}))
    .mutation(async({ ctx, input }) => {
        const [removedAgent] = await db
        .delete(agents)
        .where(
            and(
                eq(agents.id,input.id),
                eq(agents.userId,ctx.auth.user.id)
            )
        )
        .returning();
        if(!removedAgent){
            throw new TRPCError({
                code:"NOT_FOUND",
                message:"Agent not Found"
            })
        }

        return removedAgent;

    }),
    getOne:protectedProcedure.input(z.object({ id:z.string()})).query(async({input,ctx}) =>{
        const [existingAgent] =await db.select({
            ...getTableColumns(agents),
            meetingCount: sql<number>`(
                SELECT COUNT(*) FROM meetings
                WHERE meetings.agent_id = agents.id
            )`,
    }).from(agents)
        .where(and(
            eq(agents.id,input.id),
            eq(agents.userId,ctx.auth.user.id),
        ));

        if(!existingAgent){
            throw new TRPCError({code:"NOT_FOUND",message:"Agent not found"});
        }

        // await new Promise((resolve) => setTimeout(resolve,5000));
        // throw new TRPCError({ code:"BAD_REQUEST"});
        return existingAgent;
    }),
    getMany:protectedProcedure.input(z.object({
        page:z.number().min(1).default(DEFAULT_PAGE),
        pageSize:z
        .number()
        .min(MIN_PAGE_SIZE)
        .max(MAX_PAGE_SIZE)
        .default(DEFAULT_PAGE_SIZE),
        search:z.string().nullish()
    }))
    .query(async({ ctx,input}) =>{
        const {search,page,pageSize} = input;
        const data =await db.select(
            {
                ...getTableColumns(agents),
                meetingCount: sql<number>`(
                    SELECT COUNT(*) FROM meetings
                    WHERE meetings.agent_id = agents.id
                )`,
        }
        ).from(agents)
        .where(
            and(
                eq(agents.userId,ctx.auth.user.id),
                search ? ilike(agents.name,`%${search}%`) : undefined,
            )
        )
        .orderBy(desc(agents.createdAT),desc(agents.id))
        .limit(pageSize)
        .offset((page-1)*pageSize)

        const [total] = await db.select({count:count()}).from(agents)
        .where(
            and(
                eq(agents.userId,ctx.auth.user.id),
                search ? ilike(agents.name,`%${search}%`) : undefined,
            )
        );

        const totalPages = Math.ceil(total.count / pageSize)

        // await new Promise((resolve) => setTimeout(resolve,5000));
        // throw new TRPCError({ code:"BAD_REQUEST"});
        return {
            items:data,
            totalPages,
            total:total.count,
        }
    }),

    create:protectedProcedure.input(agentsInsertSchema)
    .mutation(async ({ input,ctx }) => {
        const [createdAgent] = await db
        .insert(agents)
        .values({
            ...input,
            userId:ctx.auth.user.id,
        })
        .returning();

        return createdAgent;
    })
});