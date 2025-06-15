import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, MapPin } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="backdrop-blur-md shadow-md sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div onClick={() => navigate('/home')} className="flex items-center space-x-2 cursor-pointer">
            <MapPin className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
              RouteMate
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => navigate('/login')}
              className="ml-4 px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition"
            >
              Sign In
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden px-4 pt-4 pb-6 space-y-4 bg-white border-t border-gray-200 shadow-md">
          {["Home", "Services", "About", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="block text-gray-700 font-medium hover:text-blue-600 transition"
            >
              {item}
            </a>
          ))}
          <button
            onClick={() => navigate('/login')}
            className="w-full px-5 py-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition"
          >
            Sign In
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
