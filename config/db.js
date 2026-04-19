
// import mongoose from mpngoose
const mongoose  = require("mongoose");


//  function to connect the database

const connectDB  = async () => {
    try{

        // connect to mongodb
        await mongoose.connect(process.env.MONGO_URL)
        console.log("MongoDB connected successfully")

    }catch(error){
        console.log("DB connection error:", error.message);
        process.exit(1);
    }
}

// export the function
module.exports = connectDB