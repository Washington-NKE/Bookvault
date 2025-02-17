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
      const isAdmin = await db
        .select({ isAdmin: users.role })
        .from(users)
        .where(eq(users.id, session.user.id))
        .limit(1)
        .then((res) => res[0]?.isAdmin === "ADMIN");

  return (
    <header className="my-10 flex justify-between gap-5">
      <Link href="/">
        <Image src="/icons/logo.svg" alt="logo" width={40} height={40} />
      </Link>

      <ul className="flex flex-row items-center gap-8">
      {isAdmin && (
          <li>
            <Link href="/admin" className="mt-5" >
              <Button variant="outline" className="bg-amber-100">Admin</Button>
            </Link>
          </li>
        )}
        <li>
          <Link href="/my-profile" className="mb-10">
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
            className="mb-10"
          >
            <Button>Logout</Button>
          </form>
        </li>
      </ul>
    </header>
  );
};

export default Header;
