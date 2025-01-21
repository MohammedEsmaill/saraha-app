import { Router } from "express";
import { validation } from './../../middleWare/vaildation.js';
import * as MV from "./message.validation.js";
import * as MS from "./message.service.js";
import { authentication } from './../../middleWare/auth.js';
const messageRouter = Router();
messageRouter.post("/sendMessage",validation(MV.sendMessageSchema),MS.sendMessage)
messageRouter.get("/",validation(MV.getMessageSchema),authentication,MS.getMessage)
export default messageRouter;
