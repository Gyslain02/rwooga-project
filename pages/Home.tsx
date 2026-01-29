
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, CheckCircle2 } from 'lucide-react';
import { SERVICES, PORTFOLIO, getIcon } from '../constants';

// Assets
import heroImg from '../assets/Maguru photoshoot.png';
import heroVideo from '../assets/MAGURU N_INSIBIKA MOVIE first look.mp4';

const Home: React.FC<{ isPrintingEnabled: boolean }> = ({ isPrintingEnabled }) => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            src={heroVideo}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
          {/* Subtle dark overlay for readability */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="flex flex-col items-center text-center space-y-12">

            {/* Main Content - Centered */}
            <div className="max-w-3xl space-y-8">
              <h1 className="text-6xl md:text-8xl font-display font-extrabold text-brand-dark tracking-tighter leading-[0.9] drop-shadow-2xl">
                Visualizing <br />
                <span className="text-brand-dark">the Future.</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-md">
                We provide professional 3D services including 3D visualizations, animated movies, animated advertisements, and product animations. We also design and manufacture custom 3D printed products.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
                <Link to="/portfolio" className="bg-brand-cyan text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center hover:shadow-2xl transition-all hover:-translate-y-1 group">
                  View Portfolio
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/shop" className="bg-white/10 backdrop-blur-md border-2 border-white/20 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center hover:bg-white/20 transition-all">
                  Shop Products
                </Link>
              </div>
            </div>

            {/* Bottom Stats - Centered */}
            <div className="w-full max-w-2xl pt-8 border-t border-white/10">
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                <Stat label="Completed Projects" value="250+" />
                <Stat label="Happy Clients" value="120+" />
                <Stat label="Years Exp." value="8+" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-brand-cyan uppercase tracking-[0.2em] mb-4">Our Services</h2>
            <h3 className="text-4xl md:text-5xl font-display font-extrabold text-brand-dark">What We Excel At</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {SERVICES.map((service) => (
              <div key={service.id} className="bg-white p-8 rounded-3xl hover:shadow-2xl transition-all group hover:-translate-y-2 border border-gray-100">
                <div className="aspect-video w-full rounded-2xl overflow-hidden mb-6 border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow bg-gray-50">
                  {service.image.endsWith('.mp4') ? (
                    <video src={service.image} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                  ) : (
                    <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  )}
                </div>
                <h4 className="text-xl font-bold text-brand-dark mb-4">{service.title}</h4>
                <p className="text-gray-600 mb-6 line-clamp-3">{service.description}</p>
                <Link to="/services" className="inline-flex items-center font-bold text-brand-dark hover:text-brand-cyan transition-colors">
                  Learn More <ChevronRight size={18} className="ml-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Highlight */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-brand-cyan uppercase tracking-[0.2em] mb-4">The Gallery</h2>
            <h3 className="text-4xl md:text-5xl font-display font-extrabold text-brand-dark">Featured Works </h3>
            <p className="text-gray-600">Take a look at some of our recent breakthroughs in architecture, product design, and 3D printing.</p>

            <div className="flex justify-end mt-8">
              <Link to="/portfolio" className="font-bold text-brand-cyan flex items-center hover:text-brand-dark transition-colors">
                Explore Full Portfolio <ArrowRight size={20} className="ml-2" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PORTFOLIO.slice(0, 3).map((item) => (
              <div key={item.id} className="relative group overflow-hidden rounded-3xl aspect-square bg-gray-100">
                {item.image.endsWith('.mp4') ? (
                  <video
                    src={item.image}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                )}
                <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="text-center p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    <p className="text-white font-bold text-2xl mb-2">{item.title}</p>
                    <p className="text-white/80 uppercase text-xs tracking-widest">{item.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modified CTA Section (Matches the light green block in the image) */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          {/* The light green block container */}
          <div className="bg-green-100 p-12 rounded-2xl text-center shadow-md">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Ready to bring your idea into <span className="text-teal-600">3D Space</span>?
            </h2>

            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/contact" className="w-full sm:w-auto bg-brand-cyan text-white px-10 py-5 rounded-2xl font-bold hover:bg-white hover:text-brand-dark transition-all shadow-xl shadow-cyan-900/20">
                Start a Conversation
              </Link>
              {isPrintingEnabled && (
                <Link to="/custom-request" className="w-full sm:w-auto bg-transparent border-2 border-black/20 text-black px-10 py-5 rounded-2xl font-bold hover:bg-white/10 transition-all">
                  Request Custom Design
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="drop-shadow-lg">
    <p className="text-3xl font-display font-extrabold text-white">{value}</p>
    <p className="text-sm text-brand-cyan uppercase tracking-tighter font-bold">{label}</p>
  </div>
);

export default Home;
