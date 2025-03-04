const zod = require("zod");

const signUpUser = zod.object({
    username: zod.string(),
    email: zod.string().email(),
    password: zod.string().min(8)
})

const signInUser = zod.object({
    email: zod.string().email(),
    password: zod.string().min(8)
})

module.exports =  {
    signUpUser,
    signInUser
};
