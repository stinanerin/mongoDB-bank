export const restrict = (req, res, next) => {
    if (req.session.user) {
        // If user is signed in - continue
        next();
    } else {
        res.status(401).send({ error: "Unauthorized" });
    }
};
