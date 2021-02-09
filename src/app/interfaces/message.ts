import { User } from "./user";

export interface Message {
    id?: number;
    text?: string;
    userId?: number;
    user?: User;
    createdAt?: string | Date;
}