const ErrorHandler = require('../utils/errorHandler');

module.exports = (err, req,res, next) => {
    err.statusCode = err.status || 500;
    
    if(process.env.NODE_ENV === 'DEVELOPMENT') {
        res.status(err.statusCode).json({
            success: false,
            error:err,
            errMessage: err.message,
            stack: err.stack
        })
    }

    if(process.env.NODE_ENV === 'PRODUCTION') {
        let error = {...err}

        error.message = err.message;
        
        // Wrong Mongoose object ID error    
        if(err.name === 'CastError') {
            const message = `Resource not found: ${err.path}`;
            error = new ErrorHandler(message,400);
        } 

        // Handling Mongoose Validation Error
        if(err.name === 'validationError') {
            const message = Object.values(err.errors).map(value => value.message);
            error = new ErrorHandler(message,400); 
        }


        // handling mongoose duplicate keys errors
        if(err.code === 11000) {
            const message = `Duplicate ${Object.keys(err.keyValue)} entered`

            error = new ErrorHandler(message,400); 
        }

        // handling wrong JWT error
        if(err.name === 'JsonWebTokenError') {
            const message = "JSON web Token is invalid. Try Again!!";
            error = new ErrorHandler(message,400); 
        }

        // handling Expired JWT error
        if(err.name === 'TokenExpired') {
            const message = "JSON web Token is Expired. Try Again!!";
            error = new ErrorHandler(message,400); 
        }

        res.status(error.statusCode).json({
            success: false,
            message: error.message || 'Internal Server Error',
        })

    }

    

}