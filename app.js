const express = require('express');
const morgan = require('morgan');
const ratelimit = require('express-rate-limit');
const AppError = require('./utils/appError');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const ErrorController = require('./controllers/errorController');
const helmet = require('helmet');
const sanitise = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp=require("hpp")

//so`rovlarga vaqt belgilab qo`yish req so`rovlar sonini sanab turadi
const limiter = ratelimit({
  max: 10,
  windowMs: 1 * 60 * 1000,
  message: 'uka juda ko`p so`rov berib yubording'
});

const app = express({ limit: '10kb' }); //req o`lchamiga limit qo`yish
app.use('/api', limiter);
app.use(helmet()); //headersni securtysini kuchaytiradi

//urldagi hatolarni ushlaydi
app.use(hpp())

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));

}

app.use(express.json());

// req.bodysini tekshiradi masalan $ simvoli bilan
app.use(sanitise());

//  xss html ichiga virus tiqib yubormoqchi bo`lsa ushlab qoladi

app.use(xss());
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
