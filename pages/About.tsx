
import React from 'react';
import { Target, Users, Zap, Shield } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Assets
import teamImg from '../assets/Maguru and mom 2.png';
import memberImg from '../assets/image (1).png';

const About: React.FC = () => {
  return (
    <div className="bg-brand-dark min-h-screen pt-40 pb-20 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Intro Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-32">
          <div className="max-w-2xl">
            <span className="text-brand-primary font-bold tracking-[0.4em] uppercase text-xs mb-6 block">Our Identity</span>
            <h1 className="text-6xl md:text-[100px] font-display font-extrabold text-white leading-[0.85] tracking-tighter uppercase">
              Who we <br />
              <span className="text-gray-500">really are</span>
            </h1>
          </div>
          <div className="max-w-sm mt-8 md:mt-0">
            <p className="text-gray-400 text-lg leading-relaxed">
              We are a Rwanda-based 3D studio specializing in 3D visualizations, animated films and advertisements, and 3D products. We use 3D as a creative and technical tool to help brands, businesses, and individuals bring ideas to life.
            </p>
          </div>
        </div>

        {/* Content Block 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-40">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative rounded-[40px] overflow-hidden"
          >
            <img src={teamImg} className="w-full grayscale hover:grayscale-0 transition-all duration-1000 scale-105" alt="Team" />
            <div className="absolute inset-0 bg-brand-primary/10 mix-blend-overlay"></div>
          </motion.div>

          <div className="space-y-12">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight uppercase tracking-tighter">
              Custom Problems Require <span className="text-brand-primary">Unique Solutions.</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
              <div>
                <h4 className="text-brand-primary font-bold uppercase tracking-widest text-xs mb-4">Our Mission</h4>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">Our approach is simple: we don’t believe in one-size-fits-all solutions. Every project starts with understanding the problem, then designing a solution specifically for it — visually, functionally, and strategically.</p>
                <p className="text-gray-500 text-sm leading-relaxed">From concept to final render or physical product, we combine creativity, storytelling, and technical precision to deliver high-quality, custom-made results.</p>
              </div>

            </div>
          </div>
        </div>

        {/* Core Values / Features */}
        <div className="mb-40">
          <div className="text-center mb-24">
            <span className="text-brand-primary font-bold tracking-widest uppercase text-xs mb-4 block">Our Values</span>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white uppercase tracking-tighter">Why Work <span className="text-gray-500">With Us</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5 rounded-[40px] overflow-hidden">
            <AboutFeature icon={<Zap size={32} />} title="Fast Delivery" desc="Optimized workflows ensuring your projects are delivered on time without compromising quality." />
            <AboutFeature icon={<Users size={32} />} title="Expert Team" desc="Skilled 3D artists and engineers with years of experience in the industry." />
            <AboutFeature icon={<Target size={32} />} title="Precision" desc="High-detail renders and micron-level precision in our 3D printed products." />
            <AboutFeature icon={<Shield size={32} />} title="Reliable" desc="Dedicated support and open communication through WhatsApp and email." />
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-40">
          <div className="mb-16">
            <h2 className="text-4xl font-display font-bold text-white uppercase tracking-tighter">Meet <span className="text-gray-500">our Team</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <TeamMember
              image={memberImg}
              name="PHEDO KAT"
              role="Founder/ lead 3D artist"
            />
            <TeamMember
              image={memberImg}
              name="Uwihanganye Benjamin"
              role="Digital Environment Artist"
            />
            <TeamMember
              image={memberImg}
              name="MURABUKIRWA Noah"
              role="lead 2D artist"
            />
            <TeamMember
              image={memberImg}
              name="MUPENZI Herve"
              role="Lead Digital Sculptor"
            />
          </div>
        </div>

        {/* Tools Section */}
        <section className="py-24 border-t border-white/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="text-gray-500 font-bold uppercase tracking-[0.4em] text-xs">The Tech Stack</div>
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-8">
              {['BLENDER', 'UNREAL ENGINE', 'SOLIDWORKS', 'MAYA', 'PRUSA SLICER'].map((tool) => (
                <span key={tool} className="text-2xl font-display font-black text-white/20 hover:text-brand-primary transition-colors cursor-default tracking-tighter">{tool}</span>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const AboutFeature: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="p-12 hover:bg-white/5 transition-colors group">
    <div className="mb-8 text-brand-primary group-hover:scale-110 transition-transform duration-500">{icon}</div>
    <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

const TeamMember: React.FC<{ image: string; name: string; role: string }> = ({ image, name, role }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="group"
  >
    <div className="aspect-square rounded-[32px] overflow-hidden bg-white/5 mb-6">
      <img src={image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={name} />
    </div>
    <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">{name}</h3>
    <p className="text-gray-500 text-sm font-medium">{role}</p>
  </motion.div>
);

const MissionItem: React.FC<{ title: string; text: React.ReactNode }> = ({ title, text }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay: 0.4 }}
    className="flex items-start space-x-4"
  >
    <div className="mt-1 bg-brand-cyan w-2 h-2 rounded-full flex-shrink-0" />
    <div>
      <h4 className="font-bold text-brand-dark">{title}</h4>
      <div className="text-gray-600">{text}</div>
    </div>
  </motion.div>
);

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; text: string; delay: number }> = ({ icon, title, text, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className="bg-white p-8 rounded-3xl border border-gray-100 hover:shadow-xl transition-all"
  >
    <div className="text-brand-cyan mb-6 bg-brand-cyan/10 w-12 h-12 rounded-xl flex items-center justify-center">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-brand-dark mb-4">{title}</h3>
    <p className="text-gray-500 leading-relaxed">{text}</p>
  </motion.div>
);

export default About;
