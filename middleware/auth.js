const jwt = require('jsonwebtoken');

const verifyUserToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).send("Access Denied / Unauthorized request");
    }

    try {
        const tokenWithoutBearer = token.split(' ')[1];

        if (!tokenWithoutBearer) {
            return res.status(401).send('Unauthorized request');
        }

        const verifiedUser = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);

        if (!verifiedUser) {
            return res.status(401).send('Unauthorized request');
        }

        req.user = verifiedUser; // user_id & user_type_id
        next();

    } catch (error) {
        res.status(401).send("Invalid Token");
    }
}

const checkRole = (expectedRole) => {
    return (req, res, next) => {
        if (req.user && req.user.role === expectedRole) {
            next();
        } else {
            res.status(401).send("Unauthorized!");
        }
    };
};
const  IsOrganizerOrClient = (req, res, next) => {
    const isOrganizer = req.user && req.user.role === 0;
    const isClient = req.user && req.user.role === 2;

    if (isOrganizer || isClient) {
        next();
    } else {
        res.status(401).send("Unauthorized!");
    }
}

const IsOrganizer = checkRole(0);
const IsSupport = checkRole(1);
const IsClient = checkRole(2);

module.exports = {
    verifyUserToken,
    IsOrganizer,
    IsSupport,
    IsClient,
    IsOrganizerOrClient
};
