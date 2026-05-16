import { Link, useLocation } from "react-router-dom";

const NavLink = ({ icon: Icon, label, to }) => {
  const { pathname } = useLocation();
  const isActive = pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center w-full p-4 my-1 rounded-lg transition-colors duration-200 ${
        isActive
          ? "bg-white text-red-700 shadow-md font-semibold"
          : "text-red-100 hover:bg-red-600/50"
      }`}
    >
      <Icon size={20} className="mr-3" />
      <span className="text-sm">{label}</span>
    </Link>
  );
};

export default NavLink;
