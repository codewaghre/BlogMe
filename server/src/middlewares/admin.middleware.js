import jwt from 'jsonwebtoken'
const onlyAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken
        console.log(token);

        if (!token) {
            return next(403, 'Forbidden: Only admins can access this route')
        }
        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        console.log("decodeToken", decodeToken);

        if (decodeToken.role === 'admin') {
            req.user = decodeToken
            next()
        } else {
            return next(403, 'Forbidden: Only admins can access this route')
        }
    } catch (error) {
        next(500, error.message)
    }
}

export { onlyAdmin }