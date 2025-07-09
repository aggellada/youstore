import React from "react";
import { Loader2, Palette, ShoppingCart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useProductStore } from "../../store/useProductStore";
import MobileNavbar from "./MobileNavbar";

function Navbar() {
  const { authUser, logout, isLoggingOut } = useAuthStore();
  const { getAllProducts, resetSearchedProduct } = useProductStore();

  const location = useLocation();

  const resetHomePage = () => {
    getAllProducts();
    resetSearchedProduct();
  };

  return (
    <div className="w-full h-[65px] fixed border-b-1 border-base-200 bg-base-200 md:px-12">
      <MobileNavbar resetHomePage={resetHomePage} />
      <div className="hidden h-full container mx-auto md:flex justify-between items-center">
        <div className="">
          <Link to="/" onClick={location.pathname === "/" && resetHomePage}>
            <h1>PostgreStore</h1>
          </Link>
        </div>
        <div className="h-full flex gap-6 items-center">
          <Link to="/settings">
            <Palette />
          </Link>
          {authUser && (
            <Link to="/cart">
              <ShoppingCart />
            </Link>
          )}
          {!authUser ? (
            <Link to="/login">
              <button className="btn">Log in</button>
            </Link>
          ) : (
            <button className="btn" onClick={logout}>
              {isLoggingOut ? <Loader2 className="animate-spin" /> : "Sign out"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
