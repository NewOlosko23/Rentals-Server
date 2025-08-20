import { body } from "express-validator";

export const registerValidation = [
  body("userType")
    .isIn(["individual", "company"])
    .withMessage("userType must be individual or company"),

  body("email").isEmail().withMessage("Valid email is required"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),

  body("username")
    .if(body("userType").equals("individual"))
    .notEmpty()
    .withMessage("Username is required for individuals"),

  body("fullName")
    .if(body("userType").equals("individual"))
    .notEmpty()
    .withMessage("Full name is required for individuals"),

  body("officialName")
    .if(body("userType").equals("company"))
    .notEmpty()
    .withMessage("Official name is required for companies"),
];
