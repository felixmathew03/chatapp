import { Router } from "express";
import authRoutes from './authRoutes.js';
import userRoutes from "./userRoutes.js";
import messageRoutes from "./messageRoutes.js";

const router=Router();

router.use('/auth',authRoutes);
router.use('/user',userRoutes);
router.use('/message',messageRoutes)

export default router;