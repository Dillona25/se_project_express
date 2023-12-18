const clothingItem = require("../models/clothingItem");
const ClothingItem = require("../models/clothingItem");
const { DEFAULT_ERROR, NOTFOUND_ERROR } = require("../utils/errors");

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((err) => {
      console.log(err);
      res.status(DEFAULT_ERROR).send({ message: "Internal server error", err });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.log(err);
      res.status(DEFAULT_ERROR).send({ message: "Internal server error", err });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.log(err);
      res.status(DEFAULT_ERROR).send({ message: "Internal server error", err });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.log(err);
      res.status(DEFAULT_ERROR).send({ message: "Internal server error", err });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;
  const { _id: userId } = req.user;

  clothingItem
    .findByIdAndUpdate(itemId, { $addToSet: { likes: userId } }, { new: true })
    .orFail()
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      console.log(err);
      res.status(DEFAULT_ERROR).send({ message: "Internal server error", err });
    });
};

const unlikeItem = (req, res) => {
  const { itemId } = req.params;
  const { _id: userId } = req.user;

  clothingItem
    .findByIdAndUpdate(itemId, { $pull: { likes: userId } }, { new: true })
    .orFail()
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      console.log(err);
      res.status(DEFAULT_ERROR).send({ message: "Internal server error", err });
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  unlikeItem,
};
