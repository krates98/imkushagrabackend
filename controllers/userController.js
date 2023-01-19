import UserModel from "../models/User.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/emailConfig.js";
import mongoSanitize from "mongo-sanitize";
import { validationResult } from "express-validator";

class UserController {
  static userRegistration = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    req.body = mongoSanitize(req.body);
    const { name, email, password, tc } = req.body;

    const user = await UserModel.findOne({ email: email });
    if (user) {
      res.send({ status: "failed", message: "Email already exists" });
    } else {
      try {
        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt);
        const doc = new UserModel({
          name: name,
          email: email,
          password: hashPassword,
          tc: tc,
          admin: false,
          premiumuser: false,
        });
        await doc.save();
        const saved_user = await UserModel.findOne({ email: email });
        // Generate JWT Token
        const token = jwt.sign(
          { userID: saved_user._id },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "30d" }
        );
        res.status(201).send({
          status: "success",
          message: "Registration Success",
          token: token,
        });
      } catch (error) {
        console.log(error);
        res.send({ status: "failed", message: "Unable to Register" });
      }
    }
  };

  static userLogin = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { email, password } = req.body;

      const user = await UserModel.findOne({ email: email });
      if (user != null) {
        const isMatch = await bcryptjs.compare(password, user.password);
        if (user.email === email && isMatch) {
          // Generate JWT Token
          const token = jwt.sign(
            { userID: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "30d" }
          );
          res.send({
            status: "success",
            message: "Login Success",
            token: token,
          });
        } else {
          res.send({
            status: "failed",
            message: "Email or Password is not Valid",
            type: "error",
          });
        }
      } else {
        res.send({
          status: "failed",
          message: "You are not a Registered User",
          type: "error",
        });
      }
    } catch (error) {
      console.log(error);
      res.send({ status: "failed", message: "Unable to Login", type: "error" });
    }
  };

  static changeUserPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { password, password_confirmation } = req.body;
    if (password && password_confirmation) {
      if (password !== password_confirmation) {
        res.send({
          status: "failed",
          message: "New Password and Confirm New Password doesn't match",
        });
      } else {
        const salt = await bcryptjs.genSalt(10);
        const newHashPassword = await bcryptjs.hash(password, salt);
        await UserModel.findByIdAndUpdate(req.user._id, {
          $set: { password: newHashPassword },
        });
        res.send({
          status: "success",
          message: "Password changed succesfully",
        });
      }
    } else {
      res.send({ status: "failed", message: "All Fields are Required" });
    }
  };

  static loggedUser = async (req, res) => {
    res.send({ user: req.user });
  };

  static sendUserPasswordResetEmail = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email } = req.body;

    const user = await UserModel.findOne({ email: email });
    if (user) {
      const secret = user._id + process.env.JWT_SECRET_KEY;
      const token = jwt.sign({ userID: user._id }, secret, {
        expiresIn: "15m",
      });
      const link = `${process.env.WEB_URL}api/user/reset/${user._id}/${token}`;

      console.log(link);

      // Send Email

      let info = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: `${process.env.TITLE} - Password Reset Link`,
        html: `<a href=${link}>Click Here</a> to Reset Your Password`,
      });

      res.send({
        status: "success",
        message: "Password Reset Email Sent... Please Check Your Email",
        type: "success",
      });
    } else {
      res.send({
        status: "failed",
        message: "Email doesn't exists",
        type: "error",
      });
    }
  };

  static userPasswordReset = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { password } = req.body;
    const { id, token } = req.params;
    const user = await UserModel.findById(id);
    const new_secret = user._id + process.env.JWT_SECRET_KEY;
    try {
      jwt.verify(token, new_secret);
      const salt = await bcryptjs.genSalt(10);
      const newHashPassword = await bcryptjs.hash(password, salt);
      await UserModel.findByIdAndUpdate(user._id, {
        $set: { password: newHashPassword },
      });
      res.send({
        status: "success",
        message: "Password Reset Successfully",
        type: "success",
      });
    } catch (error) {
      console.log(error);
      res.send({
        status: "failed",
        message:
          "More than 15 min old Link please send password reset mail again & continue",
        type: "success",
      });
    }
  };
}

export default UserController;
