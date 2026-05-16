const OrganizerSection = ({ event }) => {
  const organizerName = event?.organizer_name || "Organizer";

  // Get the first letter for avatar
  const avatarLetter = organizerName.charAt(0).toUpperCase();

  return (
    <div className="bg-white w-full p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Organized By
      </h2>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center p-4 bg-gray-100 rounded-lg text-center sm:text-left">
          <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mx-auto sm:mx-0 sm:mr-4 mb-3 sm:mb-0">
            <span className="text-white text-xl font-bold">{avatarLetter}</span>
          </div>

          <div>
            <p className="text-gray-800 font-medium text-base">{organizerName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerSection;
