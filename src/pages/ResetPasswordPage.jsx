import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { KeyRound, Eye, EyeOff } from "lucide-react";
import axios from "axios";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Verify token is present
    if (!token) {
      setMessage("Invalid or expired reset link");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Validation
    if (!password || !confirmPassword) {
      setMessage("Both password fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(
        window.API_BASE + "/api/auth/reset-password",
        { token, password }
      );

      setMessage("✅ Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setMessage(
        err.response?.data?.msg || "Failed to reset password. Try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#C8102E] to-[#a00e25] relative overflow-hidden">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-center bg-cover opacity-20"
        style={{ backgroundImage: "url('/bg-logo.png')" }}
      ></div>

      {/* Reset Password Card */}
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 relative z-10">
        <h2 className="text-3xl font-bold text-[#C8102E] mb-2 text-center">
          Reset Password
        </h2>
        <p className="text-gray-600 text-sm text-center mb-6">
          Enter your new password below
        </p>

        {!token ? (
          <div className="text-center">
            <p className="text-red-600 font-semibold mb-4">{message}</p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-[#C8102E] text-white py-2 rounded-lg font-semibold hover:bg-[#a00e25]"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password */}
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 text-gray-500" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#C8102E]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 text-gray-500" size={20} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#C8102E]"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#C8102E] text-white py-2 rounded-lg font-semibold hover:bg-[#a00e25] disabled:bg-gray-400 transition mt-6"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>

            {message && (
              <p
                className={`text-sm text-center ${
                  message.includes("✅") ? "text-green-600" : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
