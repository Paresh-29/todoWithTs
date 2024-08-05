import { atom } from "recoil";

interface UserState {
  id: number | null;
  username: string;
  firstName: string;
  lastName: string;
  token: string;
}

export const userState = atom<UserState>({
    key: 'userState',
    default: {
        id: null,
        username: '',
        firstName: '',
        lastName: '',
        token: '',
    }
});