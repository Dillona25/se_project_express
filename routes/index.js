const router = require("express").Router();
const { loginUser, createUser } = require("../controllers/users");
const clothingItem = require("./clothingItems");
const user = require("./users");
const { NOTFOUND_ERROR } = require("../utils/errors");
const {
  userAuthenticationValidator,
  userBodyValidator,
} = require("../middlewares/validation");

router.use("/items", clothingItem);
router.use("/users", user);
router.post("/signup", userBodyValidator, createUser);
router.post("/signin", userAuthenticationValidator, loginUser);

router.use((req, res) => {
  res.status(NOTFOUND_ERROR).send({ message: "Route not found" });
});

module.exports = router;
