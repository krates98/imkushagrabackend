import express from "express";
const router = express.Router();
import UserController from "../controllers/userController.js";
import checkUserAuth from "../middlewares/auth-middleware.js";
import { check } from "express-validator";

// ROute Level Middleware - To Protect Route
router.use("/changepassword", checkUserAuth);
router.use("/loggeduser", checkUserAuth);

// Public Routes
router.post(
  "/register",
  [
    check("name", "Please enter a name with minimum length of 3")
      .not()
      .isEmpty()
      .isLength({ min: 3 })
      .bail(),
    check("email", "Please enter a valid email")
      .isEmail()
      .normalizeEmail()
      .bail(),
    check(
      "password",
      "Please enter a password with 8 or more characters and at least one special character"
    )
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "i"
      )
      .bail(),
    check("password_confirmation", "Passwords do not match")
      .custom((value, { req }) => value === req.body.password)
      .bail(),
    check("tc", "Please accept the terms and conditions").custom(
      (value) => value === true || value === "on"
    ),
  ],
  UserController.userRegistration
);
router.post(
  "/login",
  [
    check("email", "Please enter a valid email")
      .isEmail()
      .normalizeEmail()
      .bail(),
  ],
  UserController.userLogin
);
router.post(
  "/send-reset-password-email",
  [
    check("email", "Please enter a valid email")
      .isEmail()
      .normalizeEmail()
      .bail(),
  ],
  UserController.sendUserPasswordResetEmail
);

router.post(
  "/reset-password/:id/:token",
  [
    check(
      "password",
      "Please enter a password with 8 or more characters and at least one special character"
    )
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "i"
      )
      .bail(),
    check("password_confirmation", "Passwords do not match")
      .custom((value, { req }) => value === req.body.password)
      .bail(),
  ],
  UserController.userPasswordReset
);

// Protected Routes
router.post(
  "/changepassword",
  [
    check(
      "password",
      "Please enter a password with 8 or more characters and at least one special character"
    )
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "i"
      )
      .bail(),
    check("password_confirmation", "Passwords do not match")
      .custom((value, { req }) => value === req.body.password)
      .bail(),
  ],
  UserController.changeUserPassword
);
router.get("/loggeduser", UserController.loggedUser);

export default router;
