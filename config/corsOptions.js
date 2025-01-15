const whiteList = ["http://127.0.0.1:5501"];

const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin) !== 1) callback(null, true);
    else callback(new Error("Not allowed by CORS!"));
  },
  optionsSuccessStatus: 200
}