import { Router } from "express";
import Auth from "../middleware/Auth.js";
import * as msg from '../handlers/messageHandler.js'

const messageRoutes = Router();

messageRoutes.route('/chat/:rid').get(Auth,msg.chat);
messageRoutes.route("/addmessage/:rid").post(Auth,msg.addMessage);
messageRoutes.route("/deletemessage/:_id").delete(Auth,msg.deleteMessage);

export default messageRoutes;