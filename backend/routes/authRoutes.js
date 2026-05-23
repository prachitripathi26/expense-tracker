// import express from "express";
// import User from "../models/User.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// const router = express.Router();

// // SIGNUP
// router.post("/signup", async (req, res) => {
//   const { name, email, password } = req.body;

//   const hashed = await bcrypt.hash(password, 10);

//   const user = await User.create({
//     name,
//     email,
//     password: hashed
//   });

//   res.json(user);
// });

// // LOGIN
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email });

//   if (!user) return res.status(400).json({ message: "User not found" });

//   const isMatch = await bcrypt.compare(password, user.password);

//   if (!isMatch) return res.status(400).json({ message: "Wrong password" });

//   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

//   res.json({ token });
// });

// export default router;





import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { protect } from "../middleware/authMiddleware.js"; // ✅ FIX

const router = express.Router();


// SIGNUP
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed
  });

  res.json(user);
});


// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token });
});


// 🔥 GET PROFILE
router.get("/me", protect, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

// ✏️ UPDATE PROFILE
router.put("/update", protect, async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    console.log("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ message: "Update failed" });
  }
});

export default router;