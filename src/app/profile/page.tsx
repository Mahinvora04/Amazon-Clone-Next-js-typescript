'use client';

import 'flatpickr/dist/flatpickr.min.css';
import { useEffect, useState } from 'react';

import Loader from '@/components/Loader';

import useStore from '../store';

type User = {
  contact: string;
  address: string;
};

const Profile = () => {
  const { fetchedUser, fetchUserProfile, updateUserProfile } = useStore();
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({} as User);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const loadData = async () => {
          await fetchUserProfile();
          setEditedUser(fetchedUser);
          setIsLoading(false);
        };
        loadData();
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to fetch profile');
      }
    };

    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Effect to update state when fetchedUser changes
  useEffect(() => {
    if (fetchedUser) {
      setEditedUser(fetchedUser);
    }
  }, [fetchedUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await updateUserProfile(editedUser);
      setIsEditing(false);
      fetchUserProfile();
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  if (error) return <p className="text-red-500 text-center mt-6">{error}</p>;

  if (isLoading) return <Loader />;

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
        <div className="bg-white border border-gray-400 p-6 w-full max-w-md text-center">
          <div className="mt-4 text-left space-y-3">
            <div className="flex items-center">
              <span className="font-medium text-gray-700 w-32">Name</span>
              <input
                name="name"
                value={fetchedUser.name || ''}
                onChange={handleChange}
                disabled={true}
                className="w-full border rounded-lg p-3 text-gray-600 disabled:cursor-not-allowed disabled:border-0"
              />
            </div>

            <div className="flex items-center">
              <span className="font-medium text-gray-700 w-32">Email</span>
              <input
                name="email"
                value={fetchedUser.email || ''}
                onChange={handleChange}
                disabled={true}
                className="w-full border rounded-lg p-3 text-gray-600 disabled:cursor-not-allowed disabled:border-0"
              />
            </div>

            {/* Contact Field */}
            <div className="flex items-center">
              <span className="font-medium text-gray-700 w-32">
                Contact No.
              </span>
              <input
                name="contact"
                value={editedUser.contact || ''}
                onChange={handleChange}
                placeholder="Enter contact no."
                disabled={!isEditing}
                className="w-full border rounded-lg p-3 text-gray-600 focus:ring-2 focus:ring-cyan-400  disabled:cursor-not-allowed disabled:border-0"
              />
            </div>

            {/* Address Field */}
            <div className="flex items-center">
              <span className="font-medium text-gray-700 w-32">Address</span>
              <input
                name="address"
                value={editedUser.address || ''}
                onChange={handleChange}
                placeholder="Enter address"
                disabled={!isEditing}
                className="w-full border rounded-lg p-3 text-gray-600 focus:ring-2 focus:ring-cyan-400 disabled:cursor-not-allowed disabled:border-0"
              />
            </div>
          </div>

          <div className="mt-6">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-600 hover:cursor-pointer mr-2"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 hover:cursor-pointer ml-2"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 hover:cursor-pointer"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
