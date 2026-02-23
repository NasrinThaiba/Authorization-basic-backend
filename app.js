require('dns').setDefaultResultOrder('ipv4first');
require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db")
const cors = require("cors");

const authRouter = require("./routes/auth")

const app = express();

const PORT = process.env.PORT;

connectDB();

app.use(express.json());

app.use(cors({
    origin : "https://basicauthorization.netlify.app",
    methods : ["GET", "POST", "PUT", "DELETE"],
    credentials : true
}))

app.use("/api/auth", authRouter);

app.listen(PORT, () => {
    console.log(`Server running on Port : ${PORT}`)
})