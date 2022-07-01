const catchErrorAsync = require('../utils/catchUtil');
const User = require('../models/usermodel');

exports.getAllUsers = catchErrorAsync(async (req, res, next) => {
  const user = await User.find();
  res.status(200).json({
    message: 'success',
    user
  });
});
exports.getUser = catchErrorAsync(async (req, res,next) => {
  const UserOne=await User.findById(req.params.id)
  res.status(200).json({
    status: 'succes',
    UserOne
  });
})
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
