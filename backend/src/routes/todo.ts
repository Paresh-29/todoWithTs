import { Router } from "express";
import { createtodo, viewTodo, updatetodo } from "../controller/todo";
import authMiddleware from "../middleware/authmiddleware";

const router = Router();

router.post("/create",authMiddleware,createtodo);
router.get("/todos",authMiddleware,viewTodo);
router.post("/completed",authMiddleware,updatetodo);

export default router;