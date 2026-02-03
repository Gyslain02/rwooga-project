
import React from 'react';
import { ArrowRight, Box, Video, Palette, Printer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SERVICES } from '../constants';

const Services: React.FC = () => {
  return (
    <div className="bg-brand-dark min-h-screen pt-40 pb-20 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-32">
          <div className="max-w-2xl">
            <span className="text-brand-primary font-bold tracking-[0.4em] uppercase text-xs mb-6 block">Our Capabilities</span>
            <h1 className="text-6xl md:text-[100px] font-display font-extrabold text-white leading-[0.85] tracking-tighter uppercase">
              Core <br />
              <span className="text-gray-500">Expertise</span>
            </h1>
          </div>
          <div className="max-w-md mt-8 md:mt-0">
            <p className="text-gray-400 text-lg leading-relaxed">
              We bridge the gap between imagination and reality with specialized 3D workflows tailored for Businesses, architects, real estate developers, marketing agencies, startups, and individuals who need custom-designed or 3D printed solutions.
            </p>
          </div>
        </div>

        {/* Detailed Services */}
        <div className="space-y-48">
          {SERVICES.map((service, index) => (
            <ServiceDetail
              key={service.id}
              id={service.id}
              icon={getServiceIcon(service.id)}
              title={service.title}
              description={service.description}
              features={getServiceFeatures(service.id)}
              image={service.image}
              reverse={index % 2 !== 0}
            />
          ))}
        </div>


      </div>
    </div>
  );
};

const ServiceDetail: React.FC<{
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  image: string;
  reverse: boolean;
}> = ({ icon, title, description, features, image, reverse }) => (
  <div className={`flex flex-col lg:flex-row gap-24 items-center ${reverse ? 'lg:flex-row-reverse' : ''}`}>
    <motion.div
      initial={{ opacity: 0, x: reverse ? 60 : -60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="lg:w-1/2 space-y-10"
    >
      <div className="text-brand-primary p-4 bg-white/5 inline-block rounded-2xl">{icon}</div>
      <h3 className="text-4xl md:text-6xl font-display font-bold text-white uppercase tracking-tighter leading-none">{title}</h3>
      <p className="text-xl text-gray-400 leading-relaxed font-medium">{description}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 pt-6">
        {features.map((f, idx) => (
          <div key={idx} className="group-hover-trigger">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">0{idx + 1}</span>
            <p className="text-white font-bold uppercase tracking-tight text-lg">{f}</p>
          </div>
        ))}
      </div>

      <div className="pt-8">
        <Link to="/contact" className="inline-flex items-center font-bold text-white border-b-2 border-brand-primary pb-2 hover:text-brand-primary transition-all group uppercase tracking-widest text-sm">
          Request Quotation <ArrowRight size={18} className="ml-3 group-hover:translate-x-2 transition-transform" />
        </Link>
      </div>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="lg:w-1/2 relative group rounded-[40px] overflow-hidden"
    >
      {image && (image.includes('.mp4') || image.includes('.webm')) ? (
        <video
          src={image}
          className="w-full h-full object-cover aspect-[4/3] group-hover:scale-110 transition-transform duration-[2s]"
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover aspect-[4/3] group-hover:scale-110 transition-transform duration-[2s]"
        />
      )}
      <div className="absolute inset-0 bg-brand-primary/10 mix-blend-overlay"></div>
    </motion.div>
  </div>
);

const getServiceIcon = (id: string) => {
  switch (id) {
    case 'viz': return <Box size={32} />;
    case 'anim': return <Video size={32} />;
    case 'custom': return <Palette size={32} />;
    case 'print': return <Printer size={32} />;
    default: return <Box size={32} />;
  }
};

const getServiceFeatures = (id: string) => {
  switch (id) {
    case 'viz': return ['Architectural Renders', 'Interior Design Visuals', 'Product Photography', '360° VR Tours'];
    case 'anim': return ['Product Explainers', 'Commercial Movies', 'TV Advertisements', 'Logo Animation'];
    case 'custom': return ['Mechanical Design', 'Functional Prototyping', 'Artistic Sculpting', 'CAD Optimization'];
    case 'print': return ['Rapid Manufacturing', 'Batch Production', 'Functional Parts', 'Scale Models'];
    default: return [];
  }
};

export default Services;
