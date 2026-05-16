import Navbar from "../components/common/Navbar";
import LatestUpdates from "../components/common/LatestUpdates";

export default function EventPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="p-6">
        <section className="bg-gray-100 py-4 px-6 border-t border-[#d64553]">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                All Events
            </h2>
                <LatestUpdates />
        </section>
      </main>
    </div>
  );
}
