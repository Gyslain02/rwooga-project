
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Youtube } from 'lucide-react';
import { BRAND_EMAIL, WHATSAPP_NUMBER } from '../constants';


import logo from '../assets/Rwooga logo.png';

const XIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153zm-1.29 19.494h2.039L6.482 3.239h-2.19L17.61 20.647z" />
  </svg>
);

const Tiktok: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white pt-32 pb-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center mb-10" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img src={logo} alt="Rwooga" className="h-20 w-auto object-contain" />
            </Link>
            <p className="text-gray-400 leading-relaxed mb-8 text-lg">
              Elevating brands through high-end 3D visualization, animation, and precision manufacturing.
            </p>
            <div className="flex space-x-6">
              <SocialIcon icon={<Instagram size={20} />} href="https://www.instagram.com/rwooga.ent?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" />
              <SocialIcon icon={<XIcon size={18} />} href="https://x.com/PhedoKat" />
              <SocialIcon icon={<Youtube size={20} />} href="https://www.youtube.com/@phedokat9549" />
              <SocialIcon icon={<Tiktok size={20} />} href="https://www.tiktok.com/@phedish?_r=1&_t=ZS-93aOKvDhzme" />
            </div>
          </div>


          <div>
            <h3 className="text-xs font-bold text-brand-primary uppercase tracking-[0.3em] mb-10">Explore</h3>
            <ul className="space-y-4 text-white font-bold text-lg">
              <li><Link to="/services" className="hover:text-brand-primary transition-colors">Our services</Link></li>
              <li><Link to="/portfolio" className="hover:text-brand-primary transition-colors">Portfolio</Link></li>
              <li><Link to="/shop" className="hover:text-brand-primary transition-colors">Shop products</Link></li>
              <li><Link to="/custom-request" className="hover:text-brand-primary transition-colors">Custom design</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-brand-primary uppercase tracking-[0.3em] mb-10">Support</h3>
            <ul className="space-y-4 text-white font-bold text-lg">
              <li><Link to="/about" className="hover:text-brand-primary transition-colors">About us</Link></li>
              <li><Link to="/contact" className="hover:text-brand-primary transition-colors">Contact</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-brand-primary transition-colors">Privacy policy</Link></li>
              <li><Link to="/terms" className="hover:text-brand-primary transition-colors">Terms</Link></li>
            </ul>
          </div>

         
          <div>
            <h3 className="text-xs font-bold text-brand-primary uppercase tracking-[0.3em] mb-10">Get in Touch</h3>
            <ul className="space-y-8">
              <li className="group">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-2">Email us</span>
                <a href={`mailto:${BRAND_EMAIL}`} className="text-xl font-bold group-hover:text-brand-primary transition-colors">{BRAND_EMAIL}</a>
              </li>
              <li className="group">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-2">Text us</span>
                <a href={`tel:${WHATSAPP_NUMBER}`} className="text-xl font-bold group-hover:text-brand-primary transition-all tracking-tight">{WHATSAPP_NUMBER}</a>
              </li>
            </ul>
          </div>
        </div>

       
        <div className="border-t border-white/5 pt-12">
          <div className="w-full flex flex-col md:flex-row justify-between items-center text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">
            <p>© {new Date().getFullYear()} ALL RIGHTS RESERVED.</p>

          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon: React.FC<{ icon: React.ReactNode; href: string }> = ({ icon, href }) => (
  <a href={href} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand-primary hover:text-black hover:border-brand-primary transition-all">
    {icon}
  </a>
);

export default Footer;
