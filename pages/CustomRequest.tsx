
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Upload, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { WHATSAPP_NUMBER } from '@/constants';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { submitRequest } from '@/store/slices/requestsSlice';
import { productsService } from '@/services/productsService';
import { RootState } from '@/store';
import { useAuth } from '@/context/AuthContext';

const CustomRequest: React.FC<{ isEnabled: boolean }> = ({ isEnabled }) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    client_name: user?.full_name || user?.name || '',
    client_email: user?.email || '',
    client_phone: (user?.phone || user?.phone_number) ? String(user?.phone || user?.phone_number) : '',
    service_category: '',
    title: '',
    description: '',
    budget: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await productsService.getCategories();
        if (response.ok) {
          setCategories(response.data.results || response.data);
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    loadCategories();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append('client_name', formData.client_name.trim());
      data.append('client_email', formData.client_email.trim());

      const rawPhone = String(formData.client_phone).trim().replace(/\D/g, '');
      if (rawPhone) {
        data.append('client_phone', rawPhone);
      }

      data.append('title', formData.title.trim());
      data.append('description', formData.description.trim());

      if (formData.service_category) {
        data.append('service_category', formData.service_category);
      }

      const budgetValue = String(formData.budget).trim();
      if (budgetValue && budgetValue !== '0') {
        data.append('budget', budgetValue);
      }

      if (selectedFile && selectedFile instanceof File) {
        data.append('reference_file', selectedFile);
      }

      await (dispatch(submitRequest(data) as any)).unwrap();

      setIsSubmitted(true);
      toast.success('Request sent successfully!');
    } catch (err: any) {
      toast.error(err || 'Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isEnabled) {
    return (
      <div className="bg-brand-dark min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="max-w-2xl w-full text-center p-20 bg-white/3 rounded-[60px] border border-white/5">
          <AlertTriangle size={80} className="mx-auto text-brand-primary mb-10" />
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 uppercase tracking-tighter">Current Capacity <span className="text-gray-500">Full</span></h1>
          <p className="text-gray-400 text-lg mb-12 leading-relaxed">
            We are currently executing high-priority commissions and have temporarily paused new custom intake. Please explore our shop for ready-to-ship products.
          </p>
          <Link to="/" className="inline-block px-10 py-5 bg-white text-black rounded-full font-bold hover:bg-brand-primary transition-all uppercase tracking-widest text-sm">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-dark min-h-screen pt-40 pb-20 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-32">
          <div className="max-w-3xl">
            <span className="text-brand-primary font-bold tracking-[0.4em] uppercase text-xs mb-6 block">Bespoke Solutions</span>
            <h1 className="text-6xl md:text-[100px] font-display font-extrabold text-white leading-[0.85] tracking-tighter uppercase">
              Custom <br />
              <span className="text-gray-500">Requests</span>
            </h1>
          </div>
          <div className="max-w-md mt-8 md:mt-0">
            <p className="text-gray-400 text-lg leading-relaxed">
              Bring us your complex problems. Our engineers will handle the R&D, design, and precision manufacturing.
            </p>
          </div>
        </div>

        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto bg-white/10 p-12 rounded-[30px] border border-white/5 text-center backdrop-blur-sm"
          >
            <div className="w-20 h-20 bg-brand-primary text-black rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-brand-primary/20">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-3xl font-display font-bold text-white mb-4 uppercase tracking-tight">Request Received</h2>
            <p className="text-gray-400 text-lg mb-8">Our team will review your request shortly. You can track its status in the "My Requests" section of your account.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/my-requests"
                className="px-8 py-4 bg-brand-primary text-black rounded-xl font-bold hover:brightness-110 transition-all uppercase tracking-widest text-sm"
              >
                Track My Requests
              </Link>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    client_name: user?.full_name || user?.name || '',
                    client_email: user?.email || '',
                    client_phone: (user?.phone || user?.phone_number) ? String(user?.phone || user?.phone_number) : '',
                    service_category: '',
                    title: '',
                    description: '',
                    budget: ''
                  });
                  setSelectedFile(null);
                }}
                className="px-8 py-4 bg-white/10 text-white border border-white/10 rounded-xl font-bold hover:bg-white/20 transition-all uppercase tracking-widest text-sm"
              >
                Submit New Request
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="max-w-5xl mx-auto bg-[#111418] border border-white/5 rounded-[32px] p-8 md:p-12 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-brand-primary uppercase tracking-widest ml-1">Full Name</label>
                  <input
                    required
                    type="text"
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-600 focus:border-brand-primary focus:bg-white/10 outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold text-brand-primary uppercase tracking-widest ml-1">Email Address</label>
                  <input
                    required
                    type="email"
                    value={formData.client_email}
                    onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-600 focus:border-brand-primary focus:bg-white/10 outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-brand-primary uppercase tracking-widest ml-1">Phone Number</label>
                  <input
                    required
                    type="tel"
                    value={formData.client_phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setFormData({
                        ...formData,
                        client_phone: value
                      });
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-600 focus:border-brand-primary focus:bg-white/10 outline-none transition-all"
                    placeholder="07xx xxx xxx"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold text-brand-primary uppercase tracking-widest ml-1">Project Title</label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-600 focus:border-brand-primary focus:bg-white/10 outline-none transition-all"
                    placeholder="e.g. Prototype for agricultural drone"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label htmlFor="product-category" className="text-xs font-bold text-brand-primary uppercase tracking-widest ml-1">Service Category</label>
                  <div className="relative">
                    <select
                      id="product-category"
                      value={formData.service_category}
                      onChange={(e) => setFormData({ ...formData, service_category: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-brand-primary focus:bg-white/10 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-gray-900">General Inquiry</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id} className="bg-gray-900">
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      <ArrowRight size={16} className="rotate-90" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-brand-primary uppercase tracking-widest ml-1">Budget (RWF)</label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-600 focus:border-brand-primary focus:bg-white/10 outline-none transition-all"
                    placeholder="e.g. 50000"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-brand-primary uppercase tracking-widest ml-1">Project Description</label>
                <textarea
                  required
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-600 focus:border-brand-primary focus:bg-white/10 outline-none transition-all resize-none"
                  placeholder="Describe what you need, dimensions, materials, etc."
                />
              </div>

              {/* Upload Area */}
              <div className="space-y-6">
                <div className="relative border-2 border-dashed border-white/10 rounded-2xl p-12 text-center hover:bg-white/5 hover:border-brand-primary/50 transition-all cursor-pointer group">
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                    accept="image/*,.pdf,.stl,.obj"
                    title="Upload project files"
                  />
                  <div className="mb-4 text-gray-400 group-hover:text-brand-primary transition-colors">
                    <Upload size={32} className="mx-auto" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {selectedFile ? selectedFile.name : 'Click to upload reference file'}
                  </h3>
                  <p className="text-gray-500 text-sm">Images, PDF, STL, or OBJ</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-brand-primary text-black font-bold text-lg py-5 rounded-2xl hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 shadow-lg shadow-brand-primary/20 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
                ) : (
                  <>
                    <ArrowRight size={20} />
                    <span>Submit Request</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomRequest;
