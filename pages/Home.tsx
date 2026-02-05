
import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, CheckCircle2, Play } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { SERVICES, PORTFOLIO, getIcon } from '../constants';


import heroImg from '../assets/Maguru photoshoot.png';
import heroVideo from '../assets/MAGURU N_INSIBIKA MOVIE first look.mp4';
import planetsBg from '../assets/20 Strange Planets That Are Both Interesting And Terrifying (1).jpg';
import titleTexture from '../assets/download (37).jpg';

const Home: React.FC<{ isPrintingEnabled: boolean }> = ({ isPrintingEnabled }) => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const opacity = useTransform(smoothProgress, [0, 0.5], [1, 0]);
  const heroTextY = useTransform(smoothProgress, [0, 1], [0, -80]);

  return (
    <div className="bg-brand-dark overflow-hidden">
  
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center pt-32 pb-20 px-4 sm:px-6 lg:px-8">
    
        <div className="absolute top-0 left-0 w-full h-[80vh] z-0 pointer-events-none overflow-hidden">
          <motion.img
            src={planetsBg}
            style={{ y: useTransform(smoothProgress, [0, 1], [0, 100]), scale: 1.05 }}
            className="w-full h-full object-cover opacity-15 translate-y-[-10%]"
            alt="Background Planets"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/0 via-brand-dark/60 to-brand-dark" />
        </div>

        {/* Background Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(16,185,129,0.15)_0%,transparent_50%)] pointer-events-none z-10" />

        <div className="max-w-7xl mx-auto w-full relative z-20 flex flex-col items-center">
          {/* Top Stage: Title & Intro */}
          <motion.div
            style={{ opacity, y: heroTextY }}
            className="text-center mb-16 max-w-4xl"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-[100px] font-brand font-bold leading-tight mb-8 tracking-[-0.02em]"
              style={{ color: '#008000' }}
            >
              Visualize the future
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Rwooga transforms complex ideas into stunning 3D visualizations, animations, and precision-engineered 3D printed products.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-6"
            >
              <Link
                to="/portfolio"
                className="bg-brand-primary text-black px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white transition-all flex items-center gap-2 group"
              >
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /> View Portfolio
              </Link>
              <Link
                to="/shop"
                className="border-2 border-brand-primary/20 text-brand-primary px-8 py-4 rounded-2xl font-bold text-lg hover:bg-brand-primary/5 transition-all"
              >
                Shop Products
              </Link>
            </motion.div>
          </motion.div>

          {/* Middle Stage: Character & Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full max-w-5xl mb-32">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="relative"
            >
              <img
                src={heroImg}
                className="w-full h-auto max-h-[600px] object-contain drop-shadow-[0_20px_80px_rgba(16,185,129,0.15)]"
                alt="Main Character"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-12 rounded-[40px] space-y-8 shadow-2xl"
            >
              <HeroServiceLink text="3D Visualization" to="/services" />
              <HeroServiceLink text="Custom 3D Design" to="/services" />
              <HeroServiceLink text="3D Printing" to="/services" />
            </motion.div>
          </div>

          {/* Bottom Stage: Video Card with Scroll Interaction */}
          <motion.div
            style={{
              scale: useTransform(smoothProgress, [0.3, 0.8], [0.9, 1.05]),
              rotateX: useTransform(smoothProgress, [0.3, 0.8], [5, 0]),
              y: useTransform(smoothProgress, [0.3, 0.8], [50, 0]),
              opacity: useTransform(smoothProgress, [0.3, 0.5], [0.8, 1])
            }}
            className="w-full max-w-5xl aspect-[16/9] rounded-[40px] overflow-hidden relative group shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-white/10 perspective-1000"
          >
            <video
              src={heroVideo}
              className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[4s] ease-out"
              autoPlay
              muted
              loop
              playsInline
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-700 flex items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-24 h-24 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-black shadow-2xl cursor-pointer"
              >
                <Play fill="currentColor" size={32} className="ml-1" />
              </motion.div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          </motion.div>
        </div>
      </section>

      {/* Services Grid (Agenko Style) */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20">
            <div className="max-w-2xl">
              <span className="text-brand-primary font-bold tracking-widest uppercase text-xs mb-4 block">Capabilities</span>
              <h2 className="text-3xl md:text-6xl font-display font-bold text-white leading-tight">
                Innovative Services That <span className="text-gray-500 underline decoration-brand-primary/30">Elevate Your Brand</span>
              </h2>
            </div>
            <Link to="/services" className="hidden md:flex items-center text-sm font-bold tracking-widest text-gray-400 hover:text-white transition-all uppercase mb-2 group">
              View All Services <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5 rounded-[40px] overflow-hidden">
            {SERVICES.map((service, index) => (
              <ParallaxServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>



      {/* Featured Projects Highlight */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between">
          <div className="max-w-xl">
            <span className="text-brand-primary font-bold tracking-widest uppercase text-xs mb-4 block">Portfolio</span>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white uppercase tracking-tighter">Selected <span className="text-gray-500 underline decoration-brand-primary/30">Works</span></h2>
          </div>
          <Link to="/portfolio" className="mt-8 md:mt-0 px-8 py-4 border border-white/10 rounded-full text-white font-bold hover:bg-white hover:text-black transition-all">
            EXPLORE ALL PROJECTS
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {PORTFOLIO.slice(0, 4).map((project, idx) => (
            <FeaturedProjectCard key={project.id} project={project} index={idx} />
          ))}
        </div>
      </section>

      {/* CTA Section (Agenko Style) */}
      <section className="py-24 md:py-40 bg-[#111418] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl md:text-[100px] font-display font-extrabold text-white leading-[0.9] tracking-tighter mb-10 md:mb-12 uppercase">
            Start Your <br />
            <span className="text-brand-primary">New Concept</span>
          </h2>
          <Link to="/contact" className="inline-flex items-center text-lg md:text-3xl font-bold text-white border-b-2 md:border-b-4 border-white/20 pb-2 md:pb-4 hover:text-brand-primary hover:border-brand-primary transition-all">
            WORK WITH US <ArrowRight className="ml-2 md:ml-4 w-5 h-5 md:w-8 md:h-8" />
          </Link>
        </div>
      </section>
    </div>
  );
};

const HeroServiceLink: React.FC<{ text: string; to: string }> = ({ text, to }) => (
  <Link to={to} className="flex items-center justify-between group py-2 border-b border-white/5 hover:border-brand-primary transition-all">
    <span className="text-xl md:text-2xl font-bold text-gray-400 group-hover:text-white transition-colors">{text}</span>
    <ChevronRight size={24} className="text-gray-600 group-hover:text-brand-primary group-hover:translate-x-2 transition-all" />
  </Link>
);

const ParallaxServiceCard: React.FC<{ service: any; index: number }> = ({ service, index }) => {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <motion.div
      ref={cardRef}
      className="p-10 md:p-16 flex flex-col items-start group relative transition-colors overflow-hidden min-h-[400px]"
    >
      {/* Individual Card Background Image */}
      <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="absolute inset-0 bg-black/80 z-10" />
        <motion.div style={{ y }} className="w-full h-[120%] -top-[10%] absolute">
          {service.image.includes('.mp4') ? (
            <video src={service.image} autoPlay muted loop className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000" />
          ) : (
            <img src={service.image} className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000" alt={service.title} />
          )}
        </motion.div>
      </div>

      <div className="relative z-10">
        <div className="mb-8 p-4 bg-brand-primary/10 rounded-2xl text-brand-primary group-hover:bg-brand-primary group-hover:text-black transition-all duration-500 w-fit">
          {getIcon(service.icon)}
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 group-hover:text-brand-primary transition-colors">{service.title}</h3>
        <p className="text-gray-400 mb-10 leading-relaxed text-lg group-hover:text-gray-200 transition-colors">{service.description}</p>
        <Link to="/services" className="text-brand-primary font-bold flex items-center group/btn">
          Learn More <ArrowRight size={16} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
};

const FeaturedProjectCard: React.FC<{ project: any; index: number }> = ({ project, index }) => {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`group relative overflow-hidden rounded-[40px] aspect-[16/10]`}
    >
      <div className="absolute inset-0 z-0">
        <motion.div style={{ y }} className="w-full h-[120%] -top-[10%] absolute">
          {project.image.includes('.mp4') ? (
            <video src={project.image} autoPlay muted loop className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
          ) : (
            <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
          )}
        </motion.div>
        <div className="absolute inset-0 bg-black/40 opacity-40 group-hover:opacity-60 transition-opacity"></div>
      </div>

      <div className="absolute inset-0 z-10 p-10 flex flex-col justify-end">
        <span className="text-brand-primary font-bold uppercase text-xs tracking-widest mb-2 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">{project.category}</span>
        <h3 className="text-3xl font-bold text-white group-hover:text-brand-primary transition-colors">{project.title}</h3>
      </div>
      <Link to="/portfolio" className="absolute inset-0 z-20"></Link>
    </motion.div>
  );
};



const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="text-center">
    <p className="text-4xl font-display font-extrabold text-white mb-2">{value}</p>
    <p className="text-xs text-brand-primary uppercase tracking-[0.2em] font-bold">{label}</p>
  </div>
);

export default Home;
