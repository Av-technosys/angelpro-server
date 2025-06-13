const mongoose = require("mongoose");

module.exports = async () => {
  try {
    const mongoURL = process.env.MONGOOSE_URL;
    const connect = await mongoose.connect(mongoURL);
    console.log(`mongodb connected  ${connect.connection.host} `);
  } catch (e) {
    console.log(`error occured in mongoose connection ${e}`);
    process.exit(1);
  }
};
