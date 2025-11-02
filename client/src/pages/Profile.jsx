import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FiUser, FiMail, FiPhone } from 'react-icons/fi';

const Profile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
              <FiUser className="text-primary" size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="flex items-center gap-3 text-gray-900">
                <FiUser className="text-gray-400" />
                {user?.name}
              </div>
            </div>

            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="flex items-center gap-3 text-gray-900">
                <FiMail className="text-gray-400" />
                {user?.email}
              </div>
            </div>

            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <div className="flex items-center gap-3 text-gray-900">
                <FiPhone className="text-gray-400" />
                {user?.phone}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;