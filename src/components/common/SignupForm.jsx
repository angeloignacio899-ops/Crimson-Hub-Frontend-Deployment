import { UserRound, Mail, KeyRound, Phone, Building, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import Button from "./Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useError } from "../../context/ErrorContext";
import { useGoogleInit } from "../../hooks/useGoogleInit";

export default function SignupForm({ onFlip }) {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    department: "",
    phone: "",
    password: "",
    role_id: "1", // default Student
  });

  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [enteredVerificationCode, setEnteredVerificationCode] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [codeSentMessage, setCodeSentMessage] = useState("");
  const navigate = useNavigate();
  const { showError } = useError();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // =========================================================
  // 🔥 GOOGLE SIGNUP HANDLER (Callback function)
  // =========================================================
  const handleGoogleResponse = async (response) => {
    try {
      const { credential } = response; // Google's ID Token

      // Make sure this matches your backend's port and path!
      const res = await axios.post(
        window.API_BASE + "/auth/google/signup",
        { credential }
      );

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role_id", user.role_id);

      setMessage("Google signup successful! Redirecting...");

      // 💡 Check role IDs and adjust navigation paths as necessary
      if (user.role_id === 3) { 
        navigate("/admin/dashboard");
      } else if (user.role_id === 1) {
        navigate("/homepage");
      } else if (user.role_id === 2) {
        navigate("/homepage"); // Or organizer dashboard if needed
      }
    } catch (err) {
      showError(err.response?.data?.message || "Google signup failed");
    }
  };

  // =========================================================
  // 🚀 RENDER GOOGLE BUTTON ONLY (No duplicate initialization)
  // =========================================================
  useGoogleInit('signup-form', handleGoogleResponse);

  useEffect(() => {
    if (window.google && document.getElementById("googleSignUpButton")) {
      google.accounts.id.renderButton(
        document.getElementById("googleSignUpButton"), 
        { 
          theme: "outline", 
          size: "large", 
          type: "standard",
          width: "360"
        }
      );
    }
  }, []);

  const openVerificationModal = () => {
    setEnteredVerificationCode("");
    setVerificationError("");
    setCodeSentMessage("");
    setShowVerificationModal(true);
  };

  const sendVerificationCode = async () => {
    if (!form.email.trim()) {
      setVerificationError("Please enter your email address first.");
      return;
    }

    try {
      setIsSendingCode(true);
      setVerificationError("");
      const res = await axios.post(window.API_BASE + "/api/auth/send-verification-code", {
        email: form.email,
        firstname: form.firstname,
      });
      setCodeSentMessage(res.data.msg || "A 6-digit verification code has been sent to your email.");
    } catch (err) {
      setVerificationError(err.response?.data?.msg || "Could not send the verification code.");
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.firstname.trim() || !form.lastname.trim() || !form.email.trim() || !form.department.trim() || !form.phone.trim() || !form.password.trim()) {
      setMessage("Please fill in all fields before continuing.");
      return;
    }

    setMessage("");
    openVerificationModal();
    sendVerificationCode();
  };

  const handleVerifyAndSubmit = async () => {
    const normalizedCode = enteredVerificationCode.trim().toUpperCase();

    if (!/^\d{6}$/.test(normalizedCode)) {
      setVerificationError("Please enter the 6-digit code sent to your email.");
      return;
    }

    try {
      setIsSubmitting(true);
      setVerificationError("");
      const res = await axios.post(window.API_BASE + "/api/auth/signup", {
        ...form,
        verification_code: normalizedCode,
      });
      setShowVerificationModal(false);
      setMessage(res.data.msg);
    } catch (err) {
      setShowVerificationModal(false);
      setMessage(err.response?.data?.msg || "Signup failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Account Type Radio */}
      <div className="flex items-center gap-6 mb-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="role_id"
            value="1"
            checked={form.role_id === "1"}
            onChange={handleChange}
          />
          Student
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="role_id"
            value="2"
            checked={form.role_id === "2"}
            onChange={handleChange}
          />
          Organizer
        </label>
      </div>

      {/* Organizer approval note */}
      {form.role_id === "2" && (
        <p className="text-sm text-yellow-700 bg-yellow-100 border border-yellow-300 p-2 rounded">
          Organizer accounts require admin approval — you’ll get an email when approved.
        </p>
      )}

      {/* Form inputs */}
      <div className="grid grid-cols-2 gap-4">

        {/* First Name */}
        <div className="relative">
          <UserRound className="absolute left-3 top-3 text-gray-500" size={20} />
          <input
            type="text"
            name="firstname"
            placeholder="First Name"
            value={form.firstname}
            onChange={handleChange}
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300
                       focus:outline-none focus:ring-2 focus:ring-[#C8102E]"
          />
        </div>

        {/* Last Name */}
        <div className="relative">
          <UserRound className="absolute left-3 top-3 text-gray-500" size={20} />
          <input
            type="text"
            name="lastname"
            placeholder="Last Name"
            value={form.lastname}
            onChange={handleChange}
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300
                       focus:outline-none focus:ring-2 focus:ring-[#C8102E]"
          />
        </div>

        {/* Email */}
        <div className="relative col-span-2">
          <Mail className="absolute left-3 top-3 text-gray-500" size={20} />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300
                       focus:outline-none focus:ring-2 focus:ring-[#C8102E]"
          />
        </div>

        {/* Department / Organization */}
        <div className="relative col-span-2">
          <Building className="absolute left-3 top-3 text-gray-500" size={20} />
          <input
            type="text"
            name="department"
            placeholder={form.role_id === "1" ? "Department" : "Organization Name"}
            value={form.department}
            onChange={handleChange}
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300
                       focus:outline-none focus:ring-2 focus:ring-[#C8102E]"
          />
        </div>

        {/* Phone */}
        <div className="relative col-span-2">
          <Phone className="absolute left-3 top-3 text-gray-500" size={20} />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300
                       focus:outline-none focus:ring-2 focus:ring-[#C8102E]"
          />
        </div>

        {/* Password */}
        <div className="relative col-span-2">
          <KeyRound className="absolute left-3 top-3 text-gray-500" size={20} />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300
                       focus:outline-none focus:ring-2 focus:ring-[#C8102E]"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 transition"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {/* 💡 GOOGLE SIGNUP BUTTON CONTAINER */}
      <div id="googleSignUpButton" className="flex justify-center w-full mt-2">
        {/* The Google button will be rendered inside this div */}
      </div>

      {/* Submit */}
      <Button
        label="Sign Up"
        type="submit"
        className="w-full bg-[#C8102E] text-white py-2 rounded-lg font-semibold hover:bg-[#a00e25] transition"
      />

      {message && <p className="text-sm text-gray-700 text-center">{message}</p>}

      {showVerificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="text-[#C8102E]" size={22} />
              <h3 className="text-xl font-semibold text-gray-800">Verify your email</h3>
            </div>

            <p className="text-sm text-gray-600">
              We sent a 6-digit verification code to <span className="font-medium text-gray-800">{form.email || "your email"}</span>.
              Enter it below to finish creating your account.
            </p>

            <div className="my-4 rounded-xl border border-[#f0c4cd] bg-[#fff5f7] px-4 py-3 text-center text-sm font-medium text-[#a00e25]">
              Check your inbox and spam folder for the code.
            </div>

            <input
              type="text"
              value={enteredVerificationCode}
              onChange={(e) => setEnteredVerificationCode(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter 6-digit code"
              maxLength={6}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 tracking-[0.35em] text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[#C8102E]"
            />

            {codeSentMessage && <p className="mt-2 text-sm text-green-600">{codeSentMessage}</p>}
            {verificationError && <p className="mt-2 text-sm text-red-600">{verificationError}</p>}

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setVerificationError("");
                  sendVerificationCode();
                }}
                disabled={isSendingCode}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-60"
              >
                {isSendingCode ? "Sending..." : "Resend Code"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowVerificationModal(false);
                  setVerificationError("");
                }}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleVerifyAndSubmit}
                disabled={isSubmitting}
                className="rounded-lg bg-[#C8102E] px-3 py-2 text-sm font-semibold text-white hover:bg-[#a00e25] disabled:opacity-60"
              >
                {isSubmitting ? "Verifying..." : "Verify & Sign Up"}
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
