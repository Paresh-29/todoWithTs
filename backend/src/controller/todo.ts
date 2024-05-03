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

interface body {
    id?: number;
    title?: string;
    description?: string;
}

const createtodo = async (req: RequestWithUserId, res: Response) => {
    const body: body = req.body;
    const validation = createTodo.safeParse(body);

    if(!validation.success) {
        return res.status(statusCode.BAD_REQUEST).json({
            message: "incorrect validation"
        })
    }

    const userId: number = req.userId!;

    const todo = await prisma.todo.create({
        data: {
            title: body.title!,
            description: body.description!,
            userId: userId,
        }
    });

    return res.status(statusCode.OK).json({
        message: "todo created successfully",
        data: todo
    })
}


const viewTodo = async (req: RequestWithUserId, res: Response) => {
    const todos = await prisma.todo.findMany({
        where: {
            userId: req.userId,
        }
    })

    return res.status(statusCode.OK).json({
        todos
    })
}

const updatetodo = async (req:Request, res: Response) => {
    const body: body = req.body;
    const validation = updateTodo.safeParse(body);

    if(!validation.success) {
        return res.status(statusCode.BAD_REQUEST).json({
            message: "incorrect validation"
        })
    }

    await prisma.todo.update({
        where: {
            id: body.id!
        },
        data: {
            done: true,
        }
    });

    return res.status(statusCode.OK).json({
        message: "todo updated successfully"
    })
}


export {
    createtodo,
    viewTodo,
    updatetodo
}


