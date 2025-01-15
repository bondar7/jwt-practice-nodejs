const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const cookieParser = require("cookie-parser");

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/register", require("./routes/register"));

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {console.log("Server is running on port:", PORT)});