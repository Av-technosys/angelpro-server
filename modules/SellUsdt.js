const mongoose = require("mongoose");

const sellUsdtSchema = mongoose.Schema({
  bankHolderName: {
    type: String,
    required: true,
  },
  ifscCode: {
    type: String,
    required: true,
  },
  bankAccountNumber: {
    type: String,
    required: true,
  },
  sellUsdtAmount: {
    type: Number,
    required: true,
  },
  utrId: {
    type: String,
  },
  usdtToRupees: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "Processing",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

const SellUsdt = mongoose.model("sellUsdt", sellUsdtSchema);
module.exports = SellUsdt;
