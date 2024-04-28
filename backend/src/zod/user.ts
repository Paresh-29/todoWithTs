import { z } from "zod";

const signupSchema = z.object({
    username : z.string().email(),
    password : z.string().min(8).max(20),
    firstName : z.string(),
    lastName : z.string()
})

const signinSchema = z.object({
    username : z.string().email(),
    password : z.string().min(8).max(20)
})

const updateSchema = z.object({
    firstName : z.string(),
    lastName : z.string(),
    password : z.string().min(8).max(20)
})

export {
    signupSchema,
    signinSchema,
    updateSchema
}
