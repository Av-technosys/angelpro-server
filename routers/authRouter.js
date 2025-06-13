const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const requredUser = require("../middlewares/requiredUser");

router.post("/login", authController.loginController);
router.post("/signup", authController.signUpController);
router.post("/logout", authController.logOutController);
router.post("/user", requredUser, authController.userData);
router.get("/users", requredUser, authController.allUsers);
// router.get("/user-deposites", requredUser, authController.userdeposites);
router.get("/person-deposites/:id", requredUser, authController.persondeposites);
router.patch("/status-change/:id", requredUser, authController.statuschange);
router.get("/person-withdrawal/:id", requredUser, authController.personwithdrawals);
router.patch("/status-change/withdraw/:id", requredUser, authController.withdrawstatuschange);
router.patch("/status-change/sellusdts/:id", requredUser, authController.sellusdtstatuschange);

module.exports = router;
