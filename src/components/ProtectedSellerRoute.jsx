import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedSellerRoute() {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        return <Navigate to="/nguoi-ban/dang-nhap" replace />;
    }
    return <Outlet />;
}
