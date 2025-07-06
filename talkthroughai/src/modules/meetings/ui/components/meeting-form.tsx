import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { meetingsInsertSchema } from "../../schema";
import { zodResolver } from "@hookform/resolvers/zod";

import { MeetingGetOne } from "../../types";
import { CommandSelect } from "@/components/command-select";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface MeetingFormProps{
    onSuccess?:(id?: string) => void;
    onCancel?:() => void;
    initialValues?:MeetingGetOne;
    onCreateAgent?: () => void;
}

export const MeetingForm = ({
    onSuccess,
    onCancel,
    initialValues,
    onCreateAgent
}: MeetingFormProps) =>{
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    // Fetch agents for selection
    const { data: agentsData } = useSuspenseQuery(
        trpc.agents.getMany.queryOptions({ pageSize: 100 })
    );

    const createMeeting = useMutation(
        trpc.meetings.create.mutationOptions({
            onSuccess: async (data) => {
                await queryClient.invalidateQueries(
                    trpc.meetings.getMany.queryOptions({})
                );
                onSuccess?.(data.id);
            },
            
            onError:(error)=> {
                toast.error(error.message)
            },        
    })
    )

    const updateMeeting = useMutation(
        trpc.meetings.update.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(
                    trpc.meetings.getMany.queryOptions({})
                );

                if(initialValues?.id){
                    await queryClient.invalidateQueries(
                        trpc.meetings.getOne.queryOptions({ id: initialValues.id})
                    )
                }
                onSuccess?.();
            },
            
            onError:(error)=> {
                toast.error(error.message)
            },        
    })
    )

    const form = useForm<z.infer<typeof meetingsInsertSchema>>({
        resolver:zodResolver(meetingsInsertSchema),
        defaultValues:{
            name:initialValues?.name??"",
            agentID:initialValues?.agentId??"",
        }
    });

    const isEdit = !!initialValues?.id;
    const isPending =createMeeting.isPending || updateMeeting.isPending;

    const onSubmit = (values: z.infer<typeof meetingsInsertSchema>) =>{
        if(isEdit){
            updateMeeting.mutate({ ...values, id: initialValues.id });
        }
        else{
            createMeeting.mutate(values);
        }
    };

    // Prepare agent options for CommandSelect
    const agentOptions = agentsData?.items.map(agent => ({
        id: agent.id,
        value: agent.name,
        children: (
            <span className="text-base" style={{ lineHeight: 1 }}>{agent.name}</span>
        )
    })) ?? [];

    return (
        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                name="name"
                control={form.control}
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="e.g. Assignment Solver"/>
                        </FormControl>
                    </FormItem>
                )}
                />
                <FormField
                name="agentID"
                control={form.control}
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Agent</FormLabel>
                        <FormControl>
                            <CommandSelect
                                options={agentOptions}
                                value={field.value}
                                onSelect={field.onChange}
                                placeholder="Select an agent..."
                            />
                        </FormControl>
                        {onCreateAgent && (
                            <button
                                type="button"
                                className="w-full text-left text-blue-600 hover:underline py-2 px-2 mt-1"
                                onClick={e => {
                                    e.preventDefault();
                                    onCreateAgent();
                                }}
                            >
                                Not found what you are looking for? <b>Create new Agent</b>
                            </button>
                        )}
                    </FormItem>
                )}
                />
                <div className="flex justify-between gap-x-2">
                    {onCancel && (
                        <Button
                        variant="ghost"
                        disabled={isPending}
                        type="button"
                        onClick={onCancel}>
                            Cancel
                        </Button>
                    )}
                    <Button disabled={isPending} type="submit">
                        {isEdit ? "Update" : "Create"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}