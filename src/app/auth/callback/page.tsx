"use client";
import { checkAuthStatus } from "@/actions/auth.actions";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
	const router = useRouter();
	const { data, isLoading, isError } = useQuery({
		queryKey: ["authCheck"],
		queryFn: async () => await checkAuthStatus(),
	});

	// Redirect when authentication status is confirmed
	useEffect(() => {
		if (data?.success) {
			router.push("/");
		}
	}, [data, router]);

	if (isLoading) {
		return (
			<div className='mt-20 w-full flex justify-center'>
				<div className='flex flex-col items-center gap-2'>
					<Loader className='w-10 h-10 animate-spin text-muted-foreground' />
					<h3 className='text-xl font-bold'>Redirecting...</h3>
					<p>Please wait</p>
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className='mt-20 w-full flex justify-center'>
				<h3 className='text-xl font-bold'>Error checking authentication status.</h3>
			</div>
		);
	}

	// Prevent the UI from flashing if authentication check is incomplete
	return null;
};

export default Page;
