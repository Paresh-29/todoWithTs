import Jwt, {JwtPayload}  from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const JWT_SECRET: string = process.env.JWT_SECRET!;

interface CustomRequest extends Request {
    userId?: number
}

enum statusCode {
    OK = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
}


const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader: string = req.headers.authorization!;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(statusCode.UNAUTHORIZED).json({
            message: "Invalid Bearer"
        })
    }

    const token: string = authHeader.split(" ")[1];
    try {
        const decode: JwtPayload = Jwt.verify(token, JWT_SECRET) as JwtPayload;

        if(decode.userId) {
            req.userId = decode.userId;
            next();
        } else {
            return res.status(statusCode.UNAUTHORIZED).json({
                message: "Invalid or expired token."
            })
        }
    } catch(e) {
        console.error("Error in authentication middleware:", e);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            message: "Internal Server Error"
        })
    }
}

export default authMiddleware ;