import { Router } from "express";
import * as rh from '../handlers/authHandler.js'
const authRoutes = Router()

authRoutes.route("/signup").post(rh.signUp);
authRoutes.route("/signin").post(rh.signIn);
authRoutes.route("/forgotpassword").post(rh.forgotPassword);
authRoutes.route("/changepassword").post(rh.changePassword);


export default authRoutes;