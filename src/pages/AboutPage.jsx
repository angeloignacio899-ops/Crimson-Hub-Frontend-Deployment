import Navbar from "../components/common/Navbar";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-12 text-gray-800">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#d64553] mb-2">About Crimson Events Hub</h1>
          <p className="text-gray-600 text-sm">
            Empowering communication and collaboration at WMSU through centralized event management.
          </p>
        </div>

        <section className="bg-white p-8 rounded-2xl shadow-sm mb-8">
          <h2 className="text-2xl text-center font-semibold mb-3">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            Crimson Events Hub is designed to streamline event announcements, registrations,
            and updates within Western Mindanao State University. Our mission is to improve
            communication efficiency by creating a unified platform for students, faculty,
            and administrators to discover, organize, and manage events.
          </p>
        </section>

        <section className="bg-white p-8 rounded-2xl shadow-sm mb-8">
          <h2 className="text-2xl text-center font-semibold mb-3">What We Offer</h2>
          <ul className="list-disc pl-6 text-gray-700 leading-relaxed">
            <li>Centralized platform for event and announcement posting.</li>
            <li>Approval-based system to ensure verified content visibility.</li>
            <li>Personalized notifications for registered users.</li>
            <li>Easy event registration and calendar synchronization.</li>
            <li>Admin dashboard for content moderation and analytics.</li>
          </ul>
        </section>

        <section className="bg-white p-8 rounded-2xl shadow-sm">
          <h2 className="text-2xl text-center font-semibold mb-3">Meet the Team</h2>
          <p className="text-gray-700 mb-6">
            Crimson Events Hub was developed by a passionate group of students from the College of Computing Studies,
            with the goal of enhancing digital communication and event management across the university.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Zander Remiliete", role: "Frontend Developer" },
              { name: "Rod Angelo Ignacio", role: "Backend Developer" },
              { name: "Steffi Madrazo", role: "UI/UX Designer" },
              { name: "Ira Sermiento", role: "Assistant Developer" },
            ].map((member, i) => (
              <div
                key={i}
                className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center hover:shadow-md transition"
              >
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3"></div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
