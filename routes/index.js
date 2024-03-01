const router = require("express").Router();
const { loginUser, createUser } = require("../controllers/users");
const clothingItem = require("./clothingItems");
const user = require("./users");
const NotFoundError = require("../errors/NotFound");
const {
  userAuthenticationValidator,
  userBodyValidator,
} = require("../middlewares/validation");

router.use("/items", clothingItem);
router.use("/users", user);
router.post("/signup", userBodyValidator, createUser);
router.post("/signin", userAuthenticationValidator, loginUser);

router.use((req, res, next) => {
  next(new NotFoundError("Route not found"));
});

module.exports = router;
