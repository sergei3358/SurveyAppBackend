const CustomError = require("../../helper/error/customError");
const errorHandler = (err, req, res, next) => {

    let customError = new CustomError(err.message, err.status);

    if (err.name === "SyntaxError") {

        customError = new CustomError("Unexpected Syntax", 400);
    }
    if (err.name === "ValidationError") {

        customError = new CustomError(err.message, 400);
    }
    if (err.name === "CastError") {
        customError = new CustomError("Please provide a valid input", 400);
    }

    //console.log(customError);
    if (customError.status == "400") {
        return res.status(customError.status).json({
            success: false,
            message: "Bad Request"
        });
    }
    else {
        return res.status(customError.status || 500).json({
            success: false,
            message: customError.message || "Internal Server Error"
        });
    }

}
module.exports = errorHandler;