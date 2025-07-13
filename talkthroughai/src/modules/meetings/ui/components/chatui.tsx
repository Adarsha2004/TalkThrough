import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { Channel as StreamChannel, StreamChat, Message, Event } from "stream-chat";
import { useTRPC } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";

interface ChatUIProps {
  meetingId: string;
  meetingName: string;
  userId: string;
  userName: string;
  userImage?: string;
}

export const ChatUI = ({
  meetingId,
  meetingName,
  userId,
  userName,
  userImage
}: ChatUIProps) => {
  // Removed unused 'client' variable
  const [channel, setChannel] = useState<StreamChannel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const trpc = useTRPC();
  const { mutateAsync: generateChatToken } = useMutation(
    trpc.meetings.generateChatToken.mutationOptions(),
  );

  // Initialize Stream Chat client
  useEffect(() => {
    const initializeChat = async () => {
      try {
        const chatClient = StreamChat.getInstance(
          process.env.NEXT_PUBLIC_STREAM_CHAT_API_KEY!
        );

        const token = await generateChatToken();
        
        await chatClient.connectUser(
          {
            id: userId,
            name: userName,
            image: userImage,
          },
          token
        );

        const chatChannel = chatClient.channel("messaging", meetingId, {
          members: [userId],
        });

        await chatChannel.watch();
        
        // Removed unused 'client' variable
        setChannel(chatChannel);
        
        // Get existing messages
        const state = chatChannel.state;
        setMessages(Object.values(state.messages) as Message[]);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to initialize chat:", error);
        setIsLoading(false);
      }
    };

    initializeChat();
  }, [meetingId, userId, userName, userImage, generateChatToken]);

  // Listen for new messages
  useEffect(() => {
    if (!channel) return;

    const handleNewMessage = (event: Event) => {
      if (!event.message) return;
      setMessages(prev => [...prev, event.message as Message]);
    };

    const handleMessageUpdated = (event: Event) => {
      if (!event.message) return;
      setMessages(prev =>
        prev.map(msg =>
          msg.id === (event.message as Message).id ? (event.message as Message) : msg
        ) as Message[]
      );
    };

    const handleMessageDeleted = (event: Event) => {
      if (!event.message) return;
      setMessages(prev =>
        prev.filter(msg => msg.id !== (event.message as Message).id)
      );
    };

    channel.on("message.new", handleNewMessage);
    channel.on("message.updated", handleMessageUpdated);
    channel.on("message.deleted", handleMessageDeleted);

    return () => {
      channel.off("message.new", handleNewMessage);
      channel.off("message.updated", handleMessageUpdated);
      channel.off("message.deleted", handleMessageDeleted);
    };
  }, [channel]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !channel) return;

    try {
      await channel.sendMessage({
        text: newMessage,
      });
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const formatTime = (timestamp: string | Date) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (isLoading) {
    return (
      <LoadingState
        title="Loading Chat"
        description="This may take a few seconds"
      />
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden h-full flex flex-col">
      {/* Chat Header */}
      <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
        <h3 className="text-white font-medium">{meetingName} Chat</h3>
        <p className="text-gray-400 text-sm">
          {channel?.state.members ? Object.keys(channel.state.members).length : 0} members
        </p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-23rem)]">
        {messages.map((message) => {
          const isOwnMessage = message.user?.id === userId;
          
          return (
            <div
              key={message.id}
              className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex max-w-xs lg:max-w-md ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`}>
                {/* User Avatar */}
                {!isOwnMessage && (
                  <div className="flex-shrink-0 mr-3">
                    <Image
                      src={message.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(message.user?.name || "User")}&background=6b7280&color=fff`}
                      alt={message.user?.name || "User"}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full"
                    />
                  </div>
                )}

                {/* Message Content */}
                <div
                  className={`px-4 py-2 rounded-lg ${
                    isOwnMessage
                      ? "bg-blue-600 text-white rounded-br-sm"
                      : "bg-gray-700 text-gray-100 rounded-bl-sm"
                  }`}
                >
                  {!isOwnMessage && (
                    <div className="text-xs text-gray-300 font-medium mb-1">
                      {message.user?.name}
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <p className={`text-xs mt-1 ${isOwnMessage ? "text-blue-200" : "text-gray-400"}`}>
                    {formatTime((message && 'created_at' in message && message.created_at ? (message.created_at as string | Date) : new Date()))}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors font-medium"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};
