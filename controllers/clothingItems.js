const clothingItem = require("../models/clothingItem");
const ClothingItem = require("../models/clothingItem");

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
      res.status(500).send({ message: "Error from createItem", err });
    });
};

const getItems = (req, res) => {
  clothingItem
    .find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      res.status(500).send({ message: "Error from getItem", err });
    });
};

module.exports = {
  createItem,
  getItems,
};
