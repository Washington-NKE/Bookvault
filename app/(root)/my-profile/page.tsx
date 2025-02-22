import BorrowedBooks from "@/components/BorrowedBooks";
import Profile from "@/components/Profile";
import { auth } from "@/auth";


const Page = async () => {
  const session = await auth();
  return (
    <div className="flex w-full gap-4">
      <div className=" flex  min-h-[200px] w-1/2 ">
      <Profile userId={session?.user?.id as string} />
      </div>
      <div className="w-1/2">
      <BorrowedBooks userId = {session?.user?.id as string} />
      </div>
    </div>
  );
};

export default Page;