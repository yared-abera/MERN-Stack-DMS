import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { getFeedBackForStudent } from "@/store/feedBack/feedBack";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function MyCommnt({ isDialogOpen, HandleRemoveDialog, id }) {
  const [myComments, setMyComments] = useState([]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getFeedBackForStudent({ id })).then((data) => {
      console.log(data, "data");
      if (data?.payload.success) {
        setMyComments(data?.payload.data);
      }
    });
  }, [dispatch,id]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={HandleRemoveDialog}>
      <DialogContent className="max-w-2xl h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>see my comments</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div className="grid grid-cols-2 gap-2 ">
            {myComments &&
              myComments.length > 0 &&
              myComments.map((item) => (
                <div key={item._id}>
                  <p>
                    Full Name:{item.userId.Fname} {item.userId.Mname}{" "}
                    {item.userId.Lname}
                  </p>
                  <p>userName:{item.userId.Lname} </p>
                  <p>Create Data :{item.createdAt}</p>
                  <p>Message:{item.description}</p>
                  <Separator />
                </div>
              ))}
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
