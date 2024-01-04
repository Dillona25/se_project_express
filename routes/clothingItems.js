const router = require("express").Router();
const authorization = require("../middlewares/auth");
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

router.post("/", authorization.handleAuthError, createItem);

router.get("/", getItems);

router.put("/:itemId/likes", authorization.handleAuthError, likeItem);

router.delete("/:itemId", authorization.handleAuthError, deleteItem);

router.delete("/:itemId/likes", authorization.handleAuthError, unlikeItem);

module.exports = router;
