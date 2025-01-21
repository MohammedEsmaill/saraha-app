import joi from "joi";
import { genralRules } from "../../utlities/genralRules.js";
export const sendMessageSchema = {
    body:joi.object({
        content:joi.string().min(1).required(),
        userId:genralRules.id.required()
    }).required()
}
export const getMessageSchema = {
    headers:genralRules.headers
}