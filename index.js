const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const dbConnect = require("./dbConnect");
const usdtRouter=require("./routers/usdtRouter");

dotenv.config();

const authRouter = require("./routers/authRouter");
const transactionRouter = require("./routers/transactionRouter");

const app = express();

// CORS config
app.use(
  cors({
    origin: [
      "https://chimerical-starlight-6eb981.netlify.app",
      "https://angelpro-client.netlify.app/",
      "https://angelpro-client.netlify.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);
app.options("*", cors());

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(morgan("common"));

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

// Routes
app.use("/auth", authRouter);
app.use("/transaction", transactionRouter);
app.use("/usdtPrice",usdtRouter)

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

// DB connection
dbConnect();
