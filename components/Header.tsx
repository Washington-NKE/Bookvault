import Link from "next/link";
import Image from "next/image";
import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { Avatar,AvatarFallback } from "./ui/avatar";
import {Session} from "next-auth";
import  {getInitials} from "@/lib/utils"
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";


const Header = async ({session}:{session: Session}) => {
  const userId= session?.user?.id as string;
      const isAdmin = await db
        .select({ isAdmin: users.role })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1)
        .then((res) => res[0]?.isAdmin === "ADMIN");

  return (
    <header className="my-10 flex items-center justify-between">
      <Link href="/">
        <Image src="/icons/logo.svg" alt="logo" width={40} height={40} />
      </Link>

      <ul className="flex items-center gap-8">
        <li>
        <Link href="">
              <Button variant="outline" className=" border-transparent bg-transparent p-0  text-gray-100 transition duration-300 
              hover:border-b-yellow-500    hover:bg-transparent  hover:text-gray-100   active:text-amber-400 ">Search</Button>
            </Link>
        </li>
      {isAdmin && (
          <li>
            <Link href="/admin">
              <Button variant="outline" className="border-transparent bg-transparent p-0  text-gray-100 transition duration-300 
              hover:border-b-yellow-500    hover:bg-transparent  hover:text-gray-100   active:text-amber-400">Admin</Button>
            </Link>
          </li>
        )}
        <li>
          <Link href="/my-profile">
            <Avatar>
              <AvatarFallback className="bg-amber-100">{getInitials(session?.user?.name || "IN")}</AvatarFallback>
            </Avatar>
            
          </Link>
        </li>
        <li>
          <form
            action={async () => {
              "use server";

              await signOut();
            }}
          >
            <Button>Logout</Button>
          </form>
        </li>
      </ul>
    </header>
  );
};

export default Header;
