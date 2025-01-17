const whiteList = ["http://localhost:5501", "http://127.0.0.1:5501"];

const corsOptions = {
  origin: (origin, callback) => {
    console.log("CORS origin check:", origin);
    if (whiteList.indexOf(origin) !== -1 || !origin) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  optionsSuccessStatus: 200
}

module.exports = {corsOptions, whiteList};