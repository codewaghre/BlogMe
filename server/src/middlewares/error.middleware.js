//if not error found
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    // Log the error for debugging
    console.error("Error Middleware:", err);

    // Default to 500 if no status code is provided
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error ";

    // Send the error response
    res.status(statusCode).json({
        success: false,
        message: message,
        stack: process.env.NODE_ENV === "development" ? err.stack : null,
    });
};

export { notFound, errorHandler }