export default function Header ({ submissionType }) {
    return (
        <div className="bg-white w-full p-6 rounded-lg shadow-sm border border-gray-200 gap-3 pb-8 mb-8">
            <span className="bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-md uppercase">
                {submissionType}
            </span>
            <h1 className="text-3xl font-bold mt-3 text-gray-900"> Submit Event or Announcement </h1>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Fill out the form below to submit your event or announcement for admin approval. All required fields must be completed.
            </p>
        </div>
    )
}