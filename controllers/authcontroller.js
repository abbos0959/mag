const User = require('../models/usermodel');
const catchErrorAsync = require('../utils/catchUtil');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const AppError = require('../utils/appError');
const { use } = require('../routes/tourRoutes');

const signup = catchErrorAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    paswordConfirm: req.body.paswordConfirm,
    photo: req.body.photo,
    changeDate: req.body.changeDate,
    role: req.body.role
  });
  const token = jwt.sign({ id: newUser._id }, 'secret', { expiresIn: '1d' });
  res.status(201).json({
    status: 'success',
    newUser,
    token
  });
});

const login = catchErrorAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const OldUser = await User.findOne({ email });
  if (!OldUser) {
    return res.status(404).json({ message: 'bunday user mavjud emas email' });
  }
  const Compare = await bcrypt.compare(password, OldUser.password);
  if (!Compare) {
    return res
      .status(404)
      .json({ message: 'bunday user mavjud emas password' });
  }
  const token = jwt.sign({ id: OldUser._id }, 'secret', { expiresIn: '1d' });

  res.status(200).json({ result: OldUser, token });
});

const protect = catchErrorAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('tizimga kirishiz shart'));
  }

  const tekshirish = await jwt.verify(token, 'secret', { expiresIn: '1d' });

  if (!tekshirish) {
    return next(new AppError('bunday token mavjud emas'));
  }
  console.log('bu tekshirishhhhhhhhhhhhhhhh', tekshirish);

  const FoydalanuvchiID = await User.findById(tekshirish.id);
  console.log('bu foydaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', FoydalanuvchiID);
  if (!FoydalanuvchiID) {
    return next(
      new AppError('Bunday tokenli  Foydalanuvchi idsi  mavjud emas', 401)
    );
  }


//agar parol o`zgarsa tokenni amal qilmasligini tekshirish

  // if (FoydalanuvchiID.changedPassword(tekshirish.iat)) {
  //   return next(new AppError('user parolni o`zgartirdi', 401));
  // }

  if(FoydalanuvchiID.changeDate){

    const data=FoydalanuvchiID.changeDate.getTime()/1000
    if(data>tekshirish.iat){
     return next(new AppError("token yaroqsiz",401))
    }
  }

  req.user = FoydalanuvchiID;
  next();
});
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('sizga ma`lumot o`chirish huquqi berilmagan', 403)
      );
    }
    next();
  };
};
const ForgetPassword = catchErrorAsync(async (req, res, next) => {

  if(!req.body.email){
return next(new AppError("emailni kirit oshna"))
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    next(new AppError('Bunday emailga ega foydalanuvchi topilmadi', 404));
    const resetToken = user.creatPasswordResetToken();
    await user.save();
  }
  next()
});
const ResetPassword = (req, res, next) => {};


module.exports = {
  signup,
  login,
  protect,
  restrictTo,
  ForgetPassword
  
};
