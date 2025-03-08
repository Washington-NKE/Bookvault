import { Session } from "next-auth";
import AdminSearch  from "./SearchBar"

const Header = ({ session }: { session: Session }) => {
  return (
    <header className="admin-header">
      <div>
        <h2 className="text-2xl font-semibold text-dark-400">
          Welcome, {session?.user?.name}
        </h2>
        <p className="text-base text-slate-500">
          Monitor all of your users and books here
        </p>
      </div>

      <AdminSearch />     
    </header>
  );
};
export default Header;
