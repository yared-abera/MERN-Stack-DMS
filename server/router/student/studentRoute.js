const express=require('express')
const { InsertStudent,fetchAllStudent,fetchSingleStudent } = require('../../controller/Student/studentController')

const route=express.Router()

route.post('/insert',InsertStudent)
route.get('/get',fetchAllStudent)
route.get('/getOne/:id',fetchSingleStudent)

module.exports=route