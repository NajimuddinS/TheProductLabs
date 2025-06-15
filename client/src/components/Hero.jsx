import { MapPin, Navigation, Compass } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Spline from "@splinetool/react-spline";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section
      id="home"
      className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-20 min-h-screen overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute -right-1/4 top-0 w-full h-full scale-150">
          <Spline
            scene="https://prod.spline.design/Qad4hiva1dCZElG2/scene.splinecode"
            className="w-full h-full opacity-80"
          />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Navigate Your
              <span className="text-blue-400"> Journey</span>
              <br />
              with Precision
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Discover the power of advanced geolocation technology. Route Mate
              helps you find the perfect path, track your progress, and explore
              new destinations with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                onClick={() => navigate('/login')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate('/login')}
                className="bg-transparent border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white font-semibold text-lg py-3 px-8 rounded-lg transition-colors duration-200 backdrop-blur-sm"
              >
                Learn More
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-white mb-2">10+</div>
                <div className="text-gray-400">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">50+</div>
                <div className="text-gray-400">Countries</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">99.9%</div>
                <div className="text-gray-400">Accuracy</div>
              </div>
            </div>
          </div>

          <div className="relative z-20">
            <div className="absolute top-10 right-10 bg-blue-600/20 backdrop-blur-sm border border-blue-400/30 text-white rounded-lg p-4 shadow-lg">
              <div className="flex items-center mb-2">
                <MapPin className="h-5 w-5 text-blue-400 mr-2" />
                <span className="text-sm font-medium">Live Location</span>
              </div>
              <div className="text-xs text-gray-300">Tracking enabled</div>
            </div>

            <div className="absolute bottom-20 right-20 bg-blue-600/20 backdrop-blur-sm border border-blue-400/30 text-white rounded-lg p-4 shadow-lg">
              <div className="flex items-center mb-2">
                <Navigation className="h-5 w-5 text-blue-400 mr-2" />
                <span className="text-sm font-medium">Route Active</span>
              </div>
              <div className="text-xs text-green-400">ETA: 15 min</div>
            </div>

            <div className="absolute top-1/2 right-32 transform -translate-y-1/2 bg-blue-600/20 backdrop-blur-sm border border-blue-400/30 text-white rounded-full p-3 shadow-lg">
              <Compass className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
