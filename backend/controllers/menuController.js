const Menu = require("../models/Menu");

// GET ALL MENU ITEMS
const getMenuItems = async (req, res) => {
  try {
    const menuItems = await Menu.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Menu items fetched successfully",
      menuItems,
    });
  } catch (error) {
    console.error("Get Menu Error:", error);

    res.status(500).json({
      message: "Server error while fetching menu",
    });
  }
};

// GET SINGLE MENU ITEM
const getMenuItemById = async (req, res) => {
  try {
    const menuItem = await Menu.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        message: "Menu item not found",
      });
    }

    res.status(200).json({
      message: "Menu item fetched successfully",
      menuItem,
    });
  } catch (error) {
    console.error("Get Menu Item Error:", error);

    res.status(500).json({
      message: "Server error while fetching menu item",
    });
  }
};

// CREATE MENU ITEM
const createMenuItem = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      isAvailable,
    } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({
        message: "Name, category and price are required",
      });
    }

    const image = req.file
      ? req.file.path
      : "";

    const menuItem = await Menu.create({
      name,
      description: description || "",
      category,
      price: Number(price),
      image,
      isAvailable:
        isAvailable === undefined
          ? true
          : isAvailable === "true" ||
            isAvailable === true,
    });

    res.status(201).json({
      message: "Menu item created successfully",
      menuItem,
    });
  } catch (error) {
    console.error("Create Menu Error:", error);

    res.status(500).json({
      message: "Server error while creating menu item",
    });
  }
};

// UPDATE MENU ITEM
const updateMenuItem = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      isAvailable,
    } = req.body;

    const menuItem =
      await Menu.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        message: "Menu item not found",
      });
    }

    menuItem.name = name;
    menuItem.description = description || "";
    menuItem.category = category;
    menuItem.price = Number(price);

    if (isAvailable !== undefined) {
      menuItem.isAvailable =
        isAvailable === "true" ||
        isAvailable === true;
    }

    if (req.file) {
      menuItem.image = req.file.path;
    }

    await menuItem.save();

    res.status(200).json({
      message: "Menu item updated successfully",
      menuItem,
    });
  } catch (error) {
    console.error("Update Menu Error:", error);

    res.status(500).json({
      message: "Server error while updating menu item",
    });
  }
};

// DELETE MENU ITEM
const deleteMenuItem = async (req, res) => {
  try {
    const menuItem =
      await Menu.findByIdAndDelete(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        message: "Menu item not found",
      });
    }

    res.status(200).json({
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    console.error("Delete Menu Error:", error);

    res.status(500).json({
      message: "Server error while deleting menu item",
    });
  }
};

module.exports = {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
};