import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    amount: {
      type: Number,
      required: true
    },

    category: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      default: "expense"
    },

    // 🔥 Custom date (user input ya fallback)
    date: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true // 🔥 VERY IMPORTANT (createdAt + updatedAt)
  }
);

export default mongoose.model("Expense", expenseSchema);