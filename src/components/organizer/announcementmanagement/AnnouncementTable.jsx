import React, { useState } from "react";
import AnnouncementTableRow from "./AnnouncementTableRow";

const AnnouncementTable = ({ announcements = [], onView }) => {

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-red-600 text-white">
          <tr>
            <th className="p-4 text-left text-sm font-bold">Announcement Title</th>
            <th className="p-4 text-left text-sm font-bold">Category</th>
            <th className="p-4 text-left text-sm font-bold">Author</th>
            <th className="p-4 text-left text-sm font-bold hidden sm:table-cell">Created At</th>
            <th className="p-4 text-left text-sm font-bold">Status</th>
            <th className="p-4 text-center text-sm font-bold">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {announcements.length > 0 ? 
            announcements.map((announcement) => (
            <AnnouncementTableRow 
              key={announcement.id} 
              announcement={announcement} 
              onView={onView} 
            />
          )) : (
            <tr>
              <td colSpan="6" className="p-4 text-center text-gray-500">
                No announcements available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AnnouncementTable;
