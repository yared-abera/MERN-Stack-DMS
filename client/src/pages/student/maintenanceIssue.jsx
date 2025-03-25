import MaintenanceIssueSubmit from "@/components/common/maintenanceIsseSubmit";
import { getSingleStudent } from "@/store/studentAllocation/allocateSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";


export default function ReportMaintenace() {

  const {user}=useSelector(state=>state.auth)
  const[ThisUser,setThisUser]=useState('')
  const dispatch=useDispatch()
 useEffect(()=>{
  const id=user.id
  dispatch(getSingleStudent({id})).then(data=>{
    if(data?.payload?.success){
      setThisUser(data?.payload?.data)
    }
  })

  console.log(ThisUser,"ThisUser on Student");
 },[dispatch])
  return (

    <MaintenanceIssueSubmit ThisUser={ThisUser} />

  )
}