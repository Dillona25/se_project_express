const router = require("express").Router();
const {
  getItems,
  newItem,
  deleteItem,
} = require("../controllers/clothingItems");

router.get("/items", getItems);

router.post("/items", newItem);

router.delete("/items/:itemId", deleteItem);
