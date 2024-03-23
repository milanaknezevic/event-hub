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
 const updateUserSchema = yup.object().shape({
    name: yup.string().required('Required'),
    lastname: yup.string().required('Required'),
    email: yup.string().email('Enter a valid email address').required('Email is required'),
    username: yup.string().required('Required'),
    phoneNumber: yup.string().required('Required'),
    role: yup.string().required('Required'),
});
const changePasswordSchema = yup.object().shape({
    old_password: yup.string()
        .required('Old password is required'),
    // .min(8, 'Old password must be at least 8 characters long'),
    new_password: yup.string()
        .required('New password is required')
        // .min(8, 'New password must be at least 8 characters long')
        .notOneOf([yup.ref('old_password')], 'New password must be different from the old password'),
    confirm_password: yup.string()
        .required('Please confirm your new password')
        .oneOf([yup.ref('new_password'), null], 'Passwords must match'),
});
const editUserSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    lastname: yup.string().required('Last name is required'),
    email: yup.string().email('Enter a valid email address').required('Email is required'),
    username: yup.string().required('Username is required'),
    phoneNumber: yup.string().required('Phone number is required'),
    role: yup.string().required('Role is required'),
    status: yup.string().required('Status is required'),
});

module.exports = {
    loginSchema,
    updateUserSchema,
    registrationSchema,
    changePasswordSchema,
    editUserSchema
};
