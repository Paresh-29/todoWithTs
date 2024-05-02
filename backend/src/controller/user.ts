import { PrismaClient } from "@prisma/client";
import { signinSchema, signupSchema, updateSchema } from "../zod/user";
import Jwt  from "jsonwebtoken";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const SECRET_KEY: string  = process.env.JWT_SECRET!;


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
    username?: string,
    password?: string,
    firstName?: string,
    lastName?: string
}


const signupUser = async(req: Request, res: Response) => {
    const body: body = req.body;
    console.log(body);

    const { success } = signupSchema.safeParse(body); //zod always return an object which contain success and data so we can used {success} to direct catch "true or false".
    //checking that data is safely parsed or not
    if(!success) {
        return res.json({
            message: "Email already registered / incorrect input"
        })
    }
    //checking user exsistence
    const userExists = await prisma.user.findFirst({
        where: {
            username: req.body.username
        }
    })

    if(userExists) {
        return res.json({
            message: "Email already registered / incorrect input"
        })
    }
    //creating and storing user in data base
    const createUser = await prisma.user.create({
        data: {
            username: body.username!,
            password: body.password!,
            firstName: body.firstName!,
            lastName: body.lastName!
        }
    })

    const userId = createUser.id;

    const token = Jwt.sign(
        {
            userId
        },
        SECRET_KEY
    )

    return res.status(statusCode.OK).json({
        message: "User created successfully",
        token: token
    })
}


const signinUser = async(req: Request, res: Response) => {
    const body: body = req.body;

    const { success } = signinSchema.safeParse(body);
    if(!success) {
        return res.json({
            message: "Incorrect input"
        })
    }

    const userExists = await prisma.user.findFirst({
        where: {
            username: req.body.username
        }
    })

    const token = Jwt.sign(
        {
            userId: userExists!.id
        },
        SECRET_KEY
    )

    return res.status(statusCode.OK).json({
        message: "User signed in successfully",
        token: token
    })
}


    const updateUserData = async(req: RequestWithUserId, res: Response) => {
    const body: body = req.body;
    console.log(body);

    const { success } = updateSchema.safeParse(body)
    
    if (!success) {
        return res.json({
            message: "user not signed in successfully"
        })
    }

    const userId: number = req.userId!;
    await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            firstName: body.firstName,
            lastName: body.lastName,
            password: body.password,
        }
    });

    return res.status(statusCode.OK).json({
        message: "userdata updated successfully"
    })
}

    // interface userData {
    //     id: number,
    //     username: string,
    //     firstName: string,
    //     lastName: string,
    //     password: string
    // }

    const getUserData = async (req: RequestWithUserId, res: Response) => {
        const userData = await prisma.user.findFirst({
            where: {
                id: req.userId!
            }
        })

        if(!userData) {
            return res.status(statusCode.NOT_FOUND).json({
                message: "User not found"
            })
        }
        else {
            return res.status(statusCode.OK).json({
                message: "user found",
                userData
            })
        }
}

export { signinUser, signupUser, updateUserData, getUserData}