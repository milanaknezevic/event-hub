const validation = (schema) => async (req, res, next) => {
    try {
        await schema.validateSync(req.body, { abortEarly: false });
        return next();
    } catch (err) {
        const errors = err.inner.map(error => ({
            field: error.path,
            message: error.message
        }));
        return res.status(400).json({ errors });
    }
};
module.exports = validation