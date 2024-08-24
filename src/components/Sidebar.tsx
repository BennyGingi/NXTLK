import { User } from "@/db/dummy";
import { ScrollArea } from "./ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import useSound from "use-sound";
import { usePrefrences } from "@/store/usePrefrences";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useSelectedUser } from "@/store/useSelectedUser";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

interface SidebarProps {
	isCollapsed: boolean;
	users: User[];
}

const Sidebar = ({ isCollapsed, users }: SidebarProps) => {
	const [playClickSound] = useSound("/sounds/mouse-click.mp3");
	const { soundEnabled } = usePrefrences();
	const { setSelectedUser, selectedUser } = useSelectedUser();
	const { user } = useKindeBrowserClient();

	return (
		<div className='group relative flex flex-col h-full gap-4 p-2 data-[collapsed=true]:p-2  max-h-full overflow-auto bg-background'>
			{!isCollapsed && (
				<div className='flex justify-between p-2 items-center'>
					<div className='flex gap-2 items-center text-2xl'>
						<p className='font-medium'>Chats</p>
					</div>
				</div>
			)}

			<ScrollArea className='gap-2 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2'>
				{users.map((user, idx) => (
					<TooltipProvider key={idx}>
						<Tooltip delayDuration={0}>
							<TooltipTrigger asChild>
								<Button
									variant={"ghost"}
									size='default'
									className={cn(
										"w-full justify-start gap-4 my-1 px-3 py-2 rounded-lg text-left transition-colors h-10",
										"bg-gray-800 hover:bg-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800",
										selectedUser?.email === user.email &&
											"bg-blue-900 text-white border border-slate-500 dark:bg-slate-500 dark:border-slate-800"
									)}
									onClick={() => {
										soundEnabled && playClickSound();
										setSelectedUser(user);
									}}
								>
									<Avatar className='flex justify-center items-center'>
										<AvatarImage
											src={user.image || "/user-placeholder.png"}
											alt={"User image"}
											className='w-10 h-10'
										/>
										<AvatarFallback>{user.name[0]}</AvatarFallback>
									</Avatar>
									<div className='flex flex-col max-w-28'>
										<span className='text-sm font-medium truncate'>{user.name}</span>
										<span className='text-xs text-muted-foreground truncate'>{user.email}</span>
									</div>
								</Button>
							</TooltipTrigger>

							{/* Tooltip content with user info */}
							<TooltipContent side='right' className='p-4 w-52 text-center bg-white dark:bg-gray-800 rounded-lg shadow-lg'>
								<p className='font-semibold text-gray-900 dark:text-white'>
									{user.name.split(" ")[0]} {user.name.split(" ")[1]}
								</p>
								<p className='text-sm text-gray-500 dark:text-gray-400'>
									{user.email}
								</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				))}
			</ScrollArea>

			{/* Logout Section */}
			<div className='mt-auto'>
				<div className='flex justify-between items-center gap-2 md:px-6 py-2'>
					{!isCollapsed && (
						<div className='hidden md:flex gap-2 items-center '>
							<Avatar className='flex justify-center items-center'>
								<AvatarImage
									src={user?.picture || "/user-placeholder.png"}
									alt='avatar'
									referrerPolicy='no-referrer'
									className='w-8 h-8 border-2 border-blue-500 rounded-full'
								/>
							</Avatar>
							<p className='font-bold'>
								{user?.given_name} {user?.family_name}
							</p>
						</div>
					)}
					<div className='flex'>
						<LogoutLink>
							<LogOut size={22} cursor={"pointer"} />
						</LogoutLink>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
