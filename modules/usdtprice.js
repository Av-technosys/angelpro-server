const mongoose=require("mongoose");

const usdtPriceSchema=mongoose.Schema(
    {
        value:{
            type:Number,
            required:true
        }
    },{timestamps:new Date()}
)

const usdtModel=new mongoose.model("usdtPrice",usdtPriceSchema);
module.exports = usdtModel;