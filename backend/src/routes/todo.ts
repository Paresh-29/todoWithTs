import { Router } from "express";
import { createtodo, viewTodo, updatetodo } from "../controller/todo";
import authMiddleware from "../middleware/authmiddleware";

const router = Router();

router.post("/create", authMiddleware, createtodo);
router.get("/todos", authMiddleware, viewTodo);
router.put("/:id", authMiddleware, updatetodo); // Changed to PUT and included ID in the URL

export default router;
