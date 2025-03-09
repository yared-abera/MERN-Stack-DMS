const express =require("express")
const route=express.Router()
const {registerBlock,getAvailableProctors,getProctorBlocks}=require('../../controller/blockController/index')
 

route.post("/register",registerBlock);
route.get("/proctors/available",getAvailableProctors);
route.get("/proctor/my-block",getProctorBlocks);


module.exports=route;
