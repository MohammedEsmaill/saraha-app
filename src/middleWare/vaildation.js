import { asyncHandler } from "../utlities/errorHandling.js"

export const validation = (schema) => {
    return asyncHandler(
        async(req, res, next) => {
            let validationResult = [];
            for (const key of Object.keys(schema)) {
                const validationError = schema[key].validate(req[key], { abortEarly: false })
                if (validationError?.error) {
                    validationResult.push(validationError?.error?.details)
                }
            }
            if (validationResult.length>0) {
                console.log(result);
                return res.status(400).json({msg:"validation error",errors:validationResult})
                // return next(new Error("validation error",{errors:validationResult},{cause:400}))
            }
            next()
        }
    )
}