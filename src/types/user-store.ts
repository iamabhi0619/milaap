import { User } from "./table";

export interface UserStore {
    id: string | null;
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string, isRemember: boolean) => Promise<boolean>;
    register: (email: string, password: string, name: string, gender: string) => Promise<boolean>;
    logout: () => Promise<void>;
    forgetPassword: (email: string) => Promise<boolean>;
    fetchUser: () => Promise<void>;
}