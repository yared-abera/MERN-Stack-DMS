const express =require("express")
const route=express.Router()
const {registerBlock,getAvailableProctors,getProctorBlocks}=require('../../controller/blockController/index')
const { authMiddleware } =require('../../controller/auth-controller/index')

route.post("/register",registerBlock);
route.get("/proctors/available",getAvailableProctors);
route.get("/proctor/my-block",authMiddleware,getProctorBlocks);


module.exports=route;
