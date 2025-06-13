const mongoose = require("mongoose");
const depositSchema = require("./Deposit");
const withdrawalSchema = require("./Withdrawal");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    default:0
  },
  deposits: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deposit",
    },
  ],
  withdrawals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Withdrawal",
    },
  ],
  bankAccounts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BankAccount",
    },
  ],
});

const User = mongoose.model("user", userSchema);

module.exports = User;
