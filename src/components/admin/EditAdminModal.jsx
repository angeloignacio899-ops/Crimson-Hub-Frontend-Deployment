import { useState, useEffect } from "react";
import { X, Camera } from "lucide-react";
import axios from "axios";
import { useError } from "../../context/ErrorContext";

export default function EditAdminModal({ isOpen, onClose, user, setUser }) {
  const { showError } = useError();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // ✅ Load current user data when modal opens
  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || "",
        phone: user.phone || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      if (user.profile_image) {
        setPreviewImage(`${window.API_BASE}${user.profile_image}`);
      } else {
        setPreviewImage(null);
      }
    }
  }, [isOpen]); // ⚠️ Don't depend on "user" to avoid reset after saving

  // ✅ Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle profile image preview and file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // ✅ Save changes
    const handleSave = async (e) => {
    e.preventDefault();

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        alert("New password and confirm password do not match!");
        return;
    }

    try {
        const token = localStorage.getItem("token");
        const data = new FormData();

        Object.keys(formData).forEach((key) => {
        if (formData[key]) data.append(key, formData[key]);
        });

        if (profileImage) data.append("profileImage", profileImage);

        // Update profile
        await axios.put(window.API_BASE + "/api/user/profile", data, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
        });

        // ✅ Re-fetch user data for sidebar
        const userRes = await axios.get(window.API_BASE + "/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
        });

        setUser(userRes.data);
        onClose();
        showError("Profile updated successfully!", 3000);
    } catch (err) {
        const message = err.response?.data?.message || "Failed to update profile.";
        showError(message);
    }
    };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-gray-800">Edit Profile</h2>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Image Upload */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <img
                src={previewImage || "https://via.placeholder.com/100?text=Avatar"}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 shadow-sm"
              />
              <label
                htmlFor="profile-upload"
                className="absolute bottom-0 right-0 bg-red-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-red-700 transition"
              >
                <Camera size={16} />
              </label>
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>

          {/* Editable Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="First Name" name="firstname" value={formData.firstname} onChange={handleChange} />
            <InputField label="Last Name" name="lastname" value={formData.lastname} onChange={handleChange} />
          </div>

          <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} />
          <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />


          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ✅ Reusable input field component
function InputField({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-600 outline-none"
      />
    </div>
  );
}
