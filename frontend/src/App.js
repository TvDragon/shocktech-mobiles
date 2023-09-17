import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeState from "./pages/Home/HomeState";
import SearchState from "./pages/Search/SearchState";
import ProductState from "./pages/Product/ProductState";
import AccountForm from "./pages/Account/AccountForm";
import ErrorState from "./pages/Error/ErrorState";

import "./css/global.css";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<HomeState />} />
            <Route path="/search" element={<SearchState />} />
            <Route path="/product" element={<ProductState />} />
            <Route path="/account" element={<AccountForm />} />
            <Route path="*" element={<ErrorState />} />
        </Routes>
      </BrowserRouter>
    </div>
    );
}

export default App;