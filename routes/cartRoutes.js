const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart"); // Ensure this file exists
const Product = require("../models/Product");

// ✅ Add Product to Cart
router.post("/", async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cartItem = await Cart.findOne({ productId });
    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = new Cart({ productId, quantity });
    }
    await cartItem.save();

    res.status(201).json({ message: "Added to cart", cartItem });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ View Cart
router.get("/", async (req, res) => {
  try {
    const cart = await Cart.find().populate("productId");
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Update Cart Item Quantity
router.put("/:id", async (req, res) => {
  try {
    const { quantity } = req.body;
    const cartItem = await Cart.findById(req.params.id);
    if (!cartItem) return res.status(404).json({ message: "Cart item not found" });

    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json({ message: "Cart updated", cartItem });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Remove Product from Cart
router.delete("/:id", async (req, res) => {
  try {
    const cartItem = await Cart.findById(req.params.id);
    if (!cartItem) return res.status(404).json({ message: "Cart item not found" });

    await cartItem.deleteOne();
    res.status(200).json({ message: "Removed from cart" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
