import React from 'react';

export default function TargetAudience ({formData, handleAudienceToggle }) {
    return (
    <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-5 pb-3 border-b-2 border-gray-200">Target Audience</h2>
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Who should see this? <span className="text-red-600">*</span>
                </label>
                <div className="space-y-3">
                    {[
                        { value: 'all', label: 'School-wide (All students and faculty'},
                        { value: 'ccs', label: 'CCS Department'},
                        { value: 'cla', label: 'CLA Department'},
                        { value: '1st-year', label: '1st Year Students'},
                        { value: '2nd-year', label: '2nd Year Students'},
                        { value: '3rd-year', label: '3rd Year Students'},
                        { value: '4th-year', label: '4th Year Students'}  
                    ].map((audience) => (
                    <label key={audience.value} className="flex items-center gap-3 cursor-pointer">
                    <input
                    type="checkbox"
                    checked={formData.targetAudience.includes(audience.value)}
                    onChange={() => handleAudienceToggle(audience.value)}
                    className="w-5 h-5 cursor-pointer accent-red-600"
                    />
                    <span className="text-sm font-normal text-gray-700"> {audience.label} </span>
                    </label>
                ))}
            </div>
        </div>
    </div>
    )
}