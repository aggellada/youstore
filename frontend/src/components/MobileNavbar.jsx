import { Home, LogIn, LogOut, Menu, Palette, ShoppingCart, Store, X } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

function MobileNavbar({ resetHomePage }) {
  const [showMenu, setShowMenu] = useState();

  const { authUser, logout } = useAuthStore();

  const clickHome = () => {
    resetHomePage();
    setShowMenu(false);
  };

  const handleLogOutBtn = () => {
    logout();
    setShowMenu(false);
  };

  return (
    <>
      <div className="md:hidden w-full h-full px-4 flex justify-between items-center z-50">
        <Link to="/" className="flex gap-2">
          <Store />
          <h1>YouStore</h1>
        </Link>
        {showMenu ? (
          <X onClick={() => setShowMenu((prev) => !prev)} />
        ) : (
          <Menu onClick={() => setShowMenu((prev) => !prev)} />
        )}
      </div>
      {showMenu && (
        <div className="md:hidden z-[9999] fixed right-0 h-full w-60 bg-base-300 flex flex-col gap items-center gap-4 pt-10">
          <Link to="/" onClick={clickHome}>
            <button className="btn rounded-3xl flex gap-4">
              <Home />
              Home
            </button>
          </Link>
          {authUser && (
            <Link to="/cart" onClick={() => setShowMenu(false)}>
              <button className="btn rounded-3xl flex gap-4">
                <ShoppingCart />
                Cart
              </button>
            </Link>
          )}
          <Link to="/settings" onClick={() => setShowMenu(false)}>
            <button className="btn rounded-3xl flex gap-4">
              <Palette />
              Change Theme
            </button>
          </Link>
          {authUser ? (
            <Link to="/" onClick={handleLogOutBtn}>
              <button className="btn rounded-3xl flex gap-4">
                <LogOut />
                Log out
              </button>
            </Link>
          ) : (
            <Link to="/login" onClick={() => setShowMenu(false)}>
              <button className="btn rounded-3xl flex gap-4">
                <LogIn />
                Log in
              </button>
            </Link>
          )}
        </div>
      )}
    </>
  );
}

export default MobileNavbar;
