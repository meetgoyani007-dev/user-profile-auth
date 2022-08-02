const express = require("express");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");
const upload = require("express-fileupload");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

var corsOptions = {
  origin: "http://localhost:8080"
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload())

const db = require("./app/models");
db.mongoose
  .connect(
    `mongodb+srv://${dbConfig.USERNAME}:${dbConfig.PASSWORD}@${dbConfig.CLUSTER}.miielgr.mongodb.net/${dbConfig.DB}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

app.get("/", (req, res) => {
  res.json({ message: "Welcome to User Profile Application." });
});

require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});