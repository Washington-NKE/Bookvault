import AccountRequests from "@/components/admin/AccountRequests";
import BorrowRequests from "@/components/admin/BorrowRequests";
import RecentlyAddedBooks from "@/components/admin/RecentlyAddedBooks";
//import Stats from "@/components/admin/Stats";
import Stats from "@/components/admin/TrendingDisplay";
import React from "react";


const Page = () => {

  return (
    <div className="p-6">
      {/* <Stats /> */}
      <Stats />
      <div className="mt-6 grid grid-cols-12 gap-6"> 
        <div className="col-span-6">
          <BorrowRequests />
          <AccountRequests />
          </div>
        <div className="col-span-6">
          <RecentlyAddedBooks />
        </div>
      </div>
    </div>
  );
};
export default Page;
