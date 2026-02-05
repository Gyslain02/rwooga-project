
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { PORTFOLIO } from '../constants';

const Portfolio: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const filters = ['all', 'visualization', 'animation', 'product', 'print'];

  const filteredItems = activeFilter === 'all'
    ? PORTFOLIO
    : PORTFOLIO.filter(item => item.category === activeFilter);

  return (
    <div className="bg-brand-dark min-h-screen pt-40 pb-20 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24">
          <div className="max-w-2xl">
            <span className="text-brand-primary font-bold tracking-[0.4em] uppercase text-xs mb-6 block">Our Creative Works</span>
            <h1 className="text-5xl md:text-[100px] font-display font-extrabold text-white leading-[0.85] tracking-tighter uppercase">
              Selected <br />
              <span className="text-gray-500">Projects</span>
            </h1>
          </div>

        
          <div className="mt-8 md:mt-0 flex flex-wrap gap-x-8 gap-y-4">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`text-sm font-bold uppercase tracking-widest transition-all pb-2 border-b-2 ${activeFilter === filter
                  ? 'text-brand-primary border-brand-primary'
                  : 'text-gray-500 border-transparent hover:text-white'
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

      
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <ProjectCard key={item.id} item={item} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>


      </div>
    </div>
  );
};

const ProjectCard: React.FC<{ item: any, index: number }> = ({ item, index }) => {
  const cardRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [20, -20]);

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      className="group relative"
    >
      <div className="aspect-[10/12] overflow-hidden rounded-[40px] bg-white/5 relative mb-6">
        <motion.div style={{ y }} className="w-full h-[120%] -top-[10%] absolute">
          {item.image && (item.image.includes('.mp4') || item.image.includes('.webm')) ? (
            <video
              src={item.image}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
            />
          )}
        </motion.div>
        <div className="absolute inset-0 bg-brand-primary mix-blend-multiply opacity-0 group-hover:opacity-20 transition-opacity"></div>
        <Link to="/portfolio" className="absolute inset-0 z-10"></Link>
      </div>

      <div className="flex justify-between items-start pr-4">
        <div>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">{item.category}</span>
          <h3 className="text-2xl font-bold text-white group-hover:text-brand-primary transition-colors uppercase tracking-tight">{item.title}</h3>
        </div>
        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-brand-primary group-hover:text-black transition-all">
          <ArrowRight size={20} />
        </div>
      </div>
    </motion.div>
  );
};

export default Portfolio;
