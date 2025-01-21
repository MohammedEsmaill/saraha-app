import joi from "joi";
import { genralRules } from "../../utlities/genralRules.js";
export const signUpSchema = {
    body:joi.object({
        name:joi.string().alphanum().min(3).messages({"string.min":"name is short"}),
        email:genralRules.email.required(),
        password:genralRules.password.required(),
        cPassword:joi.string().valid(joi.ref("password")).required(),
        phone:genralRules.phone.required(),
        age:joi.number().min(18).max(120).required()
    })
}
export const logInSchema = {
    body:joi.object({
            email:genralRules.email.required(), 
            password:genralRules.password.required()
        })
}
export const getProfileSchema = {
    headers:genralRules.headers
}
export const updateProfileSchema = {
    body:joi.object({
            name:joi.string().alphanum().min(3),
            phone:joi.string().regex(/^(010|011|012|015)\d{8}$/)
        }),
    headers:genralRules.headers
}

export const updatePasswordSchema = {
    body:joi.object({
            password:genralRules.password.required(),
            newPassword:genralRules.password.required(),
            cNewPassword:joi.string().valid(joi.ref("newPassword")).required()
        }),
    headers:genralRules.headers
}
export const freezeAcountSchema = {
    headers:genralRules.headers
}
export const shareProfileSchema = {
    params:joi.object({
        id:genralRules.id.required(),
    }).required()
}