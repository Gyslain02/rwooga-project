
import React, { useState } from 'react';
import { Send, MapPin, Phone, Mail, Clock, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { WHATSAPP_NUMBER, BRAND_EMAIL } from '../constants';
import toast from 'react-hot-toast';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Form Submitted:', formData);
    setStatus('success');
    toast.success('Message sent! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="bg-[#0a0d10] min-h-screen pt-32 pb-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">


        <div className="flex flex-col md:flex-row justify-between items-end mb-24">
          <div className="max-w-3xl">
            <span className="text-brand-primary font-bold tracking-[0.4em] uppercase text-xs mb-6 block">Get In Touch</span>
            <h1 className="text-6xl md:text-[100px] font-display font-extrabold text-white leading-[0.85] tracking-tighter uppercase">
              Let's <br />
              <span className="text-gray-500">Connect</span>
            </h1>
          </div>
          <div className="max-w-md mt-8 md:mt-0">
            <p className="text-gray-400 text-lg leading-relaxed">
              We're available for consulting and new commissions.
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start justify-center">

        
          <div className="w-full lg:w-[380px] space-y-4">
            <GlassCard variant="default" hover className="p-6 rounded-2xl">
              <ContactInfoCard
                icon={<Phone className="text-[#00d1ff]" size={20} />}
                title="Chat with us"
                description="Fastest response time via WhatsApp"
                value={WHATSAPP_NUMBER}
                href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, '')}`}
              />
            </GlassCard>
            <GlassCard variant="default" hover className="p-6 rounded-2xl">
              <ContactInfoCard
                icon={<Mail className="text-[#00d1ff]" size={20} />}
                title="Email us"
                description="For detailed inquiries and quotes"
                value={BRAND_EMAIL}
                href={`mailto:${BRAND_EMAIL}`}
              />
            </GlassCard>
            <GlassCard variant="default" hover className="p-6 rounded-2xl">
              <ContactInfoCard
                icon={<Clock className="text-brand-primary" size={20} />}
                title="Work hours"
                description="Mon - Sat: 9:00 AM - 6:00 PM"
                value="Available for urgent requests"
                isBadge
              />
            </GlassCard>
            <GlassCard variant="default" hover className="p-6 rounded-2xl">
              <ContactInfoCard
                icon={<MapPin className="text-brand-primary" size={20} />}
                title="Our Studio"
                description="Kigali, Rwanda"
                value="Visit by appointment"
              />
            </GlassCard>
          </div>

          {/* Right Section: Form Card */}
          <GlassCard className="w-full lg:max-w-[750px] p-8 md:p-12 rounded-[32px] shadow-2xl" variant="strong" hover>
            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Message Sent!</h2>
                <p className="text-gray-400 mb-8 max-w-sm mx-auto">We've received your inquiry and will get back to you as soon as possible.</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Full Name"
                    value={formData.name}
                    onChange={(v) => setFormData({ ...formData, name: v })}
                    placeholder="John Doe"
                    required
                  />
                  <FormInput
                    label="Email Address"
                    value={formData.email}
                    onChange={(v) => setFormData({ ...formData, email: v })}
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <FormInput
                  label="Subject"
                  value={formData.subject}
                  onChange={(v) => setFormData({ ...formData, subject: v })}
                  placeholder="Project Inquiry"
                  required
                />

                <div className="space-y-3">
                  <div className="text-sm font-bold text-gray-300">
                    Message
                  </div>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we help you?"
                    className="glass-textarea w-full h-[200px] md:h-[250px]"
                  />
                </div>

                <div className="pt-4">
                  <GlassButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={status === 'submitting'}
                    disabled={status === 'submitting'}
                    icon={<Send size={22} />}
                    className="w-full"
                  >
                    {status === 'submitting' ? 'Sending...' : 'Send Message'}
                  </GlassButton>
                </div>
              </form>
            )}
          </GlassCard>
        </div>

      </div>

      {/* Studio Location (Map) - Full Size */}
      <div className="mt-32 h-[500px] md:h-[700px] w-full border-t border-white/5 grayscale hover:grayscale-0 transition-all duration-1000 shadow-2xl">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127602.40939515514!2d30.0125868!3d-1.930128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca429ed308f25%3A0x103681432f80164e!2sKigali!5e0!3m2!1sen!2srw!4v1714123456789!5m2!1sen!2srw"
          width="100%"
          height="100%"
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
          title="Rwooga Studio Location - Kigali, Rwanda"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

const ContactInfoCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  value: string;
  href?: string;
  isBadge?: boolean;
}> = ({ icon, title, description, value, href, isBadge }) => (
  <div className="flex items-start gap-4">
    <div className="w-12 h-12 bg-[#1c232b] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#252e38] transition-colors">
      {icon}
    </div>
    <div className="space-y-1">
      <h3 className="text-white font-bold leading-none">{title}</h3>
      <p className="text-gray-500 text-sm">{description}</p>
      {href ? (
        <a href={href} className="block text-brand-primary font-bold hover:underline underline-offset-4 decoration-2">
          {value}
        </a>
      ) : (
        <p className={`font-bold ${isBadge ? 'text-emerald-400' : 'text-white'}`}>
          {value}
        </p>
      )}
    </div>
  </div>
);

const FormInput: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  required?: boolean;
}> = ({ label, value, onChange, placeholder, required }) => (
  <div className="space-y-2">
    <label className="block text-sm font-bold text-gray-300">
      {label} {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="glass-input w-full"
      required={required}
    />
  </div>
);

export default Contact;
