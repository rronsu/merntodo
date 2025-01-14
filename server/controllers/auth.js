import { createError } from "../utils/error.js";
import { connectToDB } from "../utils/connect.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export async function register(req, response, next) {
  const data = req.body;
  console.log(data);

  if (!data?.email || !data?.password) {
    return next(createError(400, "Email and password are required"));
  }
  await connectToDB();
  const alreadyRegistered = await User.exists({ email: data.email });
  if (alreadyRegistered) return next(createError(400, "User already exists"));
 
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, salt);
  const newUser = new User({ ...req.body, password: hash });
  await newUser.save();
  response.status(201).json("User registered successfully. " );
}

export async function login(req, res, next) {
  const data = req.body;
  console.log(data);

  if (!data?.email || !data?.password) {
    return next(createError(400, "missing required fields"));
  }
  await connectToDB();
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(createError(400, "Invalid credentials"));
  const isPasswordCorrect = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isPasswordCorrect) return next(createError(400, "Invalid credentials"));
  const token = jwt.sign({ id: user._id }, process.env.JWT);
  console.log(token);

  res.cookie("access_token", token, {
    httpOnly: true,
    secure : process.env.NODE_ENV === "production",
  }).status(200).json("User logged in successfully");
}

export async function logout(req, res, next) {
 res.clearCookie("access_token",{
  httpOnly: true,
  secure : process.env.NODE_ENV === "production",
 }).status(200).json("User logged out successfully");
}
