const  USER_ROLES = Object.freeze( {
    ADMIN: 0,
    SUPPORT: 1,
    CLIENT: 2,
});

const USER_STATUS = {
    REQUESTED: 0,
    ACTIVE: 1,
    BLOCKED: 2,
};
const STATUS = {
    OPENED: 0,
    CLOSED: 1,
    IN_PROGRESS: 2,
};

const PRIORITY = {
    LOW: 0,
    MEDIUM: 1,
    HIGH: 2,
};

module.exports = {
    USER_ROLES,
    STATUS,
    PRIORITY,
    USER_STATUS
}