import Navbar from "../components/common/Navbar";
import LatestUpdates from "../components/common/LatestUpdates";
import Dashboard from "../components/common/Dashboard";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  const handleEvents = (e) => {
    e.preventDefault();
    navigate("/events");
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar showSearchbar={false}/>
      <main className="p-6">
        <section className="bg-gray-100 py-4 px-6 border-t border-[#d64553]">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            Latest Updates
          </h2>
        </section>
        <LatestUpdates />
        <div className="flex justify-center mt-8">
          <button
            onClick={handleEvents}
            className="bg-red-700 hover:bg-red-800 text-white font-medium px-6 py-2 rounded-lg shadow-sm transition"
          >
            View All Events
          </button>
        </div>
        <Dashboard className="mb-10"/>
      </main>
    </div>
  );
}
