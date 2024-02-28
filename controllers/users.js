const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const NotFoundError = require("../errors/notFound");
const UnauthorizedError = require("../errors/unauthorizedError");
const ConflictError = require("../errors/confilctError");
const InvalidError = require("../errors/invalidError");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!email) {
        return next(new UnauthorizedError("Enter a valid email"));
      }
      if (user) {
        return next(new ConflictError("Email already in use"));
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userPayload = user.toObject();
      delete userPayload.password;
      res.status(201).send({
        data: userPayload,
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(new InvalidError("Validation Error"));
      } else {
        next(err);
      }
    });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(InvalidError).send({ message: "Invalid credentials" });
    return;
  }

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      next(new UnauthorizedError("Invalid Credentials"));
    });
};

const getCurrentUser = (req, res, next) => {
  const { _id: userId } = req.user;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        // Adding this return statement prevents the code from running after the error is thrown
        return next(new NotFoundError("User not found"));
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      next(err);
    });
};

const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError("User not found"));
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new InvalidError("Validation Error"));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  loginUser,
  getCurrentUser,
  updateUser,
};
