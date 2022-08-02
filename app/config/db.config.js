const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  USERNAME: process.env.hostuser,
  PASSWORD: process.env.password,
  DB: process.env.db,
  CLUSTER: process.env.cluster,
};
