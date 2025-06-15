import { MapPin, Compass, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: MapPin,
      title: 'Precise Location Tracking',
      description: 'Get accurate real-time location data with our advanced GPS technology and multi-satellite positioning system.',
      features: ['Sub-meter accuracy', 'Real-time updates', 'Indoor positioning']
    },
    {
      icon: Compass,
      title: 'Navigation Assistance',
      description: 'Turn-by-turn navigation with voice guidance and visual cues to help you reach your destination safely.',
      features: ['Voice navigation', 'Lane guidance', 'Speed alerts']
    },
    {
      icon: Shield,
      title: 'Privacy Protection',
      description: 'Your location data is encrypted and protected with enterprise-grade security measures.',
      features: ['End-to-end encryption', 'No data selling', 'GDPR compliant']
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powerful Geolocation Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our comprehensive suite of location-based services designed to enhance your navigation experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div key={index} className="card group hover:scale-105 transition-transform duration-300">
                <div className="text-center mb-6">
                  <div className="bg-primary-100 group-hover:bg-primary-200 transition-colors duration-300 rounded-full p-4 inline-block mb-4">
                    <IconComponent className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                </div>

                <div className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-sm text-gray-700">
                      <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <button
            onClick={() => navigate('/login')}
            className="btn-primary text-lg py-3 px-8 bg-blue-700 rounded-2xl text-white"
          >
            Explore All Features
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;
