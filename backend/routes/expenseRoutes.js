
import express from "express";
import Expense from "../models/Expense.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


// ➕ ADD EXPENSE
router.post("/", protect, async (req, res) => {
  try {
    const expense = await Expense.create({
      ...req.body,
      userId: req.user.id   // ✅ FIX
    });

    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: "Create failed" });
  }
});


// 📥 GET EXPENSES
router.get("/", protect, async (req, res) => {
  try {
    const expenses = await Expense.find({
      userId: req.user.id   // ✅ FIX
    }).sort({ createdAt: -1 });

    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed" });
  }
});


// ❌ DELETE
router.delete("/:id", protect, async (req, res) => {
  try {
    await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id   // ✅ SECURITY FIX
    });

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});


// ✏️ UPDATE
router.put("/:id", protect, async (req, res) => {
  try {
    const updated = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id }, // ✅ FIX
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

export default router;