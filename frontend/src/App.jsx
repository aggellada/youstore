import { Navigate, Route, Routes } from "react-router-dom";
import { useThemeStore } from "../store/useThemeStore";
import SettingsPage from "./pages/SettingsPage";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/LoginPage";
import { useAuthStore } from "../store/useAuthStore";
import CartPage from "./pages/CartPage";
import SigninPage from "./pages/SignupPage";

function App() {
  const { theme } = useThemeStore();
  const { authUser } = useAuthStore();

  return (
    <div className="" data-theme={theme}>
      <Navbar />
      <Routes>
        <Route path="/settings" element={<SettingsPage />}></Route>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/products/:id" element={<ProductPage />}></Route>
        <Route path="/login" element={authUser ? <Navigate to="/" /> : <LoginPage />}></Route>
        <Route path="/cart" element={authUser ? <CartPage /> : <LoginPage />}></Route>
        <Route path="/signin" element={authUser ? <Navigate to="/" /> : <SigninPage />}></Route>
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
