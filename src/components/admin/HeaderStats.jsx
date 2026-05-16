// HeaderStats.jsx

import React from 'react';
import { User } from 'lucide-react';

const HeaderStats = ({ title, value, icon: Icon, color }) => {
    return (
        <div className={`flex items-center justify-between p-4 rounded-xl shadow-md ${color}`}>
            <div>
                <p className="text-sm font-medium opacity-80">{title}</p>
                <p className="text-3xl font-bold mt-1">{value}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-full">
                <Icon size={24} className="opacity-80" />
            </div>
        </div>
    );
};

export default HeaderStats;