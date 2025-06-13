 const usdtModel=require("../modules/usdtprice");
const { success } = require("../utils/responseWrapper");

 const usdtController={
   async usdtpricecreate(req,res){
   try {
     const usdtprice=req.params.price;
    await usdtModel.findOneAndUpdate(
  {}, // filter
  { value: usdtprice }, // update
  { new: true, upsert: true } // options
);    res.send(success(200,"Usdt Price Change Successfully..."))
   } catch (e) {
     res.send(error(500,"Failed To Create UsdtPrice..."))
   }
  },

  async usdtgetprice(req,res){
   try {
     const usdt=await usdtModel.find();
     res.send(success(200,usdt[0].value))
   } catch (error) {
    res.send(success(200,error))
   }
  }

 }



 module.exports=usdtController;