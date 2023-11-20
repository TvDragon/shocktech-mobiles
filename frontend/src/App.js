import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeState from "./pages/Home/HomeState";
import SearchState from "./pages/Search/SearchState";
import ProductState from "./pages/Product/ProductState";
import AccountForm from "./pages/Account/AccountForm";
import ErrorState from "./pages/Error/ErrorState";
import Profile from "./pages/Account/Profile";
import ChangePassword from "./pages/Account/ChangePassword";
import Cart from "./pages/Cart/Cart";

import {AuthConProvider} from './context/AuthContext';

import "./css/global.css";
import ProductReviews from "./pages/Account/ProductReviews";

function App() {
  return (
    <AuthConProvider>
      <div>
        <BrowserRouter>
          <Routes>
              <Route path="/" element={<HomeState />} />
              <Route path="/search" element={<SearchState />} />
              <Route path="/product" element={<ProductState />} />
              <Route path="/account" element={<AccountForm />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/changePassword" element={<ChangePassword />} />
              <Route path="/productReviews" element={<ProductReviews />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="*" element={<ErrorState />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthConProvider>
    );
}

export default App;