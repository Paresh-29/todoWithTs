export interface UserSignupData {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
}

export interface UserSigninData {
    username: string;
    password: string;
}

export interface TodoData {
    title: string;
    description: string;
    completed?: boolean;
}