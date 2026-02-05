
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { WHATSAPP_NUMBER } from '../constants';
import toast from 'react-hot-toast';

const CustomRequest: React.FC<{ isEnabled: boolean }> = ({ isEnabled }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    description: '',
    deadline: ''
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
      setIsSubmitted(true);
      toast.success('Request sent successfully!');
      const message = encodeURIComponent(
        `Hi Rwooga! I have a custom project request.\n\n` +
        `Name: ${formData.name}\n` +
        `Type: ${formData.projectType}\n` +
        `Description: ${formData.description}\n` +
        `Deadline: ${formData.deadline}`
      );
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
    }, 1000);
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
            <p className="text-gray-400 text-lg mb-8">Redirecting to WhatsApp for file handover...</p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="px-8 py-4 bg-white text-black rounded-xl font-bold hover:bg-brand-primary transition-all uppercase tracking-widest text-sm"
            >
              Submit Another
            </button>
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
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-600 focus:border-brand-primary focus:bg-white/10 outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold text-brand-primary uppercase tracking-widest ml-1">Email Address</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-600 focus:border-brand-primary focus:bg-white/10 outline-none transition-all"
                    placeholder="07xx xxx xxx"
                    title="Phone Number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label htmlFor="product-category" className="text-xs font-bold text-brand-primary uppercase tracking-widest ml-1">Product Category</label>
                  <div className="relative">
                    <select
                      id="product-category"
                      required
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-brand-primary focus:bg-white/10 outline-none transition-all appearance-none cursor-pointer"
                      title="Select Product Category"
                      aria-label="Product Category"
                    >
                      <option value="" disabled className="bg-gray-900">Select a type</option>
                      <option value="3d-visualization" className="bg-gray-900">3D Visualization</option>
                      <option value="animation" className="bg-gray-900">Animation</option>
                      <option value="custom-design" className="bg-gray-900">Custom Design</option>
                      <option value="3d-printing" className="bg-gray-900">3D Printing</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      <ArrowRight size={16} className="rotate-90" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-brand-primary uppercase tracking-widest ml-1">Desired Deadline</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-600 focus:border-brand-primary focus:bg-white/10 outline-none transition-all"
                    title="Desired Deadline"
                    placeholder="Select a date"
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
                    multiple
                    onChange={handleFileChange}
                    accept="image/*,.stl,.obj"
                    aria-label="Upload project files"
                    title="Upload project files"
                  />
                  <div className="mb-4 text-gray-400 group-hover:text-brand-primary transition-colors">
                    <Upload size={32} className="mx-auto" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Click to upload or drag files here</h3>
                  <p className="text-gray-500 text-sm">Images, Sketches, or CAD files (STL, OBJ)</p>
                </div>

                {/* Previews */}
                {selectedFiles.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 mt-6">
                    {selectedFiles.map((file, index) => (
                      <FilePreviewItem
                        key={index}
                        file={file}
                        onRemove={() => removeFile(index)}
                      />
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-brand-primary text-black font-bold text-lg py-5 rounded-2xl hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 shadow-lg shadow-brand-primary/20"
              >
                <ArrowRight size={20} />
                <span>Submit Request</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

const FilePreviewItem: React.FC<{ file: File; onRemove: () => void }> = ({ file, onRemove }) => {
  const [preview, setPreview] = useState<string | null>(null);

  React.useEffect(() => {
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/10 group"
    >
      {preview ? (
        <img src={preview} className="w-full h-full object-cover" alt="Preview" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center">
          <Upload size={20} className="text-gray-500 mb-1" />
          <span className="text-[10px] text-gray-400 truncate w-full">{file.name}</span>
        </div>
      )}
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Remove file"
        title="Remove file"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-3 h-3">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  );
};

export default CustomRequest;
