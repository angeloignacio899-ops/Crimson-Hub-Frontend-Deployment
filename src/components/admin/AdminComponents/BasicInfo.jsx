import React from 'react';

export default function BasicInfo({submissionType, setSubmissionType, formData, handleInputChange}) {
    return (
    
    <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-5 pb-3 border-b-2 border-gray-200">
            Basic Information
        </h2>

        <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
                Submission Type <span className="text-red-600">*</span>
            </label>
            
            <div className="flex gap-6">
                {['event', 'announcement'].map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <input
                        type="radio"
                        name="submissionType"
                        value={type}
                        checked={submissionType === type}
                        onChange={(e) => setSubmissionType(e.target.value)}
                        className="w-4 h-4 cursor-pointer accent-red-600" 
                        />
                        <span className="text-sm font-normal text-gray-700 capitalize">
                            {type}
                        </span>
                     </label>
                    ))}
                </div>
            </div>
                                
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title <span className="text-red-600">*</span>
                </label>
                <input
                type="text" value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value )}
                placeholder="Enter event or announcement title"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:border-red-600 focus-ring-1 focus:ring-red-100"
                />
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Choose a clear and descriptive title that summarize your event or announcement.
                </p>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description <span className="text-red-600">*</span>
                </label>
                <textarea 
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Provide a detailed description..."
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-normal resize-vertical min-h-32 leading-relaxed focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-100"
                />
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Include all relevant details such as purpose, agenda, speakers, or important information.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Category <span className="text-red-600">*</span>
                    </label>
                    <select value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-normal cursor-pointer focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-100"
                    >
                        <option value="">Select a category</option>
                        <option value="Academic">Academic</option>
                        <option value="Organization">Organization</option>
                        <option value="Non-academic">Non-academic</option>
                        <option value="Council">Council Events</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Organizer <span className="text-red-600">*</span>
                    </label>
                    <input
                    type="text"
                    value={formData.organizer}
                    onChange={(e) => handleInputChange('organizer', e.target.value)}
                    placeholder="e.g., CCS Student Council"
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-100"
                    />
                </div>
            </div>
        </div>
    )
}