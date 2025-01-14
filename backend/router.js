import { Router } from "express";
import * as user from "./requestHandler.js";
import Auth from "./middleware/Auth.js";

const router=Router();

router.route("/signup").post(user.signUp); 
router.route("/signin").post(user.signIn);
router.route("/forgotpassword").post(user.forgotPassword);
router.route("/changepassword").post(user.changePassword);
router.route('/nav').get(Auth,user.nav);
router.route('/home').get(Auth,user.home);
router.route('/profile').get(Auth,user.profile);
router.route('/listpeople').get(Auth,user.listPeople);
router.route('/chat/:rid').get(Auth,user.chat);
router.route("/addmessage/:rid").post(Auth,user.addMessage);
router.route("/editdetails").put(Auth,user.editDetails);
router.route("/deletemessage/:_id").delete(Auth,user.deleteMessage);
router.route('/userprofile/:id').get(Auth,user.userProfile);

export default router;