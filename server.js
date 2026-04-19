const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// load the env 
dotenv.config();

//  initialize the app
const app = express();

// connect db 
connectDB();

// middleware 
app.use(express.json());
app.use(cors())  //middleware cross origin requested

// route 
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
const PORT = process.env.PORT;

app.listen( PORT, () =>{
    console.log(`Server is running on http://localhost:${PORT}`)
})
