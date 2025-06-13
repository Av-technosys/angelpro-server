const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const requredUser = require("../middlewares/requiredUser");
router.post("/deposite", requredUser, transactionController.createDeposit);
router.post("/withdrawal", requredUser, transactionController.createWithdrawal);
router.get(
  "/depositHistory",
  requredUser,
  transactionController.getDepositHistory
);
router.get(
  "/getalldeposits",
  requredUser,
  transactionController.getAllDeposits
);
router.get(
  "/withdrawalHistory",
  requredUser,
  transactionController.getWithdrawalHistory
);
router.post("/addbank", requredUser, transactionController.createBankAccount);
router.get("/bankaccounts", requredUser, transactionController.getBankAccount);
router.post("/sellusdt", requredUser, transactionController.sellUsdt);
router.get("/getsellusdt", requredUser, transactionController.getSellUsdt);
router.put("/sellusdt/:transactionId", transactionController.updateSellUsdt);
router.put("/deposit/:transactionId", transactionController.updateDeposit);
router.get("/user-bankdetails/:id", transactionController.userBankAccount);
router.get("/user-sellusdts/:id", requredUser, transactionController.usersellusdts);


module.exports = router;
