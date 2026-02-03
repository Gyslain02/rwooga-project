
import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { SERVICES, PORTFOLIO, getIcon } from '../constants';

// Assets
import heroImg from '../assets/Maguru photoshoot.png';
import heroVideo from '../assets/MAGURU N_INSIBIKA MOVIE first look.mp4';

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

  const videoScale = useTransform(smoothProgress, [0, 1], [1, 1.1]);
  const opacity = useTransform(smoothProgress, [0, 0.5], [1, 0]);

  return (
    <div className="bg-brand-dark overflow-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.div style={{ scale: videoScale }} className="w-full h-full">
            <video
              src={heroVideo}
              poster={heroImg}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/20 via-transparent to-brand-dark"></div>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div style={{ opacity }}>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block text-brand-primary font-bold tracking-[0.4em] uppercase text-sm mb-6"
            >
              Creative 3D Agency
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl md:text-[120px] font-display font-extrabold text-white leading-[0.85] tracking-tighter mb-12"
            >
              VISUALIZING <br />
              <span className="gradient-text">THE FUTURE</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              We provide professional 3D services including 3D visualizations, animated movies, animated advertisements, and product animations. We also design and manufacture custom 3D printed products.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap justify-center gap-6"
            >
              <Link to="/portfolio" className="bg-white text-black px-10 py-5 rounded-full font-bold hover:bg-brand-primary transition-all flex items-center group">
                WORK GALLERY <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/shop" className="border border-white/20 text-white px-10 py-5 rounded-full font-bold hover:bg-white/5 transition-all">
                VISIT SHOP
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid (Agenko Style) */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20">
            <div className="max-w-2xl">
              <span className="text-brand-primary font-bold tracking-widest uppercase text-xs mb-4 block">Capabilities</span>
              <h2 className="text-4xl md:text-6xl font-display font-bold text-white leading-tight">
                Innovative Services That <span className="text-gray-500 underline decoration-brand-primary/30">Elevate Your Brand</span>
              </h2>
            </div>
            <Link to="/services" className="hidden md:flex items-center text-sm font-bold tracking-widest text-gray-400 hover:text-white transition-all uppercase mb-2 group">
              View All Services <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5 rounded-[40px] overflow-hidden">
            {SERVICES.map((service, index) => (
              <motion.div
                key={service.id}
                className="p-10 md:p-16 flex flex-col items-start group relative transition-colors overflow-hidden"
              >
                {/* Individual Card Background Image */}
                <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 bg-black/80 z-10" /> {/* Dark overlay for text readability */}
                  {service.image.includes('.mp4') ? (
                    <video src={service.image} autoPlay muted loop className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000" />
                  ) : (
                    <img src={service.image} className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000" alt={service.title} />
                  )}
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
            ))}
          </div>
        </div>
      </section>

      {/* The Process behind the Magic */}
      <section className="py-32 bg-white/3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-24">
          <span className="text-brand-primary font-bold tracking-widest uppercase text-xs mb-4 block">Workflow</span>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white uppercase tracking-tighter">The Process <span className="text-gray-500">Step by Step</span></h2>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <ProcessStep number="01" title="Research" desc="In-depth analysis to uncover insights and drive strategy." />
          <ProcessStep number="02" title="Concept Design" desc="Creative frameworks that transform ideas into visuals." />
          <ProcessStep number="03" title="Implementation" desc="Tailored execution of strategies to achieve perfection." />
          <ProcessStep number="04" title="Final Testing" desc="Rigorous quality control for flawless functionality." />
        </div>
      </section>

      {/* Featured Projects Highlight */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between">
          <div className="max-w-xl">
            <span className="text-brand-primary font-bold tracking-widest uppercase text-xs mb-4 block">Portfolio</span>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white uppercase tracking-tighter">Selected <span className="text-gray-500">Works</span></h2>
          </div>
          <Link to="/portfolio" className="mt-8 md:mt-0 px-8 py-4 border border-white/10 rounded-full text-white font-bold hover:bg-white hover:text-black transition-all">
            EXPLORE ALL PROJECTS
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {PORTFOLIO.slice(0, 4).map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`group relative overflow-hidden rounded-[40px] aspect-[16/10] ${idx % 3 === 0 ? "md:col-span-1" : ""}`}
            >
              <div className="absolute inset-0 z-0">
                {project.image.includes('.mp4') ? (
                  <video src={project.image} autoPlay muted loop className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                ) : (
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-40 group-hover:opacity-60 transition-opacity"></div>
              </div>

              <div className="absolute inset-0 z-10 p-10 flex flex-col justify-end">
                <span className="text-brand-primary font-bold uppercase text-xs tracking-widest mb-2 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">{project.category}</span>
                <h3 className="text-3xl font-bold text-white group-hover:text-brand-primary transition-colors">{project.title}</h3>
              </div>
              <Link to="/portfolio" className="absolute inset-0 z-20"></Link>
            </motion.div>
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

const ProcessStep: React.FC<{ number: string; title: string; desc: string }> = ({ number, title, desc }) => (
  <div className="flex flex-col items-center md:items-start text-center md:text-left group">
    <div className="text-5xl font-display font-extrabold text-white/10 mb-6 group-hover:text-brand-primary/20 transition-colors uppercase tracking-widest">{number}</div>
    <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">{title}</h3>
    <p className="text-gray-400 group-hover:text-gray-300 transition-colors">{desc}</p>
  </div>
);

const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="text-center">
    <p className="text-4xl font-display font-extrabold text-white mb-2">{value}</p>
    <p className="text-xs text-brand-primary uppercase tracking-[0.2em] font-bold">{label}</p>
  </div>
);

export default Home;
