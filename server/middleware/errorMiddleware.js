const notFound = (req, res, next) => {
    const error = new Error(`Route Not Found - ${req.originalUrl}`);

    res.status(404);
    next(error);
};


const errorHandler = (error, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    let message = error.message;

    // Invalid MongoDB ObjectId
    if (error.name === "CastError") {
        statusCode = 400;
        message = "Invalid ID";
    }

    // Duplicate email or other unique field
    if (error.code === 11000) {
        statusCode = 409;
        message = `${Object.keys(error.keyValue).join(", ")} already exists`;
    }

    // Mongoose validation error
    if (error.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(error.errors)
            .map((item) => item.message)
            .join(", ");
    }

    res.status(statusCode).json({
        success: false,
        message
    });
};


module.exports = {
    notFound,
    errorHandler
};