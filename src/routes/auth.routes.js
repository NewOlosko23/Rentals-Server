import { Router } from "express";
import { body } from "express-validator";
import { register, login, me } from "../controllers/auth.controller.js";
import { registerValidation } from "../middleware/validate.js";
import { auth } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validateRequest.js";

const r = Router();

r.post("/register", registerValidation, validateRequest, register);

r.post(
  "/login",
  [body("email").isEmail(), body("password").isLength({ min: 6 })],
  registerValidation,
  login
);

r.get("/me", auth, me);

export default r;
