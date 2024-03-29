const yup = require('yup');
const moment = require('moment');

const loginSchema = yup.object().shape({
    username: yup
        .string()
        .required("Username is required!"),
    password: yup
        .string()
        .min(2, "Password must be at least 2 characters!")
        .required("Password is required!"),
});

const registrationSchema = yup.object().shape({
    name: yup.string().required('Name is required!'),
    lastname: yup.string().required('Lastname is required!'),
    mail: yup.string().email('Enter a valid email address').required('Email is required!'),
    username: yup.string().required('Username is required!'),
    password: yup.string().required('Password is required!').min(8, 'Password must be at least 8 characters!'),
    confirmPassword: yup.string().required('Confirm password is required!').min(2, 'Confirm password must be at least 8 characters!')
        .oneOf([yup.ref('password'), null], 'Passwords must match!'),
    phoneNumber: yup.string().required('Phone number is required!'),
    role: yup.string().required('Role is required!'),
});
const updateUserSchema = yup.object().shape({
    name: yup.string().required('Name is required!'),
    lastname: yup.string().required('Lastname is required!'),
    mail: yup.string().email('Enter a valid email address').required('Email is required!'),
    username: yup.string().required('Username is required!'),
    phoneNumber: yup.string().required('Phone number is required!'),
    role: yup.string().required('Role is required!'),
});
const changePasswordSchema = yup.object().shape({
    old_password: yup.string()
        .required('Old password is required!')
        .min(8, 'Old password must be at least 8 characters long!'),
    new_password: yup.string()
        .required('New password is required!')
        .min(8, 'New password must be at least 8 characters long!')
        .notOneOf([yup.ref('old_password')], 'New password must be different from the old password!'),
    confirm_password: yup.string()
        .required('Please confirm your new password.')
        .oneOf([yup.ref('new_password'), null], 'Passwords must match!'),
});
const editUserSchema = yup.object().shape({
    name: yup.string().required('Name is required!'),
    lastname: yup.string().required('Last name is required!'),
    email: yup.string().email('Enter a valid email address!').required('Email is required!'),
    username: yup.string().required('Username is required!'),
    phoneNumber: yup.string().required('Phone number is required!'),
    role: yup.string().required('Role is required!'),
    status: yup.string().required('Status is required!'),
});

const leaveCommentSchema = yup.object().shape({
    question: yup
        .string()
        .required("Question is required!"),
});
const commentSchema = yup.object().shape({
    answer: yup
        .string()
        .required("Answer is required!"),
});
const addGeneralEvent = yup.object().shape({
    name: yup.string().required('Name is required!'),
    description: yup.string().required('Description is required!'),
    startTime: yup.string().required('Start time is required!'),
    endTime: yup.string().test('is-greater', 'End time must be greater than Start time!', function (value) {
        const {startTime} = this.parent;
        const startDate = moment(startTime, 'DD.MM.YYYY. HH:mm').toDate();
        const endDate = moment(value, 'DD.MM.YYYY. HH:mm').toDate();
        return startDate <= endDate;
    }).required('End time is required!'),
    eventType_id: yup.string().required('Event type is required!'),
    location_id: yup.string().required('Location is required!'),
});
const createTicketSchema = yup.object().shape({
    question: yup.string().required('Question is required!'),
});
const replyToTicketSchema = yup.object().shape({
    answer: yup.string().required('Answer is required!'),
});

module.exports = {
    loginSchema,
    replyToTicketSchema,
    createTicketSchema,
    addGeneralEvent,
    commentSchema,
    leaveCommentSchema,
    updateUserSchema,
    registrationSchema,
    changePasswordSchema,
    editUserSchema
};
