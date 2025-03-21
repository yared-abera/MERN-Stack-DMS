const express =require("express")
const route=express.Router()
const {registerBlock,getAvailableProctors,getProctorBlocks,getAvailableBlocks,UpdateBlock,getALLBlocks}=require('../../controller/blockController/index')
const { authMiddleware } =require('../../controller/auth-controller/index')


route.post("/register",registerBlock);
route.get("/proctors/available",getAvailableProctors);
route.get("/proctor/my-block",authMiddleware,getProctorBlocks);
route.get("/getAvailabeBlock",getAvailableBlocks);
route.put('/update',UpdateBlock)
route.get("/getAll",getALLBlocks);
module.exports=route;
