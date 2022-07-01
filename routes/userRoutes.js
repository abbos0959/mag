const express = require('express');
const userController = require('./../controllers/userController');
const sal=require("./../controllers/authcontroller")
const authcontroller=require("../controllers/authcontroller")

const router = express.Router();

router
  .route('/')
  .get(authcontroller.protect,userController.getAllUsers)
  .post(userController.createUser);


  router.route("/signup").post(sal.signup)
  router.route("/login").post(sal.login)
  router.route("/forgotpassword").post(sal.ForgetPassword)
  router.route("/resetpassword").post(sal.login)
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(  userController.deleteUser);

module.exports = router;
