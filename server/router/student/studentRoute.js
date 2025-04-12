const express=require('express')
const { InsertStudent,fetchAllStudent,fetchSingleStudent,updateStudent,DeleteStudent, DeleteAllStudent} = require('../../controller/Student/studentController')

const route=express.Router()

route.post('/insert',InsertStudent)
route.get('/get',fetchAllStudent)
route.get('/getOne/:id',fetchSingleStudent)
route.put('/update/:id',updateStudent)
route.delete('/delete/:id',DeleteStudent)
route.delete('/deleteAll',DeleteAllStudent)
module.exports=route