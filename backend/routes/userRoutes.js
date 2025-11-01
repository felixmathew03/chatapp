import { Router } from "express";
import Auth from "../middleware/Auth.js";
import * as user from '../handlers/userHandler.js'
const userRoutes = Router()

userRoutes.route('/nav').get(Auth,user.nav);
userRoutes.route('/home').get(Auth,user.home);
userRoutes.route('/profile').get(Auth,user.profile);
userRoutes.route('/listpeople').get(Auth,user.listPeople);
userRoutes.route('/userprofile/:id').get(Auth,user.userProfile);
userRoutes.route("/editdetails").put(Auth,user.editDetails);


export default userRoutes;