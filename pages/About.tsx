
import React from 'react';
import { Target, Users, Zap, Shield } from 'lucide-react';

// Assets
import teamImg from '../assets/Maguru and mom 2.png';

const About: React.FC = () => {
  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intro */}
        <div className="text-center mb-16 font-display">
          <h2 className="text-sm font-bold text-brand-cyan uppercase tracking-[0.2em] mb-4">About Rwooga</h2>
          <h3 className="text-4xl md:text-5xl font-display font-extrabold text-brand-dark">Who We Are</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-extrabold text-brand-dark mb-8">
              Custom problems<br />
              need <span className="text-brand-dark">custom</span><br />
              <span className="text-brand-dark">solutions.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              We are a Rwanda-based 3D studio specializing in <strong>3D visualizations, animated films and advertisements, and 3D products</strong>. We use 3D as a creative and technical tool to help brands, businesses, and individuals bring ideas to life.
            </p>
            <div className="space-y-4">
              <MissionItem
                title="Our Mission"
                text={
                  <>
                    Our approach is simple: <strong>we don’t believe in one-size-fits-all solutions</strong>. Every project starts with understanding the problem, then designing a solution specifically for it — visually, functionally, and strategically.
                    <br /><br />
                    From concept to final render or physical product, we combine <strong>creativity, storytelling, and technical precision</strong> to deliver high-quality, custom-made results.
                  </>
                }
              />
            </div>
          </div>
          <div className="relative">
            <img
              src={teamImg}
              alt="Team working"
              className="rounded-3xl shadow-2xl"
            />
          </div>
        </div>

        {/* Why Trust Us */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-brand-dark">Why Clients Trust Rwooga</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard icon={<Zap />} title="Fast Delivery" text="Optimized workflows ensuring your projects are delivered on time without compromising quality." />
            <FeatureCard icon={<Users />} title="Expert Team" text="Skilled 3D artists and engineers with years of experience in the industry." />
            <FeatureCard icon={<Target />} title="Precision Focused" text="High-detail renders and micron-level precision in our 3D printed products." />
            <FeatureCard icon={<Shield />} title="Reliable Support" text="Dedicated support and open communication through WhatsApp and email." />
          </div>
        </section>

        {/* Tools Section */}
        <section className="bg-gray-50 rounded-3xl p-12 md:p-20 text-center">
          <h3 className="text-2xl font-bold text-brand-dark mb-12">Tools We Use to Create Magic</h3>
          <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all">
            <span className="text-2xl font-display font-extrabold tracking-tighter">BLENDER</span>
            <span className="text-2xl font-display font-extrabold tracking-tighter">UNREAL ENGINE</span>
            <span className="text-2xl font-display font-extrabold tracking-tighter">SOLIDWORKS</span>
            <span className="text-2xl font-display font-extrabold tracking-tighter">MAYA</span>
            <span className="text-2xl font-display font-extrabold tracking-tighter">PRUSA SLICER</span>
          </div>
        </section>
      </div>
    </div>
  );
};

const MissionItem: React.FC<{ title: string; text: React.ReactNode }> = ({ title, text }) => (
  <div className="flex items-start space-x-4">
    <div className="mt-1 bg-brand-cyan w-2 h-2 rounded-full flex-shrink-0" />
    <div>
      <h4 className="font-bold text-brand-dark">{title}</h4>
      <div className="text-gray-600">{text}</div>
    </div>
  </div>
);

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; text: string }> = ({ icon, title, text }) => (
  <div className="bg-white p-8 rounded-3xl border border-gray-100 hover:shadow-xl transition-all">
    <div className="text-brand-cyan mb-6 bg-brand-cyan/10 w-12 h-12 rounded-xl flex items-center justify-center">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-brand-dark mb-4">{title}</h3>
    <p className="text-gray-500 leading-relaxed">{text}</p>
  </div>
);

export default About;
