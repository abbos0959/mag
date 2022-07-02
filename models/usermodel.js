const mongoose = require('mongoose');
const validator = require('validator');
// const {JWTTimeStamp}=require("jsonwebtoken")
const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const UserSChema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Iltimos Ism Kiriting'],
    minlength: 3,
    maxlength: 40
  },
  email: {
    type: String,
    required: [true, 'Iltimos email Kiriting'],
    minlength: 3,
    maxlength: 40,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'iltimos haqiqiy elektron pochta manzilini kiriting'
    ],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Iltimos Parol Kiriting']
    // validate: [
    //   validator.isStrongPaswword,
    //   'qalesan mazgiiiii paroling kuchsizki '
    // ]
    // select:false
  },
  photo: {
    type: String
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'team-lead', 'admin'],
    default: 'user'
  },
  paswordConfirm: {
    type: String,
    required: [true, 'Iltimos Parol Kiriting']
    // select:false
    // validate: {
    //   validator: function(val) {
    //     return val === this.password;
    //   }
    //   ,
    //   message:"parol bir hil emas mazgiiiiiiiii"
    // }
  },
  changeDate: Date,
  resetTokenHash: String,
  resetTokenVaqti: Date
});
  
UserSChema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const Hashpassword = await bcrypt.hash(this.password, 12);
  this.password = Hashpassword;
  this.paswordConfirm = undefined;
  next();
});

// UserSChema.methods.changedPassword = function(JWTTimeStamp) {
//   if (this.changeDate) {
//     const changetimestamp = parseInt(this.changeDate.getTime() / 1000, 10);

//     console.log(changetimestamp, JWTTimeStamp);
//     return JWTTimeStamp<changetimestamp
//   }
//   return false;
// };

// UserSChema.methods.creatPasswordResetToken=function(){
//   const randomtoken=crypto.randomBytes(32).toString("hex")
//   this.passwordresetToken= crypto.createHash("sha256").update(randomtoken).digest("hex")
//   this.passwordResetExpires=Date.now()+10*60*1000
//   return randomtoken
// }

UserSChema.methods.hashTokenMethod = function() {
  const token = crypto.randomBytes(32).toString('hex');

  this.resetTokenHash = crypto
    .createHash('sha256') 
    .update(token)
    .digest('hex');
    console.log({token},  "bu hash   sssssssssss",this.resetTokenHash);

  this.resetTokenVaqti = Date.now() + 10 * 60 * 1000;
  return token;
};
module.exports = mongoose.model('User', UserSChema);
