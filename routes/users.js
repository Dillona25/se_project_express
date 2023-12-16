const router = require("express").Router();
const { getUsers, getUser, newUser } = require("../controllers/users");

router.get("/users", getUsers);

router.get("/users/:userId", getUser);

router.post("/users", newUser);
