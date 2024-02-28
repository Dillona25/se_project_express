const router = require("express").Router();
const { handleAuthorization } = require("../middlewares/auth");
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");
const {
  createItemValidator,
  validateId,
} = require("../middlewares/validation");

router.post("/", handleAuthorization, createItemValidator, createItem);

router.get("/", getItems);

router.put("/:itemId/likes", handleAuthorization, validateId, likeItem);

router.delete("/:itemId", handleAuthorization, validateId, deleteItem);

router.delete("/:itemId/likes", handleAuthorization, validateId, unlikeItem);

module.exports = router;
