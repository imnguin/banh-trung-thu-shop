import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, SafetyOutlined, ScanOutlined } from "@ant-design/icons";
import { MoonStars } from "@phosphor-icons/react";
import { useAuth } from "../../context/AuthContext";
import "./SellerLogin.css";

export default function SellerLoginPage() {
    const { isAuthenticated, login } = useAuth();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [loginData, setLoginData] = useState({ username: "", qrCodeUrl: "" });

    if (isAuthenticated) {
        return <Navigate to="/nguoi-ban" replace />;
    }

    const handleStep1 = async () => {
        try {
            const values = await form.validateFields(["username"]);
            setLoading(true);
            const res = await login(values.username, "");

            if (res.message === "REQUIRE_SETUP") {
                setLoginData({
                    username: values.username,
                    qrCodeUrl: res.data?.qrCode,
                });
                setCurrentStep(2);
            } else if (res.message === "Vui lòng nhập mã OTP!") {
                setLoginData({ ...loginData, username: values.username });
                setCurrentStep(3);
            } else if (res.isError) {
                form.setFields([
                    {
                        name: "username",
                        errors: [res.messageDetail || "Tài khoản không hợp lệ"],
                    },
                ]);
            }
        } catch (err) {
            if (err.response?.status === 404) {
                form.setFields([
                    {
                        name: "username",
                        errors: ["Tài khoản không tồn tại trên hệ thống!"],
                    },
                ]);
            } else {
                message.error("Lỗi kết nối máy chủ, vui lòng thử lại");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleStep3 = async () => {
        try {
            const values = await form.validateFields(["otp"]);
            setLoading(true);

            const res = await login(loginData.username, values.otp);
            if (res && !res.isError) {
                message.success("Đăng nhập thành công!");
                navigate("/nguoi-ban");
            } else {
                form.setFields([
                    {
                        name: "otp",
                        errors: [res.messageDetail || "Mã OTP không chính xác"],
                    },
                ]);
            }
        } catch {
            console.error("Validation OTP failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-wrapper">
            <div className={`login-container step-active-${currentStep}`}>
                <div className="progress-bar-container">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${(currentStep / 3) * 100}%` }}
                    ></div>
                </div>

                <div className="form-content">
                    <div className="flex items-center justify-center gap-2 pb-2 font-heading text-lg font-bold text-primary">
                        <MoonStars size={24} weight="fill" aria-hidden="true" />
                        Bách hóa FV
                    </div>

                    {currentStep === 1 && (
                        <div className="screen animate-in">
                            <h1>Đăng nhập</h1>
                            <p className="subtitle">
                                Vui lòng nhập tên đăng nhập của bạn
                            </p>
                            <Form
                                form={form}
                                layout="vertical"
                                requiredMark={false}
                            >
                                <Form.Item
                                    name="username"
                                    label="Tên đăng nhập"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng nhập tài khoản!",
                                        },
                                    ]}
                                >
                                    <Input
                                        prefix={
                                            <UserOutlined className="input-icon" />
                                        }
                                        placeholder="username"
                                        className="custom-input"
                                        onPressEnter={handleStep1}
                                    />
                                </Form.Item>
                                <Button
                                    type="primary"
                                    className="btn"
                                    loading={loading}
                                    onClick={handleStep1}
                                >
                                    Tiếp tục →
                                </Button>
                            </Form>
                        </div>
                    )}

                    {currentStep === 2 && loginData.qrCodeUrl && (
                        <div className="screen animate-in">
                            <h1>Kích hoạt 2FA</h1>
                            <p className="subtitle">
                                Cài đặt xác thực hai yếu tố
                            </p>
                            <div className="qr-section">
                                <div className="qr-box">
                                    <img
                                        src={loginData.qrCodeUrl}
                                        alt="QR Code Setup"
                                        style={{
                                            width: "180px",
                                            height: "180px",
                                            display: "block",
                                            margin: "0 auto",
                                        }}
                                    />
                                </div>
                                <p className="qr-hint">
                                    <ScanOutlined /> Mở ứng dụng Authenticator
                                    để quét mã
                                </p>
                            </div>
                            <Button
                                type="primary"
                                className="btn"
                                onClick={() => setCurrentStep(3)}
                            >
                                Tôi đã quét xong →
                            </Button>
                            <a
                                className="back-link"
                                onClick={() => setCurrentStep(1)}
                            >
                                ← Quay lại bước trước
                            </a>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="screen animate-in">
                            <h1>Xác thực</h1>
                            <p className="subtitle">
                                Nhập mã OTP 6 số từ ứng dụng
                            </p>
                            <Form
                                form={form}
                                layout="vertical"
                                requiredMark={false}
                            >
                                <Form.Item
                                    name="otp"
                                    label="Mã OTP"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng nhập mã OTP!",
                                        },
                                        {
                                            len: 6,
                                            message: "Mã OTP phải có 6 chữ số!",
                                        },
                                    ]}
                                >
                                    <Input
                                        prefix={
                                            <SafetyOutlined className="input-icon" />
                                        }
                                        placeholder="xxxxxx"
                                        className="custom-input"
                                        maxLength={6}
                                        onPressEnter={handleStep3}
                                    />
                                </Form.Item>
                                <Button
                                    type="primary"
                                    className="btn"
                                    loading={loading}
                                    onClick={handleStep3}
                                >
                                    Xác nhận
                                </Button>
                            </Form>
                            <a
                                className="back-link"
                                onClick={() => setCurrentStep(1)}
                            >
                                ← Quay lại bước đầu
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
