import Navbar from "../components/common/Navbar";
import Button from "../components/common/Button";
import { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useError } from "../context/ErrorContext";
import SuccessModal from "../components/common/SuccessModal";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { showError } = useError();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    birthday: "",
    gender: "",
    email: "",
    student_id: "",
    department: "",
    year_level: "",
    course: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get(window.API_BASE + "/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFormData({
          ...formData,
          firstname: res.data.firstname,
          lastname: res.data.lastname,
          birthday: res.data.birthday?.split("T")[0] || "",
          gender: res.data.gender || "Male",
          email: res.data.email,
          student_id: res.data.student_id,
          department: res.data.department,
          year_level: res.data.year_level || "1st Year",
          course: res.data.course,
          phone: res.data.phone,
        });

        if (res.data.profile_image) {
          setPreviewImage(`${window.API_BASE}${res.data.profile_image}`);
        }
      } catch (err) {
        showError("Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      showError("New password and confirm password do not match!");
      return;
    }

    setIsSaving(true);

    try {
      const token = localStorage.getItem("token");
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key]) data.append(key, formData[key]);
      });

      if (profileImage) data.append("profileImage", profileImage);

      const res = await axios.put(window.API_BASE + "/api/user/profile", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setShowSuccess(true);

      // Navigate after success modal closes
      setTimeout(() => {
        const role_id = Number(localStorage.getItem("role_id"));
        if (role_id === 1) {
          navigate("/user/profile");
        } else if (role_id === 2) {
          navigate("/organizer/profile");
        }
      }, 2000);

    } catch (err) {
      showError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-3xl mx-auto mt-10 bg-white shadow-md rounded-xl border border-gray-200 p-10 mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Edit Profile
          </h2>

          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <img
                src={previewImage || "https://via.placeholder.com/150?text=Profile"}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-gray-300 shadow-sm"
              />
              <label
                htmlFor="profile-upload"
                className="absolute bottom-0 right-0 bg-red-700 hover:bg-red-800 text-white p-2 rounded-full cursor-pointer transition"
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
            <p className="mt-3 text-sm text-gray-500">
              Click the camera icon to change your photo
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="First Name" name="firstname" value={formData.firstname} onChange={handleChange} />
              <InputField label="Last Name" name="lastname" value={formData.lastname} onChange={handleChange} />

              <InputField type="date" label="Birthday" name="birthday" value={formData.birthday} onChange={handleChange} />

              <SelectField label="Gender" name="gender" value={formData.gender} onChange={handleChange} options={["Male", "Female", "Other"]} />

              <InputField type="email" label="Email Address" name="email" value={formData.email} onChange={handleChange} />
              <InputField label="Student ID" name="student_id" value={formData.student_id} onChange={handleChange} />
              <InputField label="Department" name="department" value={formData.department} onChange={handleChange} />

              <SelectField label="Year Level" name="year_level" value={formData.year_level} onChange={handleChange}
                options={["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "6th Year"]}
              />

              <InputField label="Course" name="course" value={formData.course} onChange={handleChange} />
              <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
            </div>

            <div className="border-t mt-8 pt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Change Password</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField type="password" label="Current Password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} />
                <InputField type="password" label="New Password" name="newPassword" value={formData.newPassword} onChange={handleChange} />
                <InputField type="password" label="Confirm New Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-8">
              <Button
                label="Cancel"
                type="button"
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-md font-medium transition"
                onClick={() => navigate(-1)}
                disabled={isSaving}
              />
              <Button
                label={isSaving ? "Saving..." : "Save Changes"}
                type="submit"
                className={`px-5 py-2 rounded-md font-medium transition ${
                  isSaving
                    ? "bg-gray-400 cursor-not-allowed text-gray-600"
                    : "bg-red-700 hover:bg-red-800 text-white"
                }`}
                disabled={isSaving}
              />
            </div>
          </form>
        </div>
      </main>

      <SuccessModal
        isOpen={showSuccess}
        title="Profile Updated"
        message="Your profile has been updated successfully. Redirecting..."
        actionText="OK"
        autoCloseMs={2000}
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
}

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

function SelectField({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-600 outline-none"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}
