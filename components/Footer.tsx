
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import { BRAND_EMAIL, WHATSAPP_NUMBER } from '../constants';

// Assets
import logo from '../assets/Rwooga logo.png';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-dark text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center mb-6" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img src={logo} alt="Rwooga" className="h-10 w-auto object-contain brightness-0 invert" />
            </Link>
            <p className="text-emerald-100/70 leading-relaxed mb-6">
              Professional 3D services bringing imagination to life through high-end visualizations, animation, and precision 3D printing.
            </p>
            <div className="flex space-x-4">
              <SocialIcon icon={<Instagram size={20} />} href="#" />
              <SocialIcon icon={<Facebook size={20} />} href="#" />
              <SocialIcon icon={<Twitter size={20} />} href="#" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 font-display">Explore</h3>
            <ul className="space-y-4 text-emerald-100/70">
              <li><Link to="/services" className="hover:text-brand-cyan transition-colors">Services</Link></li>
              <li><Link to="/portfolio" className="hover:text-brand-cyan transition-colors">Portfolio</Link></li>
              <li><Link to="/shop" className="hover:text-brand-cyan transition-colors">Shop Products</Link></li>
              <li><Link to="/custom-request" className="hover:text-brand-cyan transition-colors">Custom Request</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xl font-bold mb-6 font-display">Company</h3>
            <ul className="space-y-4 text-emerald-100/70">
              <li><Link to="/about" className="hover:text-brand-cyan transition-colors">Our Story</Link></li>
              <li><Link to="/careers" className="hover:text-brand-cyan transition-colors">Careers</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-brand-cyan transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-brand-cyan transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-6 font-display">Get in Touch</h3>
            <ul className="space-y-4 text-emerald-100/70">
              <li className="flex items-start space-x-3">
                <Mail className="text-brand-cyan flex-shrink-0" size={20} />
                <span>{BRAND_EMAIL}</span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="text-brand-cyan flex-shrink-0" size={20} />
                <span>{WHATSAPP_NUMBER}</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="text-brand-cyan flex-shrink-0" size={20} />
                <span>Kigali, Rwanda</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-emerald-800/50 pt-8 flex flex-col md:flex-row justify-between items-center text-emerald-100/50 text-sm">
          <p>© {new Date().getFullYear()} Rwooga Studio. All rights reserved.</p>
          <p className="mt-4 md:mt-0">Crafted with precision in Rwanda.</p>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon: React.FC<{ icon: React.ReactNode; href: string }> = ({ icon, href }) => (
  <a href={href} className="w-10 h-10 rounded-full border border-emerald-800 flex items-center justify-center hover:bg-brand-cyan hover:border-brand-cyan transition-all">
    {icon}
  </a>
);

export default Footer;
