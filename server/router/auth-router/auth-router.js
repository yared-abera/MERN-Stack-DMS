const express=require('express')
const {UserAccount,logInUser,LogOut,authMiddleware} =require('../../controller/auth-controller/index')
const route=express.Router()

 

route.post('/logIn',logInUser);
route.post('/account',UserAccount)
route.get('/logOut',LogOut)
route.get('/checkauth', authMiddleware, (req, res) => {
    const value = req.user;
    res.status(200).json({
      success: true,
      message: "Authenticated user!",
      user:value
    });
  });


 

module.exports=route