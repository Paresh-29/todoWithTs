import { Router } from "express";
import authmiddleware from "../middleware/authmiddleware";
import { signinUser, signupUser, updateUserData, getUserData } from "../controller/user";


const router = Router();

router.post("/signin", authmiddleware, signinUser);
router.post("/signup", signupUser);
router.post("/update", authmiddleware, updateUserData);
router.get("/getUser", authmiddleware, getUserData);


export default router;