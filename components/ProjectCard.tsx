import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface ProjectCardProps {
  id: string | number;
  title: string;
  category?: string;
  image: string;
  description?: string;
  onClick?: (id: string | number) => void;
  index?: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  category,
  image,
  description,
  onClick,
  index = 0
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group cursor-pointer project-card"
      onClick={handleClick}
    >
      {/* Image Container with Glass Overlay */}
      <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-white/5 mb-6">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        
        {/* Category Badge */}
        {category && (
          <div className="absolute top-4 left-4 px-4 py-2 glass-card rounded-full">
            <span className="text-xs font-bold text-white uppercase tracking-widest">
              {category}
            </span>
          </div>
        )}

        {/* Glass Overlay on Hover */}
        <div className="project-card-overlay flex flex-col items-start justify-end p-8">
          <div className="glass-card p-4 rounded-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
            {description && (
              <p className="text-gray-300 text-sm mb-4">{description}</p>
            )}
            <div className="flex items-center text-brand-primary font-bold text-sm uppercase tracking-widest">
              View Project <ArrowRight size={16} className="ml-2" />
            </div>
          </div>
        </div>
      </div>

      {/* Title & Meta (Visible Always) */}
      <div className="px-2">
        <h3 className="text-xl font-bold text-white mb-1 uppercase tracking-tight">
          {title}
        </h3>
        {category && (
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">
            {category}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectCard;
