require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db")
const authRouter = require("./routes/auth")

const app = express();

app.use(express.json());

app.use(cors({
    origin : "https://basicauthorization.netlify.app",
    methods : ["GET", "POST", "PUT", "DELETE"],
    credentials : true
}))

app.use("/api/auth", authRouter);

module.exports = app;

if (process.env.NODE_ENV !== "test") {
  connectDB();
  
  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log(`Server running on Port : ${PORT}`);
  });
}