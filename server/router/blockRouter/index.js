const express =require("express")
const route=express.Router()
const {registerBlock}=require('../../blockController/index')

route.post("/register",registerBlock)


module.exports=route;
