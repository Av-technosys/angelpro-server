const usdtController=require("../controllers/usdtPrice");
const express=require("express");
const usdtRouter=express.Router();

usdtRouter.post("/create/:price",usdtController.usdtpricecreate);
usdtRouter.get("/getPrice",usdtController.usdtgetprice)

module.exports=usdtRouter;