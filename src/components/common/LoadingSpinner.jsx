const LoadingSpinner = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-40 backdrop-blur-md">
    <div className="flex flex-col items-center">
      {/* Spinner */}
      <div
        className="w-12 h-12 border-4 border-t-4 border-[#C8102E] border-t-transparent rounded-full animate-spin"
        aria-label="Loading"
      ></div>
      <p className="mt-4 text-lg font-semibold text-[#C8102E]">
        Logging in and redirecting...
      </p>
    </div>
  </div>
);

export default LoadingSpinner;
