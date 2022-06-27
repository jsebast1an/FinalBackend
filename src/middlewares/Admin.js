

function adminMiddleware(req, res, next) {
    let admin = true;

    if (!admin) {
        res.status(400).send({
            status: "Not admin",
            message: "Try again later"
        });
    } else {
        next();
    }
}


export default adminMiddleware;