import express from "express";
import { register, login } from "../controller/authController.js";

const router = express.Router();

router.post("/login", (req, res) => login(req, res));

router.post("/register", (req, res) => register(req, res));

export default router;
