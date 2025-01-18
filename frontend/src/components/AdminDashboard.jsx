import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import Header from './Header';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchSubmissions();
  }, [navigate]);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/submissions`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
      } else {
        toast.error('Failed to fetch submissions');
      }
    } catch (error) {
      toast.error('Error fetching submissions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white rounded-xl shadow-md p-6"
        >
          <h1 className="text-3xl font-bold text-blue-800 mb-4 sm:mb-0">Admin Dashboard</h1>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-all duration-200 transform hover:-translate-y-0.5"
          >
            Logout
          </motion.button>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {submissions.map((submission) => (
              <motion.div
                key={submission._id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-blue-800">{submission.name}</h3>
                  <p className="text-blue-600 mt-1">{submission.socialHandle}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 p-6 pt-0">
                  {submission.images.map((image, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      className="relative cursor-pointer rounded-lg overflow-hidden shadow-md"
                      onClick={() => setSelectedImage(`${API_BASE_URL}/${image}`)}
                    >
                      <img
                        src={`${API_BASE_URL}/${image}`}
                        alt={`Uploaded by ${submission.name}`}
                        className="w-full h-32 object-cover transition-transform duration-300 hover:scale-110"
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl w-full">
              <motion.img
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                src={selectedImage}
                alt="Full size"
                className="w-full h-auto rounded-lg shadow-2xl"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(null);
                }}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
              >
                <X size={24} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

