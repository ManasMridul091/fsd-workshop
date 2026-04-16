const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ✅ CREATE
router.post("/add", async (req, res) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();

    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ✅ READ
router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// ✅ UPDATE
router.put("/update/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ✅ DELETE
router.delete("/delete/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;