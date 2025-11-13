// import { User } from "./table";

import { ChatsType } from "../chats";

export interface ChatStore {
    loading: boolean;
    error: string | null;
    chats: ChatsType[] | null;
    fetchChats: () => Promise<void>;
    addDM: (userId: string) => Promise<void>;
}