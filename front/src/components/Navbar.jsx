import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, Menu, ShipWheelIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";
import { useState } from "react";

const Navbar = () => {
  const [MenuOpen, setMenuOpen] = useState(false);
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  const { logoutMutation } = useLogout(); // custom hook for logout
  const toggleMobileMenu = () => {
    setMenuOpen(!MenuOpen);
  };

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end gap-2 w-full">
          {/* LOGO - ONLY IN THE CHAT PAGE */}
          {isChatPage && (
            <div className="pl-5">
              <Link to="/" className="flex items-center gap-2.5">
                <ShipWheelIcon className="size-9 text-primary" />
                <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
                  LinkUP
                </span>
              </Link>
            </div>
          )}
          <div className="lg:hidden fixed left-4">
            <Link to="/" className="flex items-center gap-1.5">
              <ShipWheelIcon className="size-9 text-primary" />
              <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
                LinkUP
              </span>
            </Link>
          </div>

          <div className="sm:flex hidden items-center ml-auto">
            <Link to={"/notifications"}>
              <button className="btn btn-ghost btn-circle">
                <BellIcon className="h-6 w-6 text-base-content opacity-70" />
              </button>
            </Link>
          </div>

          {/* TODO */}
          <ThemeSelector />

          <div className="avatar hidden sm:block">
            <Link to={`/profile/${authUser?._id}`}>
              <div className="w-9 rounded-full">
                <img
                  src={authUser?.profilePic}
                  alt="User Avatar"
                  rel="noreferrer"
                />
              </div>
            </Link>
          </div>

          {/* Logout button */}
          <button
            className="btn btn-ghost btn-circle hidden sm:block"
            onClick={logoutMutation}
          >
            <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
          </button>
        </div>
      </div>
      {/* moobile menu */}
      <div
        className="dropdown dropdown-end sm:hidden"
        onClick={toggleMobileMenu}
      >
        <label tabIndex={0} className="btn btn-ghost btn-circle">
          <Menu className="h-6 w-6 text-base-content opacity-70" />
        </label>
        {MenuOpen && (
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link to="/" className="flex items-center gap-2">
                <ShipWheelIcon className="h-6 w-6 text-base-content opacity-70" />
                Home
              </Link>
            </li>
            <li>
              <Link to={"/notifications"}>
                <BellIcon className="h-6 w-6 text-base-content opacity-70" />
                Notifications
              </Link>
            </li>
            <li>
              <Link to={`/profile/${authUser?._id}`}>
                <img
                  src={authUser?.profilePic}
                  alt="User Avatar"
                  className="w-6 h-6 rounded-full"
                />
                Profile
              </Link>
            </li>
            <li>
              <button onClick={logoutMutation}>
                <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
                Logout
              </button>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};
export default Navbar;
