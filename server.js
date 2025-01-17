require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
// const corsOptions = require("./config/corsOptions");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const cookieParser = require("cookie-parser");

// Connect to MongoDB
connectDB();

const whiteList = ["http://localhost:5501", "http://127.0.0.1:5501"];
const corsOptions = {
  origin: (origin, callback) => {
    console.log("CORS origin check:", origin);
    if (whiteList.indexOf(origin) !== -1 || !origin) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
  credentials: true, // Automaticky přidá Access-Control-Allow-Credentials: true
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));

// verify JWT access token for routes below
app.use(require("./middleware/verifyJWT"));
app.use("/user", require("./routes/api/user"));

// error handler
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({error: err.message});
})

const PORT = process.env.PORT || 7000;
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {console.log("Server is running on port:", PORT)});
})