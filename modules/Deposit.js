const mongoose = require("mongoose");
const depositSchema = mongoose.Schema({
  network: {
    type: String,
    required: true,
  },
  depositAmount: {
    type: Number,
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "Processing",
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

module.exports = mongoose.model("deposit", depositSchema);
