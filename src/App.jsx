import { Routes, Route } from "react-router-dom";
import CustomerLayout from "./layouts/CustomerLayout";
import SellerLayout from "./layouts/SellerLayout";
import ProtectedSellerRoute from "./components/ProtectedSellerRoute";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import OrderLookupPage from "./pages/OrderLookupPage";
import SellerLoginPage from "./pages/seller/SellerLoginPage";
import SellerDashboardPage from "./pages/seller/SellerDashboardPage";
import SellerOrderDetailPage from "./pages/seller/SellerOrderDetailPage";
import SellerProductsPage from "./pages/seller/SellerProductsPage";

function App() {
    return (
        <Routes>
            <Route element={<CustomerLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/san-pham" element={<ProductsPage />} />
                <Route path="/san-pham/:slug" element={<ProductDetailPage />} />
                <Route path="/gio-hang" element={<CartPage />} />
                <Route path="/thanh-toan" element={<CheckoutPage />} />
                <Route
                    path="/dat-hang-thanh-cong/:orderId"
                    element={<OrderSuccessPage />}
                />
                <Route path="/tra-cuu-don-hang" element={<OrderLookupPage />} />
            </Route>

            <Route path="/nguoi-ban/dang-nhap" element={<SellerLoginPage />} />
            <Route path="/nguoi-ban" element={<ProtectedSellerRoute />}>
                <Route element={<SellerLayout />}>
                    <Route index element={<SellerDashboardPage />} />
                    <Route
                        path="don-hang/:orderId"
                        element={<SellerOrderDetailPage />}
                    />
                    <Route path="san-pham" element={<SellerProductsPage />} />
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
