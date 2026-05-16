import logo from "../../assets/logo.jpg";

export default function AuthCard({ title, children }) {
  return (
    <div className="w-full max-w-md bg-[#FFD3D3]/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 text-center overflow-y-auto max-h-[90vh]">
      <div className="flex items-center justify-center gap-3 mb-4">
        <img
          src={logo}
          alt="Logo"
          className="w-12 h-12 rounded-full object-cover shadow-md"
        />
        <h1 className="text-2xl font-bold text-[#C8102E]">{title}</h1>
      </div>
      {children}
    </div>
  );
}

