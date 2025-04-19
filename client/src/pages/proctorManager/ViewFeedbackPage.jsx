import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFeedBackForUser } from "@/store/feedBack/feedBack";

const ViewFeedback = () => {
  const { user } = useSelector((state) => state.auth);
  const { AllFeedBack } = useSelector((state) => state.feedBack);
  const dispatch = useDispatch();

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  useEffect(() => {
    const sex = capitalizeFirstLetter(user.sex);
    dispatch(getFeedBackForUser(sex));
  }, [dispatch]);

  console.log(AllFeedBack, "AllFeedBack");
 
  return (
    <div className="w-full p-4 bg-slate-100/35 ">
      <div className="m-2 w-full">

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {
  AllFeedBack&&AllFeedBack.success&&AllFeedBack.data.length>0?AllFeedBack.data.map(stud=><Card>
    <CardHeader>
      <CardTitle>Student {stud.userId.Fname||''} {stud.userId.Mname||''} {stud.userId.Lname||''}</CardTitle>
    </CardHeader>
    <CardContent>
      <p>User Name: {stud.userId.userName||''}</p>
      <p>Block :{stud.userId.blockNum||''}</p>
      <p>Create At :{stud.userId.dormId||''}</p>
      <p>Create At :{stud.createdAt||''}</p>
      <div className="w-auto">

   <p> Message:{stud.description||''}</p>
      </div>
    </CardContent>
  </Card>):<div>
      No Feed back is Found
    </div>
}
        </div>

   
      </div>
     
    </div>
  );
};

export default ViewFeedback;
