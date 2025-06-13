const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bankAccount = new Schema({
  bankHolderName: {
    type: String,
    required: true,
  },
  ifscCode: {
    type: String,
    required: true,
    unique: true,
  },
  bankName: {
    type: String,
    required: true,
  },
  bankAccountNumber: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

// Create models based on the schemas
const BankAccount = mongoose.model("BankAccount", bankAccount);

module.exports = BankAccount;
