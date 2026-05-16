import React from 'react';
import { Upload } from 'lucide-react';

export default function Attachment () {
    return (
    <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-5 pb-3 border-b-2 border-gray-200">Attachments</h2>
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload Files <span className="text-xs font-normal text-gray-500">(Optional)</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition">
                <input
                type="file"
                multiple
                accept=".pdf, .jpg, .png, .doc, .docx"
                className="hidden"
                id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer block">
                <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-between">
                    <Upload size={24} className="text-gray-500" />
                </div>
                <p className="text-sm text-gray-900 mb-1">
                    <strong className="text-red-600">Click to upload</strong> or drag and drop
                </p>
                <p className="text-xs text-gray-600"> PDF, JPG, PNG, DOC (Max 10MB per file)</p>
            </label>
        </div>
        <div>
            <p className="text-xs text-gray-600 mt-2 leading-relaxed"> You can attach posters, flyers, schedules, or other relevant documents. </p>
        </div>
    </div>

    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg mb-8">
        <div className="text-sm font-semibold text-red-600 mb-2 flex items-center gap-2">
            ℹ️ Please Note
        </div>
            <p className="text-xs text-gray-700 leading-relaxed">
                Your submission will be reviewed by an administrator before being published. You'll receive a notification once your submission is approved or if any changes are needed. You can track the status of your submission in your dashboard.
            </p>
        </div>
    </div>
    )
}