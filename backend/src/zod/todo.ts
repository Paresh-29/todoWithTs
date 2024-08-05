import { z } from "zod";

const createTodo = z.object({
  title: z.string(),
  description: z.string(),
});


const updateTodo = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  completed: z.boolean(),
});


export { createTodo, updateTodo };
