import React from 'react';

const StaffSubjects: React.FC = () => {
  return (
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Subjects</h1>
            <p className="text-gray-600">Manage subjects and curriculum</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Subject Management</h2>
            <p className="text-gray-600">
              This section will contain subject management functionality including:
            </p>
            <ul className="mt-4 space-y-2 text-gray-600">
              <li>• View all subjects</li>
              <li>• Add new subjects</li>
              <li>• Edit subject details</li>
              <li>• Assign subjects to teachers</li>
              <li>• Manage subject curricula</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffSubjects;
