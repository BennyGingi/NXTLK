import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Avatar, AvatarImage } from "../ui/avatar";
import { useSelectedUser } from "@/store/useSelectedUser";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useQuery } from "@tanstack/react-query";
import { getMessages } from "@/actions/message.actions";
import { useEffect, useRef, useState } from "react";
import MessageSkeleton from "../skeleton/MessageSkeleton";
import { pusherClient } from "@/lib/pusher";

const MessageList = () => {
	const { selectedUser } = useSelectedUser();
	const { user: currentUser, isLoading: isUserLoading } = useKindeBrowserClient();
	const messageContainerRef = useRef<HTMLDivElement>(null);
	const [isTyping, setIsTyping] = useState(false);
	const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

	const { data: messages, isLoading: isMessagesLoading } = useQuery({
		queryKey: ["messages", selectedUser?.id],
		queryFn: async () => {
			if (selectedUser && currentUser) {
				return await getMessages(selectedUser?.id, currentUser?.id);
			}
		},
		enabled: !!selectedUser && !!currentUser && !isUserLoading,
	});

	const scrollToBottom = () => {
		if (messageContainerRef.current && shouldAutoScroll) {
			messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
		}
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages, isTyping]);

	useEffect(() => {
		const container = messageContainerRef.current;
		if (!container) return;

		const handleScroll = () => {
			const { scrollTop, scrollHeight, clientHeight } = container;
			const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px threshold
			setShouldAutoScroll(isAtBottom);
		};

		container.addEventListener('scroll', handleScroll);
		return () => container.removeEventListener('scroll', handleScroll);
	}, []);

	useEffect(() => {
		if (selectedUser && currentUser) {
			const channelName = `${currentUser.id}__${selectedUser.id}`.split("__").sort().join("__");
			const channel = pusherClient.subscribe(channelName);

			channel.bind("typingStatus", ({ userId, isTyping }: { userId: string; isTyping: boolean }) => {
				if (userId === selectedUser.id) {
					setIsTyping(isTyping);
					scrollToBottom();
				}
			});

			channel.bind("newMessage", () => {
				scrollToBottom();
			});

			return () => {
				channel.unbind("typingStatus");
				channel.unbind("newMessage");
				pusherClient.unsubscribe(channelName);
			};
		}
	}, [selectedUser, currentUser]);

	return (
		<div ref={messageContainerRef} className='w-full overflow-y-auto overflow-x-hidden h-full flex flex-col'>
			<AnimatePresence>
				{!isMessagesLoading &&
					messages?.map((message, index) => (
						<motion.div
							key={index}
							layout
							initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
							animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
							exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
							transition={{
								opacity: { duration: 0.1 },
								layout: {
									type: "spring",
									bounce: 0.3,
									duration: messages.indexOf(message) * 0.05 + 0.2,
								},
							}}
							style={{
								originX: 0.5,
								originY: 0.5,
							}}
							className={cn(
								"flex flex-col gap-2 p-4 whitespace-pre-wrap",
								message.senderId === currentUser?.id ? "items-end" : "items-start"
							)}
						>
							<div className='flex gap-3 items-center'>
								{message.senderId === selectedUser?.id && (
									<Avatar className='flex justify-center items-center'>
										<AvatarImage
											src={selectedUser?.image}
											alt='User Image'
											className='border-2 border-white rounded-full'
										/>
									</Avatar>
								)}
								{message.messageType === "text" ? (
									<span className='bg-accent p-3 rounded-md max-w-xs'>{message.content}</span>
								) : (
									<img
										src={message.content}
										alt='Message Image'
										className='border p-2 rounded h-40 md:h-52 object-cover'
									/>
								)}

								{message.senderId === currentUser?.id && (
									<Avatar className='flex justify-center items-center'>
										<AvatarImage
											src={currentUser?.picture || "/user-placeholder.png"}
											alt='User Image'
											className='border-2 border-white rounded-full'
										/>
									</Avatar>
								)}
							</div>
						</motion.div>
					))}

				{isMessagesLoading && (
					<>
						<MessageSkeleton />
						<MessageSkeleton />
						<MessageSkeleton />
					</>
				)}

				{isTyping && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 20 }}
						className="flex items-center p-4"
					>
						<Avatar className='flex justify-center items-center'>
							<AvatarImage
								src={selectedUser?.image}
								alt='User Image'
								className='border-2 border-white rounded-full'
							/>
						</Avatar>
						<span className="ml-2 text-sm text-gray-500">Typing...</span>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default MessageList;