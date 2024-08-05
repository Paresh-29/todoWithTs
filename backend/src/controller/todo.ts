import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { createTodo, updateTodo } from "../zod/todo";

const prisma = new PrismaClient();

enum statusCode {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

interface RequestWithUserId extends Request {
  userId?: number;
}

const createtodo = async (req: RequestWithUserId, res: Response) => {
  const { title, description } = req.body;
  const validation = createTodo.safeParse({ title, description });

  if (!validation.success) {
    return res.status(statusCode.BAD_REQUEST).json({
      message: "incorrect validation",
    });
  }

  const userId: number = req.userId!;

  const todo = await prisma.todo.create({
    data: {
      title,
      description,
      userId,
    },
  });

  return res.status(statusCode.OK).json({
    message: "todo created successfully",
    data: todo,
  });
};

// View all todos for the authenticated user
const viewTodo = async (req: RequestWithUserId, res: Response) => {
  const userId: number = req.userId!;

  try {
    const todos = await prisma.todo.findMany({
      where: {
        userId,
      },
    });

    return res.status(statusCode.OK).json({
      todos,
    });
  } catch (error) {
    console.error("Failed to fetch todos:", error);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      message: "Failed to fetch todos",
    });
  }
};

const updatetodo = async (req: RequestWithUserId, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  // Validate only the fields that are present
  const validation = updateTodo.partial().safeParse(updateData);
  if (!validation.success) {
    return res.status(statusCode.BAD_REQUEST).json({
      message: "Invalid data",
      errors: validation.error.errors,
    });
  }

  try {
    const todo = await prisma.todo.update({
      where: {
        id: Number(id),
        userId: req.userId, // Ensure the todo belongs to the user
      },
      data: updateData,
    });

    return res.status(statusCode.OK).json({
      message: "Todo updated successfully",
      data: todo,
    });
  } catch (error) {
    console.error("Failed to update todo:", error);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      message: "Failed to update todo",
    });
  }
};

export { createtodo, viewTodo, updatetodo };
