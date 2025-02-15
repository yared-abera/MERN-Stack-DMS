import { Button } from "@/components/ui/button";

export default function StudDeanAccount() {
  return (
    <div className="w-full min-h-screen  mt-20 overflow-hidden">
      <div className="flex flex-col gap-2 p-4   ">
        <div className="flex flex-col items-center border-solid shadow-md mt-8">
          <h1>My profile</h1>

          <div className="m-4 flex items-center justify-around w-full">
            <div className="grid grid-cols-1 gap-4">
              <div className="rounded-full bg-black w-24 h-24 dark:bg-white "></div>
              <div>
                <p>Bio:</p>
              </div>
            </div>

            <Button>edit</Button>
          </div>
        </div>

        <div className="border-solid shadow-md mt-8">
          <div className="flex items-center justify-between gap-2">
            <h1>Personal Information</h1>
            <Button>edit</Button>
          </div>

          <div className=" grid grid-cols-2 gap-2">
            <p>First Name</p>
            <p>zulkif</p>

            <p>last Name</p>
            <p>zu</p>

            <p>email</p>
            <p>zu@gmail.com</p>
            <div className='block' >
            <Button>View Detail</Button>
          </div>
           
          </div>
        </div>

        <div className="w-full  border-solid shadow-md mt-8 px-7">
          <div>
            <div className="flex justify-between items-start">
              <h1>Address & contact </h1>
              <Button>edit</Button>
            </div>

            <div className="grid grid-cols-2 gap-1 w-full">
              <p>country:</p>
              <p>addis</p>
              <p>city</p>
              <p>wolkite</p>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-2 gap-1 w-full">
              <p>Phone:</p>
              <p>0912344</p>
              <p>facebook</p>
              <p>faceBook</p>
              <p>twiter</p>
              <p>Twiter</p>
              <p>telegram</p>
              <p>telegram</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
