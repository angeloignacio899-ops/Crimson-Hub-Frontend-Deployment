import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, X } from "lucide-react";
import axios from "axios";
import AuthCard from "../components/common/AuthCard";
import LoginForm from "../components/common/LoginForm";
import SignupForm from "../components/common/SignupForm";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useError } from "../context/ErrorContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showError } = useError();

  const [isFlipped, setIsFlipped] = useState(location.pathname === "/signup");
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [isSubmittingForgot, setIsSubmittingForgot] = useState(false);

  useEffect(() => {
    if (location.pathname === "/signup") setIsFlipped(true);
    else setIsFlipped(false);
  }, [location.pathname]);

  // =========================================================
  // 🔑 FORGOT PASSWORD HANDLER
  // =========================================================
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotMessage("");
    setIsSubmittingForgot(true);

    try {
      const res = await axios.post(
        window.API_BASE + "/api/auth/forgot-password",
        { email: forgotEmail }
      );
      setForgotMessage(res.data.msg || "Password reset link sent to your email!");
      setForgotEmail("");
      setTimeout(() => {
        setIsForgotPasswordOpen(false);
        setForgotMessage("");
      }, 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.msg || "Failed to send reset link. Try again.";
      setForgotMessage(errorMsg);
      showError(errorMsg);
    } finally {
      setIsSubmittingForgot(false);
    }
  };

  const closeForgotPasswordModal = () => {
    setIsForgotPasswordOpen(false);
    setForgotMessage("");
    setForgotEmail("");
  };
  
  const handleFlip = (path) => {
    setIsFlipped(path === "/signup");
    setTimeout(() => {
      navigate(path);
    }, 500); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#C8102E] to-[#a00e25] relative overflow-hidden">
      {/* Full-screen loading spinner */}
      {isLoading && <LoadingSpinner />}

      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-center bg-cover opacity-20"
        style={{ backgroundImage: "url('/bg-logo.svg')" }}
      ></div>

      {/* Auth card container */}
      <div className="flex w-[950px] min-h-[650px] bg-white rounded-3xl shadow-2xl overflow-hidden relative">
        <div className="w-1/2 relative perspective-1000">
          <div
            className={`absolute inset-0 transition-transform duration-700 transform-style-preserve-3d ${
              isFlipped ? "rotate-y-180" : ""
            }`}
          >
            {/* LOGIN SIDE */}
            <div className="absolute inset-0 backface-hidden flex items-center justify-center">
              <AuthCard title="Crimson Event Hub">
                <p className="text-gray-600 mb-5">Sign In to your Account</p>
                <LoginForm
                  onFlip={() => handleFlip("/signup")}
                  setIsLoading={setIsLoading}
                  onForgotPasswordClick={() => setIsForgotPasswordOpen(true)}
                  onLoginSuccess={(role_id) => {
                    switch (role_id) {
                      case 1: // user
                        navigate("user");
                        break;
                      case 2: // Organizer
                        navigate("/organizer");
                        break;
                      case 3: // admin
                        navigate("/admin/dashboard"); // Change this to user dashboard when available
                        break;
                      default:
                        navigate("/login"); // fallback
                    }
                  }}
                />
              </AuthCard>
            </div>

            {/* SIGNUP SIDE */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 flex items-center justify-center">
              <AuthCard title="Crimson Event Hub">
                <p className="text-gray-600 mb-5">Create your Account</p>
                <SignupForm onFlip={() => handleFlip("/login")} />
              </AuthCard>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE PANEL */}
        <div className="w-1/2 flex flex-col items-center justify-center text-white p-10 bg-[#C8102E]">
          {!isFlipped ? (
            <>
              <h2 className="text-3xl font-bold mb-4">Hello, Friend!</h2>
              <p className="mb-6 text-center">
                Don’t have an account yet? Join us today!
              </p>
              <button
                onClick={() => handleFlip("/signup")}
                className="bg-white text-[#C8102E] font-semibold px-6 py-2 rounded-lg hover:bg-[#FFD3D3] transition"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
              <p className="mb-6 text-center">
                Already have an account? Log in to continue.
              </p>
              <button
                onClick={() => handleFlip("/login")}
                className="bg-white text-[#C8102E] font-semibold px-6 py-2 rounded-lg hover:bg-[#FFD3D3] transition"
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </div>

      {/* FORGOT PASSWORD MODAL - Rendered at page level */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Forgot Password?</h2>
              <button
                onClick={closeForgotPasswordModal}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={28} />
              </button>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            {/* Form */}
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/20 transition"
                  required
                />
              </div>

              {/* Send Button */}
              <button
                type="submit"
                disabled={isSubmittingForgot}
                className="w-full bg-[#C8102E] text-white py-3 rounded-lg font-semibold hover:bg-[#a00e25] disabled:bg-gray-400 transition duration-200"
              >
                {isSubmittingForgot ? "Sending..." : "Send Reset Link"}
              </button>

              {/* Message */}
              {forgotMessage && (
                <p
                  className={`text-sm text-center font-medium ${
                    forgotMessage.includes("sent") ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {forgotMessage}
                </p>
              )}
            </form>

            {/* Cancel Button */}
            <button
              type="button"
              onClick={closeForgotPasswordModal}
              className="w-full mt-3 text-gray-700 font-medium py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
