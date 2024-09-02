import { User } from "@/db/dummy";
import { create } from "zustand";

type UserStatus = "online" | "offline" | "away";

type SelectedUserState = {
	selectedUser: User | null;
	setSelectedUser: (user: User | null) => void;
	userStatus: UserStatus;
	setUserStatus: (status: UserStatus) => void;
};

export const useSelectedUser = create<SelectedUserState>((set) => ({
	selectedUser: null,
	setSelectedUser: (user: User | null) => set({ selectedUser: user }),
	userStatus: "offline",
	setUserStatus: (status: UserStatus) => set({ userStatus: status }),
}));
