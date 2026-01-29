
import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { PORTFOLIO } from '../constants';

const Portfolio: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const filters = ['all', 'visualization', 'animation', 'product', 'print'];

  const filteredItems = activeFilter === 'all'
    ? PORTFOLIO
    : PORTFOLIO.filter(item => item.category === activeFilter);

  return (
    <div className="py-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-display font-extrabold text-brand-dark mb-6">Our Work</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A showcase of our journey through pixels and plastic. From photorealistic renders to functional 3D printed components.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-8 py-3 rounded-full font-bold uppercase text-xs tracking-[0.2em] transition-all ${activeFilter === filter
                  ? 'bg-brand-dark text-white shadow-xl translate-y-[-2px]'
                  : 'bg-white text-gray-400 border border-gray-100 hover:text-brand-dark hover:border-gray-200'
                }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div key={item.id} className="group relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500">
              <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                {item.image.endsWith('.mp4') ? (
                  <video
                    src={item.image}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                <span className="text-brand-cyan font-bold text-xs uppercase tracking-[0.2em] mb-2">{item.category}</span>
                <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-white/70 text-sm mb-6 line-clamp-2">{item.description}</p>
                <div className="flex items-center space-x-4">
                  <button className="flex-grow bg-white text-brand-dark py-3 rounded-xl font-bold text-sm hover:bg-brand-cyan hover:text-white transition-all flex items-center justify-center">
                    View Project <ExternalLink size={16} className="ml-2" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Portfolio CTA */}
        <div className="mt-24 text-center">
          <p className="text-gray-500 mb-8 font-medium">Want to see more of our experimental designs?</p>
          <a
            href="https://www.instagram.com/rwooga"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-2xl font-display font-extrabold text-brand-dark hover:text-brand-cyan transition-colors"
          >
            Follow us @rwooga
          </a>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
