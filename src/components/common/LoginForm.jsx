import { Mail, KeyRound, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import Button from "./Button";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useError } from "../../context/ErrorContext";
import { useGoogleInit } from "../../hooks/useGoogleInit";

export default function LoginForm({ onFlip, setIsLoading, onLoginSuccess, onForgotPasswordClick }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showMfaModal, setShowMfaModal] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [mfaError, setMfaError] = useState("");
  const [pendingLogin, setPendingLogin] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [codeSentMessage, setCodeSentMessage] = useState("");
  const navigate = useNavigate();
  const { showError } = useError();

  // ✅ Use the global Google initialization hook
  useGoogleInit();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // =========================================================
  //  GOOGLE LOGIN HANDLER (Callback function)
  // =========================================================
  const handleGoogleResponse = async (response) => {
    try {
      // NOTE: We don't need setIsLoading here because the prompt/button handles the initial UI block
      const { credential } = response; // Google's ID Token

      // Make sure this matches your backend's port and path!
      const res = await axios.post(
        window.API_BASE + "/auth/google/signup",
        { credential }
      );

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role_id", user.role_id);

      setMessage("Google login successful! Redirecting...");

      // 💡 Check role IDs and adjust navigation paths as necessary
      if (user.role_id === 3) { 
        navigate("/admin/dashboard");
      } else if (user.role_id === 1 || user.role_id === 2) {
        navigate("/homepage");
      }
    } catch (err) {
      showError(err.response?.data?.message || "Google login failed");
    }
  };

  // =========================================================
  // 🚀 RENDER GOOGLE BUTTON ONLY (No duplicate initialization)
  // =========================================================
  useGoogleInit('login-form', handleGoogleResponse);

  useEffect(() => {
    if (window.google && document.getElementById("googleSignInButton")) {
      google.accounts.id.renderButton(
        document.getElementById("googleSignInButton"), 
        { 
          theme: "outline", 
          size: "large", 
          type: "standard",
          width: "360"
        }
      );
    }
  }, []);

  const openMfaModal = (loginPayload) => {
    setPendingLogin(loginPayload);
    setMfaCode("");
    setMfaError("");
    setCodeSentMessage("");
    setShowMfaModal(true);
  };

  const sendMfaCode = async () => {
    if (!form.email.trim()) {
      setMfaError("Please enter your email address first.");
      return;
    }

    try {
      setIsSendingCode(true);
      setMfaError("");
      const res = await axios.post(window.API_BASE + "/api/auth/send-mfa-code", {
        email: form.email,
        firstname: form.firstname || "there",
      });
      setCodeSentMessage(res.data.msg || "A 6-digit MFA verification code has been sent to your email.");
    } catch (err) {
      setMfaError(err.response?.data?.msg || "Could not send the MFA verification code.");
    } finally {
      setIsSendingCode(false);
    }
  };

  // =========================================================
  // NORMAL LOGIN (Keep this logic)
  // =========================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const res = await axios.post(window.API_BASE + "/api/auth/login", form);
      const { token, user } = res.data;

      openMfaModal({ token, user });
      await sendMfaCode();
    } catch (err) {
      if (!err.response) {
        setMessage("Server unreachable. Check backend.");
      } else {
        setMessage(err.response.data?.msg || "Login failed. Check credentials.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleMfaSubmit = async () => {
    const normalizedCode = mfaCode.trim();

    if (!/^\d{6}$/.test(normalizedCode)) {
      setMfaError("Please enter the 6-digit code sent to your email.");
      return;
    }

    if (!pendingLogin) return;

    try {
      setIsSubmitting(true);
      setMfaError("");

      const res = await axios.post(window.API_BASE + "/api/auth/verify-mfa-code", {
        email: form.email,
        code: normalizedCode,
      });

      if (!res.data.valid) {
        setMfaError("The verification code is incorrect or has expired.");
        return;
      }

      const { token, user } = pendingLogin;
      localStorage.setItem("token", token);
      localStorage.setItem("role_id", user.role_id);

      setMessage("Login successful! Redirecting...");
      setShowMfaModal(false);

      if (user.role_id === 3) {
        navigate("/admin/dashboard");
      } else if (user.role_id === 1) {
        navigate("/homepage");
      } else if (user.role_id === 2) {
        navigate("/organizer/dashboard");
      }
    } catch (err) {
      setMfaError(err.response?.data?.msg || "The verification code is incorrect or has expired.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
      {/* ... (EMAIL & PASSWORD INPUTS) ... */}
      <div className="relative">
        <Mail className="absolute left-3 top-3 text-gray-500" size={20} />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          onChange={handleChange}
          className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300"
          required
        />
      </div>

      <div className="relative">
        <KeyRound className="absolute left-3 top-3 text-gray-500" size={20} />
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 transition"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {/* Forgot Password Link */}
      <div className="text-right">
        <button
          type="button"
          onClick={onForgotPasswordClick}
          className="text-sm text-[#C8102E] hover:underline font-semibold"
        >
          Forgot Password?
        </button>
      </div>

      {/* 💡 GOOGLE LOGIN BUTTON CONTAINER */}
      <div id="googleSignInButton" className="flex justify-center w-full mt-2">
        {/* The Google button will be rendered inside this div */}
      </div>

      {/* NORMAL LOGIN BUTTON */}
      <Button
        type="submit"
        label="Sign In"
        className="w-full bg-[#C8102E] text-white py-2 rounded-lg font-semibold hover:bg-[#a00e25]"
      />

      {message && <p className="text-sm text-center text-red-600">{message}</p>}

      {showMfaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-gray-800">Two-step verification</h3>
            <p className="mt-2 text-sm text-gray-600">
              We sent a 6-digit code to your email. Enter it below to complete your sign in.
            </p>

            <div className="my-4 rounded-xl border border-[#f0c4cd] bg-[#fff5f7] px-4 py-3 text-center text-sm font-medium text-[#a00e25]">
              Check your inbox and spam folder for the code.
            </div>

            <input
              type="text"
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter 6-digit code"
              maxLength={6}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 tracking-[0.35em] text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[#C8102E]"
            />

            {codeSentMessage && <p className="mt-2 text-sm text-green-600">{codeSentMessage}</p>}
            {mfaError && <p className="mt-2 text-sm text-red-600">{mfaError}</p>}

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setMfaError("");
                  sendMfaCode();
                }}
                disabled={isSendingCode}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-60"
              >
                {isSendingCode ? "Sending..." : "Resend Code"}
              </button>
              <button
                type="button"
                onClick={handleMfaSubmit}
                disabled={isSubmitting}
                className="rounded-lg bg-[#C8102E] px-3 py-2 text-sm font-semibold text-white hover:bg-[#a00e25] disabled:opacity-60"
              >
                {isSubmitting ? "Verifying..." : "Verify"}
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}