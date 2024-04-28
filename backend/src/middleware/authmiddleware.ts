// import jwt, { JwtPayload } from "jsonwebtoken";
// import { Request, Response, NextFunction } from "express";
// import { error } from "console";

// const SECRET_KEY : string | undefined = process.env.SECRET_KEY;

// interface CustomRequest extends Request {
//     userId?: number;
// }

// enum statusCode {
//     OK = 200,
//     BAD_REQUEST = 400,
//     UNAUTHORIZED = 401,
//     FORBIDDEN = 403,
//     NOT_FOUND = 404,
//     INTERNAL_SERVER_ERROR = 500,
// }

// const authmiddleware = (req: Request, res: Response, next: NextFunction) => {
    
//        try {
//          const authHeader: string | undefined = req.headers.authorization;
//          if(!authHeader || !authHeader.startsWith("Bearer ")) {
//              res.status(statusCode.FORBIDDEN).json({ error: "Unauthorized access." });
//          }
 
//          const token: string = authHeader.split(" ")[1];
 
//          if(!SECRET_KEY) {
//              return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error: Secret key is not provided" });
//          }

//          const decode: JwtPayload | undefined = jwt.verify(token, SECRET_KEY) as JwtPayload;

//          if(!decode || decode.userId) {
//             return res.status(statusCode.FORBIDDEN).json({ error: "Invalid or expired token." });
//          }

//          req.userId = decode.userId;
//          next();
//        } catch (err) {
//         console.error("Error in authentication middleware:", err);
//         return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
//        }


//  }
