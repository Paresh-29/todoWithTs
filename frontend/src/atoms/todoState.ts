import { atom } from "recoil";
import { TodoData } from "../types";

export const todoState = atom<TodoData[]>({
    key: 'todoState',
    default: [],
});