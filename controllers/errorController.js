module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 404;

  err.status = err.status || 'failedcha';
  err.message = err.message || 'not found';

  if (process.env.NODE_ENV === 'DEVELOPMENT') {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      hato: err.stack,
      error: err
    });
  } else if (process.env.NODE_ENV === 'PRODUCTION') {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
      //   hato: err.stack
    });
  }

  next();
};
