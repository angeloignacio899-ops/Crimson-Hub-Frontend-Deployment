import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, Eye, ChevronLeft, Search, ChevronDown } from 'lucide-react';

const getEventCategory = (event) => (event.category_name || event.category || '').trim();

const OrganizerRegistrationPage = () => {
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loadingAttendees, setLoadingAttendees] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [pdfError, setPdfError] = useState('');

  const token = localStorage.getItem('token');

  // Fetch organizer's events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(window.API_BASE + '/api/events/organizer', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, [token]);

  // Fetch attendees when an event is selected
  const handleSelectEvent = async (event) => {
    setSelectedEvent(event);
    setAttendees([]);
    setLoadingAttendees(true);
    try {
      const res = await axios.get(`${window.API_BASE}/api/events/attendees/${event.event_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAttendees(res.data);
    } catch (err) {
      console.error(err);
      setAttendees([]);
    } finally {
      setLoadingAttendees(false);
    }
  };

  const handleDownloadAttendees = async () => {
    if (!selectedEvent || attendees.length === 0) return;

    setGeneratingPdf(true);
    setPdfError('');
    try {
      const [{ jsPDF }, { default: autoTable }] = await Promise.all([
        import('jspdf'),
        import('jspdf-autotable'),
      ]);
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const eventTitle = selectedEvent.title || 'Event';
      const titleLines = doc.splitTextToSize(eventTitle, pageWidth - 32);
      const headerHeight = 24 + titleLines.length * 8;
      const eventDate = selectedEvent.start_date || selectedEvent.date;
      const parsedEventDate = eventDate ? new Date(eventDate) : null;
      const formattedEventDate = parsedEventDate && !Number.isNaN(parsedEventDate.getTime())
        ? parsedEventDate.toLocaleDateString(undefined, { timeZone: 'UTC' })
        : eventDate || 'Not specified';
      const generatedDate = new Date().toLocaleString();
      const filename = `${eventTitle.replace(/[<>:"/\\|?*]/g, '-').trim() || 'event'}-attendees.pdf`;

      doc.setFillColor(185, 28, 28);
      doc.rect(0, 0, pageWidth, headerHeight, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text(titleLines, 16, 16);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text('ATTENDEE LIST', 16, headerHeight - 7);

      doc.setTextColor(55, 65, 81);
      doc.setFontSize(10);
      doc.text(`Event date: ${formattedEventDate}`, 16, headerHeight + 12);
      doc.text(`Total attendees: ${attendees.length}`, 16, headerHeight + 20);
      doc.text(`Generated: ${generatedDate}`, 16, headerHeight + 28);

      autoTable(doc, {
        startY: headerHeight + 36,
        head: [['#', 'First name', 'Last name', 'Email']],
        body: attendees.map((attendee, index) => [
          String(index + 1),
          attendee.firstname || '-',
          attendee.lastname || '-',
          attendee.email || '-',
        ]),
        margin: { left: 16, right: 16, bottom: 20 },
        styles: {
          font: 'helvetica',
          fontSize: 9,
          cellPadding: 3,
          overflow: 'linebreak',
          textColor: [31, 41, 55],
          lineColor: [229, 231, 235],
          lineWidth: 0.2,
        },
        headStyles: {
          fillColor: [185, 28, 28],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
        },
        alternateRowStyles: { fillColor: [249, 250, 251] },
        columnStyles: {
          0: { cellWidth: 12, halign: 'center' },
          1: { cellWidth: 38 },
          2: { cellWidth: 38 },
          3: { cellWidth: 'auto' },
        },
      });

      const pageCount = doc.internal.getNumberOfPages();
      for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
        doc.setPage(pageNumber);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(107, 114, 128);
        doc.text('Crimson Event Hub - Attendee List', 16, doc.internal.pageSize.getHeight() - 8);
        doc.text(`Page ${pageNumber} of ${pageCount}`, pageWidth - 16, doc.internal.pageSize.getHeight() - 8, {
          align: 'right',
        });
      }

      doc.save(filename);
    } catch (error) {
      console.error('Failed to generate attendee PDF:', error);
      setPdfError('Unable to generate the attendee PDF. Please try again.');
    } finally {
      setGeneratingPdf(false);
    }
  };

  const categories = [...new Set(events.map(getEventCategory).filter(Boolean))]
    .sort((first, second) => first.localeCompare(second));
  const normalizedSearch = searchTerm.toLowerCase();
  const filteredEvents = events.filter((event) => {
    const category = getEventCategory(event);
    const matchesSearch = (event.title || '').toLowerCase().includes(normalizedSearch)
      || category.toLowerCase().includes(normalizedSearch);
    const matchesCategory = !categoryFilter
      || category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white shadow-md p-4 flex justify-between items-center rounded-b-2xl border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">
          {selectedEvent ? "Event Attendees" : "My Events"}
        </h1>
      </header>

      <main className="p-4 flex-1">
        {!selectedEvent && (
          <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative flex-grow max-w-md w-full">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
              <input
                type="text"
                placeholder="Search events or category..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div className="relative w-full md:w-56">
              <select
                aria-label="Filter events by category"
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-3 pr-10 text-sm font-medium text-gray-700 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              />
            </div>
          </div>
        )}

        {!selectedEvent ? (
          <div className="bg-white rounded-2xl shadow-md overflow-x-auto border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-red-600 text-white">
                <tr>
                  <th className="p-4 text-left">Title</th>
                  <th className="p-4 text-left hidden sm:table-cell">Category</th>
                  <th className="p-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loadingEvents ? (
                  <tr><td colSpan="3" className="p-8 text-center">Loading events...</td></tr>
                ) : filteredEvents.length === 0 ? (
                  <tr><td colSpan="3" className="p-8 text-center">No events found.</td></tr>
                ) : filteredEvents.map(event => (
                  <tr key={event.event_id} className="hover:bg-red-50 cursor-pointer" onClick={() => handleSelectEvent(event)}>
                    <td className="p-4">{event.title}</td>
                    <td className="p-4 hidden sm:table-cell">{getEventCategory(event) || '-'}</td>
                    <td className="p-4 text-center"><Eye size={18} className="text-gray-400 hover:text-red-600 mx-auto"/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>
            <button className="flex items-center text-red-600 font-semibold mb-6" onClick={() => setSelectedEvent(null)}>
              <ChevronLeft size={20} className="mr-2"/> Back
            </button>

            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">{selectedEvent.title} Attendees</h2>
                {!loadingAttendees && attendees.length > 0 && (
                  <p className="text-sm text-gray-500">{attendees.length} registered attendee{attendees.length === 1 ? '' : 's'}</p>
                )}
              </div>
              <button
                type="button"
                onClick={handleDownloadAttendees}
                disabled={loadingAttendees || generatingPdf || attendees.length === 0}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                <Download size={17} />
                {generatingPdf ? 'Preparing PDF...' : 'Download PDF'}
              </button>
            </div>
            {pdfError && <p role="alert" className="mb-4 text-sm text-red-600">{pdfError}</p>}
            {loadingAttendees ? (
              <p>Loading attendees...</p>
            ) : attendees.length === 0 ? (
              <p className="text-gray-500 italic">No attendees registered yet.</p>
            ) : (
              <table className="min-w-full divide-y divide-gray-200 bg-white rounded-2xl shadow-md overflow-x-auto border border-gray-200">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="p-4 text-left">First Name</th>
                    <th className="p-4 text-left">Last Name</th>
                    <th className="p-4 text-left">Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {attendees.map(att => (
                    <tr key={att.user_id} className="hover:bg-gray-50">
                      <td className="p-4">{att.firstname}</td>
                      <td className="p-4">{att.lastname}</td>
                      <td className="p-4 text-blue-600">{att.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default OrganizerRegistrationPage;
