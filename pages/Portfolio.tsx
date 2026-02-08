
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PORTFOLIO } from '../constants';
import ProjectCard from '../components/ProjectCard';

const Portfolio: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const navigate = useNavigate();
  const filters = ['all', 'visualization', 'animation', 'product', 'print'];

  const filteredItems = activeFilter === 'all'
    ? PORTFOLIO
    : PORTFOLIO.filter(item => item.category === activeFilter);

  const handleProjectClick = (id: string | number) => {
    // Navigate to project detail page when implemented
    // navigate(`/portfolio/${id}`);
    console.log('Project clicked:', id);
  };

  return (
    <div className="bg-brand-dark min-h-screen pt-40 pb-20 overflow-hidden relative">
      {/* Background Gradient Glow */}
      <div className="absolute inset-0 bg-gradient-green-radial opacity-30 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20">
          <div className="max-w-2xl mb-8 md:mb-0">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-brand-primary font-bold tracking-[0.4em] uppercase text-xs mb-6 block"
            >
              Our Creative Works
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-[100px] font-display font-extrabold leading-[0.85] tracking-tighter uppercase"
            >
              <span className="gradient-text-reverse">Selected</span>
              <br />
              <span className="text-gray-500">Projects</span>
            </motion.h1>
          </div>

          {/* Glass Tab Filters */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-3"
          >
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`glass-tab ${activeFilter === filter ? 'active' : ''}`}
              >
                {filter}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Project Grid */}
        <motion.div
          layout
          className="project-grid"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <ProjectCard
                key={item.id}
                id={item.id}
                title={item.title}
                category={item.category}
                image={item.image}
                description={item.description}
                onClick={handleProjectClick}
                index={index}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-40 glass-card rounded-[40px]"
          >
            <p className="text-gray-500 font-bold uppercase tracking-widest">
              No projects found in this category.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
