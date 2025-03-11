require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const auth_route = require("./router/auth-router/auth-router");
const block_route= require("./router/blockRouter/index")
const dorm_route= require("./router/dormRouter/index")
mongoose
  .connect(process.env.MONGO_URL, 
    {serverSelectionTimeoutMS: 30000}
  )
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

  // mongoose.connect( 'mongodb+srv://soul:dms%40433@cluster0.jm8wi.mongodb.net/dms?retryWrites=true&w=majority',
  //   {
  //     useNewUrlParser: true,
  //     useUnifiedTopology: true,
  //     serverSelectionTimeoutMS: 30000, // Increase timeout
  //   }
  // )
  // .then(()=>{
  //     console.log("connected to database")
  // }).catch((err)=>{
  //     console.log(err)
  // });

const app = express();

app.use(cookieParser());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.Client_URL|| "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    allowedHeaders: [
        "content-type",
        "Authorization",
        "Cache-Control",
        "Expires",
        "Pragma",
    ],
    credentials: true,
  })
);

 
 
app.use("/api/auth/",auth_route);
app.use("/api/block/",block_route);
app.use("/api/dorm/",dorm_route);


app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
