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
    const body: body = req.body; //extracting request body
    console.log(body);

    //validating signup data using Zod schema
    const { success } = signupSchema.safeParse(body); //zod always return an object which contain success and data so we can used {success} to direct catch "true or false".
    //checking that data is safely parsed or not
    if(!success) {
        return res.json({
            message: "Email already registered / incorrect input"
        })
    }
    //checking if user already exists in database 
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
    //creating and storing user in database
    const createUser = await prisma.user.create({
        data: {
            username: body.username!,
            password: body.password!,
            firstName: body.firstName!,
            lastName: body.lastName!
        }
    })

    //Generating JWT token for user
    const userId = createUser.id;
    const token = Jwt.sign(
        {
            userId
        },
        SECRET_KEY
    )

    //Returning success response with token
    return res.status(statusCode.OK).json({
        message: "User created successfully",
        token: token
    })
}


const signinUser = async(req: Request, res: Response) => {
    const body: body = req.body; // extracting request body

    //validating signin data using Zod schema
    const { success } = signinSchema.safeParse(body);
    //checking that data is safely parsed or not
    if(!success) {
        return res.json({
            message: "Incorrect input"
        })
    }

    //checking if user exists in database
    const userExists = await prisma.user.findFirst({
        where: {
            username: req.body.username
        }
    })


    //Generating JWT token for user
    const token = Jwt.sign(
        {
            userId: userExists!.id
        },
        SECRET_KEY
    )

    // Returning success response with token
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

    // Extracting userId from request
    const userId: number = req.userId!;
    // Updating user data in the database
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


    const getUserData = async (req: RequestWithUserId, res: Response) => {
         // Retrieving user data from the database
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