const express=require('express')
const {UserAccount,LogIn} =require('../../controller/auth-controller/index')
const route=express.Router()

console.log('routes');


route.post('logIn',LogIn);
route.post('/account',UserAccount)

module.exports=route