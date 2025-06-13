const BankAccount = require("../modules/BackAccount");
const Deposit = require("../modules/Deposit");
const User = require("../modules/User");
const SellUsdt = require("../modules/SellUsdt");
const Withdrawal = require("../modules/Withdrawal");
const { success, error } = require("../utils/responseWrapper");

const createDeposit = async (req, res) => {
  try {
    const { network, depositAmount, transactionId } = req.body;
    const userId = req._id;

    if (!network || !depositAmount) {
      return res.send(error(401, "Network and Deposit Amount is reuired ..."));
    }
    const deposit = new Deposit({
      network,
      depositAmount,
      transactionId,
      user: userId,
    });

    await deposit.save();

    await User.findByIdAndUpdate(userId, { $push: { deposits: deposit._id } });

    return res.send(success(201, { deposit }));
  } catch (e) {
    console.log(e);
    return res.send(error(500, "Failed to create deposit"));
  }
};

const getDepositHistory = async (req, res) => {
  try {
    const userId = req._id;

    const deposits = await Deposit.find({
      user: {
        $in: userId,
      },
    });

    return res.send(success(200, deposits));
  } catch (e) {
    return res.send(error(500, "Failed to retrieve deposit history"));
  }
};
const getAllDeposits = async (req, res) => {
  try {
    const users = await Deposit.find({});
    return res.send(success(200, users));
  } catch (e) {
    console.log(e);
    return res.send(error(500, "Failed to retrieve user"));
  }
};
const createWithdrawal = async (req, res) => {
  try {
    const { currency, withdrawalAmount, walletAddress, network } = req.body;
    const userId = req._id;

    if (!network || !withdrawalAmount || !walletAddress) {
      return res.send(
        error(401, "Network and Withdrawal Amount is reuired ...")
      );
    }
    const withdrawal = new Withdrawal({
      currency,
      withdrawalAmount,
      walletAddress,
      network,
      user: userId,
    });

    await withdrawal.save();

    await User.findByIdAndUpdate(userId, {
      $push: { withdrawals: withdrawal._id },
    });

    return res.send(success(201, { withdrawal }));
  } catch (e) {
    console.log(e);
    return res.send(error(500, "Failed to create withdrawal"));
  }
};

const getWithdrawalHistory = async (req, res) => {
  try {
    const userId = req._id;

    const withdrawals = await Withdrawal.find({
      user: {
        $in: userId,
      },
    });

    return res.send(success(200, withdrawals));
  } catch (e) {
    return res.send(error(500, "Failed to retrieve withdrawal history"));
  }
};

const createBankAccount = async (req, res) => {
  try {
    const { bankHolderName, ifscCode, bankName, bankAccountNumber } = req.body;
    const userId = req._id;

    const newBankAccount = new BankAccount({
      bankHolderName,
      ifscCode,
      bankName,
      bankAccountNumber,
      user: userId,
    });

    const savedBankAccount = await newBankAccount.save();

    const bankaccount = await BankAccount.findOne({
      bankAccountNumber: bankAccountNumber,
    });
    const user = await User.findByIdAndUpdate(userId, {
      bankAccounts: bankaccount,
    });

    return res.send(success(200, { savedBankAccount }));
  } catch (e) {
    console.error("Error creating bank account:", e);
    return res.send(error(500, "Server error"));
  }
};
const sellUsdt = async (req, res) => {
  try {
    const {
      bankHolderName,
      ifscCode,
      bankAccountNumber,
      sellUsdtAmount,
      usdtToRupees,
      status,
    } = req.body;

    const userId = req?._id;

    if (
      !bankHolderName ||
      !ifscCode ||
      !bankAccountNumber ||
      !sellUsdtAmount ||
      !usdtToRupees
    ) {
      return res.send(error(401, "all fields are required ."));
    }
    const newSellUsdt = new SellUsdt({
      bankHolderName,
      ifscCode,
      bankAccountNumber,
      sellUsdtAmount,
      usdtToRupees,
      status,
      user: userId,
    });

    const savedSellUsdt = await newSellUsdt.save();
    return res.send(success(200, { savedSellUsdt }));
  } catch (e) {
    console.error("Error creating sell usdt:", e);
    return res.send(error(500, "Server error"));
  }
};

const usersellusdts = async (req, res) => {
  try {
    const personId = req.params.id;
    const sellusdt = await SellUsdt.find({ user: personId });
    return res.send(success(200, sellusdt));
  } catch (error) {
    console.error("Error fetching usersellusdts:", error);
    return res.send(error(500, "Server error"));
  }
};

const getBankAccount = async (req, res) => {
  try {
    const userId = req._id;
    const bankAccounts = await BankAccount.find({
      user: {
        $in: userId,
      },
    });
    return res.send(success(200, bankAccounts));
  } catch (e) {
    return res.send(error(500, "Failed to retrive bank accounts "));
  }
};

const userBankAccount = async (req, res) => {
  try {
    const userbankdetails = await BankAccount.find({ user: req.params.id });
    return res.send(success(200, userbankdetails));
  } catch (e) {
    return res.send(error(500, "Failed to retrive bank accounts "));
  }
};

const getSellUsdt = async (req, res) => {
  try {
    const userId = req._id;
    const allSellUsdt = await SellUsdt.find({
      user: {
        $in: userId,
      },
    });
    return res.send(success(200, allSellUsdt));
  } catch (e) {
    return res.send(error(500, "Failed to retrive sell Usdt "));
  }
};

const updateSellUsdt = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { status, utrId } = req.body;

    if (!transactionId || !status) {
      return res.send(error(401, "Transaction ID and status are required."));
    }

    const updateData = { status };
    if (status === "Successful" && utrId) {
      updateData.utrId = utrId;
    }

    const updatedSellUsdt = await SellUsdt.findByIdAndUpdate(
      transactionId,
      updateData,
      { new: true }
    );

    if (!updatedSellUsdt) {
      return res.send(error(404, "Transaction not found."));
    }

    return res.send(success(200, { updatedSellUsdt }));
  } catch (e) {
    console.error("Error updating sell usdt transaction:", e);
    return res.send(error(500, "Server error"));
  }
};
const updateDeposit = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { status } = req.body;

    if (!transactionId || !status) {
      return res
        .status(401)
        .json({ message: "Transaction ID and status are required." });
    }

    const updateData = { status };

    const updatedDeposit = await Deposit.findByIdAndUpdate(
      transactionId,
      updateData,
      { new: true }
    );

    if (!updatedDeposit) {
      return res.status(404).json({ message: "Transaction not found." });
    }

    return res.status(200).json({ updatedDeposit });
  } catch (e) {
    console.error("Error updating deposit transaction:", e);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { updateSellUsdt };

module.exports = {
  createDeposit,
  getDepositHistory,
  createWithdrawal,
  getWithdrawalHistory,
  createBankAccount,
  getBankAccount,
  sellUsdt,
  getSellUsdt,
  updateSellUsdt,
  getAllDeposits,
  updateDeposit,
  userBankAccount,
  usersellusdts,
};
