const ClothingItem = require("../models/clothingItem");
const InvalidError = require("../errors/InvalidError");
const NotFoundError = require("../errors/NotFound");
const ForbiddenError = require("../errors/ForbiddenError");

const createItem = (req, res, next) => {
  console.log(req);
  console.log(req.body);
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(new InvalidError("Validation error"));
      } else {
        next(err);
      }
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      next(err);
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const { _id: userId } = req.user;

  ClothingItem.findOne({ _id: itemId })
    .then((item) => {
      if (!item) {
        return next(new NotFoundError("Item ID cannot be found"));
      }
      if (!item?.owner?.equals(userId)) {
        return next(new ForbiddenError("You do not own this item"));
      }
      return ClothingItem.deleteOne({ _id: itemId, owner: userId }).then(() => {
        res.status(201).send({ message: "Item deleted" });
      });
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
};

//* Edit delete item logic so only the owner can delete a card

const likeItem = (req, res, next) => {
  const { itemId } = req.params;
  const { _id: userId } = req.user;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .orFail(() => new NotFoundError("Item not found"))
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
};

const unlikeItem = (req, res, next) => {
  const { itemId } = req.params;
  const { _id: userId } = req.user;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .orFail(() => new NotFoundError("Item not found"))
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
};
