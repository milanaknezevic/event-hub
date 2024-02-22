const yup=require('yup')

const loginSchema = yup.object().shape({
    username: yup
        .string()
        .required("Username is required"),
    password: yup
        .string()
        .min(2, "Password must be at least 2 characters")
        .required("Password is required")
});

module.exports={
    loginSchema
}