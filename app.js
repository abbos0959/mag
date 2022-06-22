const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const ErrorController=require("./controllers/errorController")

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// app.use((req, res, next) => {
//   console.log('Hello from the middleware 👋');
//   next();
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', function(req, res, next) {
  // const err = {
  //   statusCode: 404,
  //   status: 'failed',
  //   message: `bunday page yoq ${req.originalUrl}`
  // };

  next(new AppError(`this page not found ${req.originalUrl}`), 404);
});

//Global error handling

app.use(ErrorController);
module.exports = app;
