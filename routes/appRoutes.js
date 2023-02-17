import express from "express";
const router = express.Router();
import AppController from "../controllers/appController.js";
import checkUserAuth from "../middlewares/auth-middleware.js";
import { check } from "express-validator";

// ROute Level Middleware - To Protect Route
// router.use("/changepassword", checkUserAuth);
// router.use("/loggeduser", checkUserAuth);

// Public Routes
router.post(
  "/longtermgoals",
  [
    check("goals", "Please enter a goal with minimum length of 3")
      .not()
      .isEmpty()
      .isLength({ min: 3 })
      .bail(),
    check("description", "Please enter a name with minimum length of 3")
      .not()
      .isEmpty()
      .isLength({ min: 10 })
      .bail(),
    check("date", "Please enter a name with minimum length of 3")
      .not()
      .isDate()
      .bail(),
  ],
  AppController.longTermGoals
);

router.post("/getltgs", AppController.getLtgs);
router.post("/deleteltgs", AppController.deleteLtgs);

// // Protected Routes
// router.post(
//   "/changepassword",
//   [
//     check(
//       "password",
//       "Please enter a password with 8 or more characters and at least one special character"
//     )
//       .matches(
//         /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
//         "i"
//       )
//       .bail(),
//     check("password_confirmation", "Passwords do not match")
//       .custom((value, { req }) => value === req.body.password)
//       .bail(),
//   ],
//   AppController.changeUserPassword
// );

export default router;
