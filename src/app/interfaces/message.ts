import { User } from "./user";

export interface Message {
    id?: number;
    text?: string;
    userId?: Int16Array;
    user?: User;
    createdAt?: Date;
}