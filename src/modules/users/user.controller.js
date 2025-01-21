import {Router} from "express"
import * as US from "./user.service.js";
import { authentication, authorization } from "../../middleWare/auth.js";
import { validation } from "../../middleWare/vaildation.js";
import * as UV from "./user.validation.js";
import { roles } from "../../DB/models/users.model.js";
const userRouter = Router();
userRouter.post("/signUp",validation(UV.signUpSchema),US.signUp)
userRouter.post("/logIn",validation(UV.logInSchema),US.logIn)
userRouter.get("/profile",validation(UV.getProfileSchema),authentication,authorization(roles.user),US.getUser)
userRouter.get("/confirmEmail/:token",US.confirmEmail)
userRouter.patch("/updateProfile",validation(UV.updateProfileSchema),authentication,US.updateUser)
userRouter.patch("/updateProfile/password",validation(UV.updatePasswordSchema),authentication,US.updateUserPassword)
userRouter.delete("/softDelete",validation(UV.freezeAcountSchema),authentication,US.freezeAcount)
userRouter.get("/shareProfile/:id",validation(UV.shareProfileSchema),US.shareProfile)
export default userRouter;
