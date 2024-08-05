import { TodoData, UserSigninData, UserSignupData } from "../types";
import axiosInstance from "./axiosInstance";

export const signupUser = async (data: UserSignupData) => {
  const response = await axiosInstance.post("/user/signup", data);
  return response.data;
};

export const signinUser = async (data: UserSigninData) => {
  const response = await axiosInstance.post("/user/signin", data);
  return response.data;
};

export const updateUserData = async (data: UserSignupData) => {
  const response = await axiosInstance.put("/user/update", data);
  return response.data;
};

export const getUserData = async () => {
  const response = await axiosInstance.get("/user/getUser");
  return response.data;
};

export const createTodo = async (data: Omit<TodoData, "id">) => {
  const response = await axiosInstance.post("/todo/create", data);
  return response.data;
};

export const getTodo = async () => {
  const response = await axiosInstance.get("/todo/todos");
  return response.data;
};

export const updateTodo = async (
  id: number,
  data: Partial<Omit<TodoData, "id">>
) => {
  if (id === undefined || isNaN(id)) {
    throw new Error("Invalid todo ID");
  }
  const response = await axiosInstance.put(`/todo/${id}`, data);
  return response.data;
};