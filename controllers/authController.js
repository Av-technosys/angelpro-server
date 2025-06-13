const User = require("../modules/User");
const Deposit =require("../modules/Deposit");
const Withdrawal=require("../modules/Withdrawal");
const SellUsdt = require("../modules/SellUsdt");
const { error, success } = require("../utils/responseWrapper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const loginController = async (req, res) => {
  const { phone, password } = req.body;
  try {
    if (!phone || !password) {
      return res.send(error(401, "All fields are require"));
    }

    const user = await User.findOne({ phone }).select("+password");
    if (!user) {
      return res.send(error(404, "User not regestered ....")); // If the client wants to register on only login page then you need to remove this line of code
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      res.send(error(403, "Incorrect password"));
    }

    const accessToken = generateAccessToken({ id: user._id });
    const refreshToken = generateRefreshToken({ id: user._id });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return res.send(success(200, { accessToken }));
  } catch (e) {
    return res.send(error(500, `error in login ${e}`));
  }
};

const userData = async (req, res) => {
  try {
    const userId = req._id;
    const user = await User.find({ _id: userId });
    return res.send(success(200, user));
  } catch (e) {
    return res.send(error(500, "Failed to retrieve user"));
  }
};


const userdeposites = async (req, res) => {
  try {
    const userId = req._id;
    console.log("userID",userId)
    const deposite = await Deposit.find({ user: userId });
    console.log("deposite",deposite)
    return res.send(success(200, deposite));
  } catch (e) {
    return res.send(error(500, "Failed to retrieve user"));
  }
};

const persondeposites = async (req, res) => {
  try {
    // const userId = req._id;
    const personID=req.params.id
    const deposite = await Deposit.find({ user: personID });
    return res.send(success(200, deposite));
  } catch (e) {
    return res.send(error(500, "Failed to retrieve user"));
  }
};

const personwithdrawals = async (req, res) => {
  try {
    const personID=req.params.id
    const withdrals = await Withdrawal.find({ user: personID });
    return res.send(success(200, withdrals));
  } catch (e) {
    return res.send(error(500, "Failed to retrieve user"));
  }
};


const allUsers = async (req, res) => {
  try {
    const userId = req._id;

    if (String(userId) != "6836e22f9ac035367e11843f") {
      return res.send(success(200, []));
    }
    const users = await User.find({});


    return res.send(success(200, users));
  } catch (e) {
    // console.log(e);
    return res.send(error(500, "Failed to retrieve user"));
  }
};

const statuschange=async(req,res)=>{
  try {
    const ID=req.params.id;
    const {status}=req.body;
    console.log("status",status,);
    console.log("ID",ID);
 
      const deposite = await Deposit.findByIdAndUpdate(ID, {
      status: status
      }, {
      new: true
      });
     

  if(status == "Approve"){
    const deposit=await Deposit.findOne({ _id: ID });
    console.log("depositedata",deposit)
    const user=await User.findByIdAndUpdate(deposit.user, {
    $inc: { balance: deposit.depositAmount } // Increment the balance by deposit.depositAmount
    })
    console.log("user",user)

  }else{
    const deposit=await Deposit.findOne({ _id: ID });
    console.log("depositedata",deposit)
    const user=await User.findByIdAndUpdate(deposit.user, {
    $inc: { balance: -deposit.depositAmount } // decrement the balance by deposit.depositAmount
    })
    console.log(user)

  }

     return res.send(success(200, deposite));
  } catch (error) {
     return res.send(error(500, "Failed to retrieve user"));
  }
}


const withdrawstatuschange=async(req,res)=>{
  try {
    const ID=req.params.id;
    const {status}=req.body;
 
      const withdraw = await Withdrawal.findByIdAndUpdate(ID, {
      status: status
      }, {
      new: true
      });
     

  if(status == "Approve"){
    const withdral=await Withdrawal.findOne({ _id: ID });
    const user=await User.findByIdAndUpdate(withdral.user, {
    $inc: { balance: -withdral.withdrawalAmount } // Increment the balance by deposit.depositAmount
    })
    console.log("user",user)

  }else{
    const withdral=await Withdrawal.findOne({ _id: ID });
    const user=await User.findByIdAndUpdate(withdral.user, {
    $inc: { balance: withdral.withdrawalAmount } // decrement the balance by deposit.depositAmount
    })
    console.log(user)

  }

     return res.send(success(200, withdraw));
  } catch (error) {
     return res.send(error(500, "Failed to retrieve user"));
  }
}


const sellusdtstatuschange=async(req,res)=>{
  try {
    const ID=req.params.id;
    const {status, amount, prevSatus}=req.body;
 
      const sellusdt = await SellUsdt.findByIdAndUpdate(ID, {
        status: status
      }, {
        new: true
      });
 
      // console.log(prevSatus)
      // console.log(status);
      // console.log(sellusdt.user);
      // console.log(amount)
     
      if(prevSatus == "Processing"){
        if(status == "Approve"){
            const user=await User.findByIdAndUpdate(sellusdt.user, {
              $inc: { balance: -amount } // Increment the balance by deposit.depositAmount
            });
        }
      }
      else if(prevSatus == "Approve"){
        if(status == "Reject"){
            const user=await User.findByIdAndUpdate(sellusdt.user, {
              $inc: { balance: amount } // Increment the balance by deposit.depositAmount
            });
        }
      }else{
        if(status == "Approve"){
            const user=await User.findByIdAndUpdate(sellusdt.user, {
              $inc: { balance: -amount } // Increment the balance by deposit.depositAmount
            });
        }
      }


     return res.send(success(200, sellusdt));
  } catch (error) {
    console.log(error);
     return res.send((500, "Failed to status change of sellusdts"));
  }
}



const signUpController = async (req, res) => {
  try {
    const { name, phone, password } = req.body;

    if (!name || !phone || !password) {
      return res.send(error(400, "all fields are required ...."));
    }

    const oldUser = await User.findOne({ phone });

    if (oldUser) {
      return res.send(error(409, "user already registerd ..... "));
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      phone,
      password: hashPassword,
    });

    await user.save();
    // const newUser = await User.findById(user._id);

    return res.send(success(201, "user created succesfully"));
  } catch (e) {
    // console.log(e);
    return res.send(error(500, e.message));
  }
};
const logOutController = async (req, res) => {
  try {
    res.clearCookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return res.send(success(200, "logout successfully"));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const generateAccessToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
      expiresIn: "1y",
    });
    // console.log("Access Token " + token);
    return token;
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const generateRefreshToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
      expiresIn: "1y",
    });
    // console.log("Refresh Token " + token);
    return token;
  } catch (e) {
    return res.send(error(500, e.message));
  }
};
module.exports = {
  loginController,
  signUpController,
  logOutController,
  userData,
  allUsers,
  userdeposites,
  persondeposites,
  statuschange,
  personwithdrawals,
  withdrawstatuschange,
  sellusdtstatuschange
};
