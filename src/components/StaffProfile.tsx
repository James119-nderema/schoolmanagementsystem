import React, { useState, useEffect } from 'react';

interface StaffInfo {
  id: string;
  email: string;
  full_name: string;
  school_id: number;
  school_name: string;
  phone_number: string;
}

const StaffProfile: React.FC = () => {
  const [staffInfo, setStaffInfo] = useState<StaffInfo | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const info = localStorage.getItem('staff_info');
    if (info) {
      try {
        setStaffInfo(JSON.parse(info));
      } catch (error) {
        console.error('Error parsing staff info:', error);
      }
    }
  }, []);

  if (!staffInfo) {
    return (
      <div className="flex-1 bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600">Manage your account information</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 transition-colors"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={staffInfo.full_name}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{staffInfo.full_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  <p className="mt-1 text-sm text-gray-900">{staffInfo.email}</p>
                  <p className="text-xs text-gray-500">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      defaultValue={staffInfo.phone_number}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{staffInfo.phone_number}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">School</label>
                  <p className="mt-1 text-sm text-gray-900">{staffInfo.school_name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Staff ID</label>
                  <p className="mt-1 text-sm text-gray-900 font-mono">{staffInfo.id}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">School ID</label>
                  <p className="mt-1 text-sm text-gray-900">{staffInfo.school_id}</p>
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Here you would implement the save functionality
                      setIsEditing(false);
                    }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Security Section */}
          <div className="mt-6 bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Security</h2>
              <div className="space-y-4">
                <div>
                  <button className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">
                    Change Password
                  </button>
                  <p className="text-xs text-gray-500 mt-1">Update your account password</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffProfile;
