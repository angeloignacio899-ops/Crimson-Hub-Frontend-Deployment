import { File, Download } from "lucide-react";

const AttachmentFile = ({ event }) => {
  // Normalize files
  const files = event?.attachments?.length
    ? event.attachments
    : event?.file_name
    ? [{ file_name: event.file_name, file_path: event.file_path, file_size: event.file_size }]
    : [];

  const formatSize = (size) => {
    if (!size) return "Unknown size";
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Convert Windows path to URL-friendly path for server
  const getFileURL = (path) => {
    if (!path) return "#";
    // Assuming your backend serves files at http://localhost:5000/uploads/events/
    const fileName = path.split("\\").pop(); // get the file name
    return `${window.API_BASE}/uploads/events/${fileName}`;
  };

  return (
    <div className="bg-white w-full p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Attachments and Resources
      </h2>

      {files.length === 0 ? (
        <p className="text-gray-500 text-sm">No files uploaded.</p>
      ) : (
        <div className="space-y-3">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-100 rounded-md gap-4 cursor-pointer hover:bg-gray-200 transition"
              onClick={() => window.open(getFileURL(file.file_path), "_blank")}
            >
              <div className="flex items-center flex-1 min-w-0">
                <div className="bg-red-600 p-2 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <File size={16} className="text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-gray-800 font-medium truncate">{file.file_name}</p>
                  <p className="text-gray-500 text-sm">{formatSize(file.file_size)}</p>
                </div>
              </div>

              <a
                href={getFileURL(file.file_path)}
                download={file.file_name}
                onClick={(e) => e.stopPropagation()}
                className="bg-red-500 hover:bg-red-600 w-9 h-9 flex items-center justify-center rounded-full transition"
              >
                <Download size={18} className="text-white" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttachmentFile;
