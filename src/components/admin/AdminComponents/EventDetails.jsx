import React from 'react';

export default function EventDetails ({formData, handleInputChange}) {
    return (
    <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-5 pb-3 border-b-2 border-gray-200">
            Event Details
        </h2>

        <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Event Date <span className="text-red-600">*</span>
                </label>
                <input
                type="date"
                value={formData.eventDate}
                onChange={(e) => handleInputChange('eventDate', e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-100" 
                />
            </div>
            
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Event Time <span className="text-red-600">*</span>
                </label>
                <input 
                type="time"
                value={formData.eventTime}
                onChange={(e) => handleInputChange('eventTime', e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-100"
                />
            </div>
        </div>
                                    
        <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location <span className="text-xs font-normal text-gray-500">(Optional)</span>
            </label>
            <input 
            type="text"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="e.g., University Gymnasium, Room 22, Online via Zoom"
            className="w-full px-4 py-2.5 border vorder-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-100"
            />
            <p className="text-xs text-gray-600 mt-1 leading-relaxed"> Specify the venue or provide online meeting details if applicable.</p>
        </div>

        <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                Event Link <span className="text-xs font-normal text-gray-500">(Optional)</span>
            </label>
            <input
            type="url"
            value={formData.eventLink}
            onChange={(e) => handleInputChange('eventLink', e.target.value)}
            placeholder="https://"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-100"
            />
            <p className="text-xs text-gray-600 mt-1 leading-relaxed"> Add registration forms, Zoom links, or related sources.</p>
        </div>
    </div>
    )
}