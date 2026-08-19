import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import "./index.css";
import App from "./App.jsx";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { CategoryProvider } from "./context/CategoryContext";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#92400e",
                    borderRadius: 8,
                    fontFamily: "'Nunito Sans', system-ui, sans-serif",
                },
            }}
        >
            <BrowserRouter>
                <AuthProvider>
                    <CategoryProvider>
                        <CartProvider>
                            <App />
                        </CartProvider>
                    </CategoryProvider>
                </AuthProvider>
            </BrowserRouter>
        </ConfigProvider>
    </StrictMode>,
);
