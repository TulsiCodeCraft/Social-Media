import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-md relative z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link 
              to="/" 
              className="text-xl sm:text-2xl font-bold text-blue-800 hover:text-blue-600 transition-colors duration-200"
            >
              Social Media
            </Link>
          </motion.div>

          <div className="sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-blue-800 hover:text-blue-600 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden sm:block"
          >
            <Link
              to="/register"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Admin Register
            </Link>
          </motion.div>
        </div>

    
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: isMenuOpen ? 'auto' : 0,
            opacity: isMenuOpen ? 1 : 0
          }}
          transition={{ duration: 0.2 }}
          className="sm:hidden overflow-hidden"
        >
          {isMenuOpen && (
            <div className="py-4">
              <Link
                to="/register"
                className="block w-full text-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Register
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </header>
  );
}