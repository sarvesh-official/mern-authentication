import express from "express";
import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    return res.json({ message: "user already exists" });
  }

  //* Hashing the password
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  await newUser.save();

  return res.json({ status: true, message: "User Created" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.json({ message: "User is not registered" });
  }

  // * Comparing the input pass with the hashed pass stored in the database
  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.json({ message: "password is incorrect" });
  }

  // ! Generating a unique jwt token for each user using their username as payload
  const token = jwt.sign({ username: user.username }, process.env.KEY, {
    expiresIn: "60m",
  });

  res.cookie("token", token, { maxAge: 36000 });

  return res.json({ status: true, message: "login successful" });
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ message: "User not registered" });
    }

    const token = jwt.sign({ id: user._id }, process.env.KEY, {
      expiresIn: "10m",
    });

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "kingjai156@gmail.com",
        pass: "yxlw lobm dlbp qwhf",
      },
    });

    var mailOptions = {
      from: "kingjai156@gmail.com",
      to: email,
      subject: "Reset Password",
      text: `${process.env.BASE_URL}/resetPassword/${token}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.json({ message: "error sending email" });
      } else {
        return res.json({ status: true, message: "email sent" });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = await jwt.verify(token, process.env.KEY);

    const id = decoded.id;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(
      { _id: id },
      { password: hashedPassword }
    );

    user.save();

    return res.json({ status: true, message: "updated password" });
  } catch (error) {
    console.log(error);
  }
});

const verifyUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ status: false, message: "No Token" });
    }

    const decode = await jwt.verify(token, process.env.KEY);
    next();
  } catch (error) {
    console.log(error);
  }
};

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ status: true, message: "Log Out Successfull" });
});

router.get("/verify", verifyUser, (req, res) => {
  return res.json({ status: true, message: "authorized" });
});

export { router as UserRouter };
