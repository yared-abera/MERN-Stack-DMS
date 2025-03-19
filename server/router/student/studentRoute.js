const express=require('express')
const { InsertStudent,fetchAllStudent } = require('../../controller/Student/studentController')

const route=express.Router()

route.post('/insert',InsertStudent)
route.get('/get',fetchAllStudent)

module.exports=route