// D:\WMS\frontend\src\pages\DashboardOverview.jsx
import React from 'react';

const DashboardOverview = () => {
  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-xl rounded-xl p-6">
      <h2 className="text-3xl font-semibold text-slate-800 dark:text-slate-100 mb-6 border-b pb-3 border-slate-300 dark:border-slate-700">
        Dashboard Overview
      </h2>
      <p className="text-slate-600 dark:text-slate-300">
        Welcome to your WMS dashboard overview. More content will be here soon!
      </p>
      {/* Add charts, stats, quick links etc. here */}
    </div>
  );
};

export default DashboardOverview;