import { Button } from "@/components/ui/button";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

const page = async () => {
    const { isAuthenticated } = getKindeServerSession();
    if (await isAuthenticated()) return redirect("/");

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex justify-center items-center p-6">
            <div className="max-w-md w-full bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 space-y-8 text-center">
                
                {/* Logo */}
                <div className="flex justify-center">
                    <img src="/NXTLK1.png" alt="NXTLK Logo" className="w-25 h-25 object-contain" />
                </div>

                {/* Welcome Message */}
                <div className="text-slate-500 font-bold text-3xl">
                    <span className="text-blue-500">Welcome</span> to NXTLK
                </div>

                {/* Buttons */}
                <div className="flex justify-center space-x-4">
                    <RegisterLink>
                        <Button className="bg-blue-950 text-slate-500 px-6 py-3 rounded-lg hover:bg-blue-400 transition duration-200">
                            Sign Up
                        </Button>
                    </RegisterLink>
                    
                    <LoginLink>
                        <Button className="bg-white text-black px-6 py-3 rounded-lg hover:bg-blue-800 transition duration-200">
                            Login
                        </Button>
                    </LoginLink>
                </div>

                {/* Slogan */}
                <div className="text-gray-400 text-sm">
                    Collaborate seamlessly with your team, stay connected, and get things done.
                </div>
            </div>
        </div>
    );
};

export default page;
