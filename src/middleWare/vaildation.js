import { asyncHandler } from "../utlities/errorHandling.js"

export const validation = (schema) => {
    return asyncHandler(
        async(req, res, next) => {
            let validationResult = [];
            for (const key of Object.keys(schema)) {
                const validationError = schema[key].validate(req[key], { abortEarly: false })
                if (validationError?.error) {
                    validationResult.push(validationError?.error?.details)
                    console.log(validationError?.error?.details);
                    
                }
            }
            if (validationResult.length>0) {
                return next(new Error("validation error",validationResult,{cause:400}))
            }
            next()
        }
    )
}