export const handleError = (error, req, res, next) => {
    if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(403)
        res.send({ status: 'error', message: "Resource already exists"});
    } else if (['SequelizeDatabaseError', 'SequelizeValidationError'].includes(error.name)) {
        res.status(400)
        res.send({ status: 'error', message: error.message});
    } else {
        res.status(500)
        res.send({ status: 'error', message: "Something went wrong"});
    }
}