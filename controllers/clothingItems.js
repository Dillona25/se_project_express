const ClothingItem = require("../models/clothingItem");

const getItems = (req, res) => {
  ClothingItem.find()
    .then((items) => res.send(items))
    .catch((err) => console.log(err));
};

const newItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  const { _id: userId } = req.user;

  ClothingItem.findOne({ _id: itemId });
  ClothingItem.deleteOne({ _id: itemId, owner: userId });
};

module.exports = {
  getItems,
  newItem,
  deleteItem,
};
