class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    /* Have 2 kind of error: Operational Error and Programming Error */
    this.isOperational = true;

    /* 
      When a new operational error created & constructor function is called
      that function call will not appear in the stack trace, and will NOT pollute it.
    */
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
