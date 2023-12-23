const clothingItem = require("../models/clothingItem");
const ClothingItem = require("../models/clothingItem");
const {
  INVALID_DATA_ERROR,
  NOTFOUND_ERROR,
  DEFAULT_ERROR,
} = require("../utils/errors");

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
      console.error(err);
      if (err.name === "ValidationError") {
        res.status(INVALID_DATA_ERROR.code).send({ message: err.message });
      } else {
        res
          .status(DEFAULT_ERROR.code)
          .send({ message: "Internal server error" });
      }
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      res.status(DEFAULT_ERROR.code).send({ message: "Internal server error" });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err.name);
      if (err.name === "CastError") {
        res.status(NOTFOUND_ERROR.code).send({ message: err.message });
      } else {
        res
          .status(DEFAULT_ERROR.code)
          .send({ message: "Internal server error" });
      }
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        res.status(NOTFOUND_ERROR.code).send({ message: err.message });
      } else {
        res
          .status(DEFAULT_ERROR.code)
          .send({ message: "Internal server error" });
      }
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;
  const { _id: userId } = req.body;

  clothingItem
    .findByIdAndUpdate(itemId, { $addToSet: { likes: userId } }, { new: true })
    .orFail()
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      console.error(err.name);
      if (err.name === "CastError") {
        res.status(NOTFOUND_ERROR.code).send({ message: err.message });
      } else {
        res
          .status(DEFAULT_ERROR.code)
          .send({ message: "Internal server error" });
      }
    });
};

const unlikeItem = (req, res) => {
  const { itemId } = req.params;
  const { _id: userId } = req.body;

  clothingItem
    .findByIdAndUpdate(itemId, { $pull: { likes: userId } }, { new: true })
    .orFail()
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        res.status(NOTFOUND_ERROR.code).send({ message: err.message });
      } else {
        res
          .status(DEFAULT_ERROR.code)
          .send({ message: "Internal server error" });
      }
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
