class ApiError extends Error {
    constructor (
        statusCode,
        message= "YO WRONG WENT",
        errors = [],
        stack = ""
    ){
        super(message)
        this.statusCode =  statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors

        if (stack) {
            this.stack = stack
        }else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError}