const yup = require('yup');
const { User } = require("../models");

const loginSchema = yup.object().shape({
    username: yup
        .string()
        .required("Username is required"),
    password: yup
        .string()
        .min(2, "Password must be at least 2 characters")
        .required("Password is required"),
});

const registrationSchema = yup.object().shape({
    name: yup.string().required('Required'),
    lastname: yup.string().required('Required'),
    email: yup.string().email('Enter a valid email address').required('Email is required'),
    username: yup.string().required('Required'),
    password: yup.string().required('Required').min(2, 'Password must be at least 2 characters'),
    confirmPassword: yup.string().required('Required').min(2, 'Password must be at least 2 characters')
        .oneOf([yup.ref('password'), null], 'Passwords must match'),
    phoneNumber: yup.string().required('Required'),
    role: yup.string().required('Required'),
});

// async function checkUsernameExists(username) {
//     try {
//         const user = await User.findOne({ where: { username } });
//         console.log("user ", user);
//         return !!user; // If user is found, return true; otherwise, return false
//     } catch (error) {
//         console.error('Error checking username existence:', error);
//         throw new Error('Error checking username existence');
//     }
// }

module.exports = {
    loginSchema,
    registrationSchema
};
