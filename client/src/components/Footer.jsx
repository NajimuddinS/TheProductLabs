import { MapPin, Mail, Phone, Twitter, Facebook, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center mb-4">
              <MapPin className="h-8 w-8 text-primary-400" />
              <span className="ml-2 text-2xl font-bold">Route Mate</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
              Leading the way in advanced geolocation technology. We help millions of users navigate their world with precision, safety, and confidence.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Github className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-300 hover:text-primary-400 transition-colors">Home</a></li>
              <li><a href="#services" className="text-gray-300 hover:text-primary-400 transition-colors">Services</a></li>
              <li><a href="#about" className="text-gray-300 hover:text-primary-400 transition-colors">About Us</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-primary-400 transition-colors">Contact</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">Pricing</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">API Documentation</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-primary-400 mr-3" />
                <span className="text-gray-300">info@routemate.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-primary-400 mr-3" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-primary-400 mr-3 mt-1" />
                <span className="text-gray-300">
                  123 Navigation St,<br />
                  Tech City, TC 12345
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} Route Mate. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;