const express=require('express')
const { InsertStudent,fetchAllStudent,fetchSingleStudent,updateStudent,DeleteStudent,ChangePassword, DeleteAllStudent,fetchStuentForProctor,updateByStudent} = require('../../controller/Student/studentController')

const route=express.Router()

route.post('/insert',InsertStudent)
route.put('/updatePassword/:id',ChangePassword)
route.get('/get',fetchAllStudent)
route.get('/getOne/:id',fetchSingleStudent)
route.put('/update/:id',updateStudent)
route.put('/updateByStud/:id',updateByStudent)
route.delete('/delete/:id',DeleteStudent) 
route.delete('/deleteAll',DeleteAllStudent)
route.get('/getForProctor/:id', fetchStuentForProctor)
module.exports=route

