import { Router } from "express";
import authRoutes from "./auth.routes.js";
import propertyRoutes from "./properties.routes.js";

const router = Router();
router.use("/auth", authRoutes);
router.use("/properties", propertyRoutes);
export default router;
