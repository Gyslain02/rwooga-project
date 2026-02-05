import React, { useState, useEffect } from 'react'
import {
  ToggleLeft, ToggleRight,
  ShieldCheck, ShoppingCart,
  MessageSquare, Files,
  Trash2, Edit2, Plus, X, Save,
  LayoutDashboard, Briefcase, ShoppingBag, ClipboardList, Settings,
  Search, Bell, Download, Monitor, CheckCircle2, AlertCircle,
  Truck, MessageCircle, MoreVertical, Menu
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

const Admin = ({ user, handleLogout, isEnabled, onToggle }: { user: any, handleLogout: () => void, isEnabled: boolean, onToggle: (val: boolean) => void }) => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [customRequests, setCustomRequests] = useState([])
  const [contactMessages, setContactMessages] = useState([])
  const [products, setProducts] = useState([])
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    description: '',
    available: true
  })

  const printers = [
    { name: 'ENDER 3 PRO (A1)', status: '85% COMPLETE', progress: 85, color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
    { name: 'PRUSA MK3S (B1)', status: 'IDLE', progress: 100, color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
    { name: 'FORMLABS 3 (C1)', status: 'HEATING', progress: 100, color: 'text-brand-orange', bg: 'bg-brand-orange/10' },
  ]


  useEffect(() => {


    const requests = JSON.parse(localStorage.getItem('custom_requests') || '[]')
    const messages = JSON.parse(localStorage.getItem('contact_messages') || '[]')
    const savedProducts = JSON.parse(localStorage.getItem('rwooga_products') || '[]')

    setCustomRequests(requests)
    setContactMessages(messages)
    setProducts(savedProducts)
  }, [])



  const deleteRequest = (id: string | number) => {
    const updated = customRequests.filter((r: any) => r.id !== id)
    setCustomRequests(updated)
    localStorage.setItem('custom_requests', JSON.stringify(updated))
    toast.success('Request deleted')
  }

  const deleteMessage = (id: string | number) => {
    const updated = contactMessages.filter((m: any) => m.id !== id)
    setContactMessages(updated)
    localStorage.setItem('contact_messages', JSON.stringify(updated))
    toast.success('Message deleted')
  }

  const deleteProduct = (id: string | number) => {
    const updated = products.filter((p: any) => p.id !== id)
    setProducts(updated)
    localStorage.setItem('rwooga_products', JSON.stringify(updated))
    toast.success('Product deleted')
  }

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newProduct = {
      id: editingProduct ? (editingProduct as any).id : Date.now(),
      name: productForm.name,
      price: parseInt(productForm.price),
      description: productForm.description,
      available: productForm.available,
      image: 'placeholder'
    }

    let updated
    if (editingProduct) {
      updated = products.map((p: any) => p.id === (editingProduct as any).id ? newProduct : p)
      setEditingProduct(null)
    } else {
      updated = [...products, newProduct]
    }

    setProducts(updated)
    localStorage.setItem('rwooga_products', JSON.stringify(updated))
    setProductForm({ name: '', price: '', description: '', available: true })
    setShowProductForm(false)
    toast.success(editingProduct ? 'Product updated' : 'Product created')
  }

  const editProduct = (product: any) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      available: product.available
    })
    setShowProductForm(true)
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden lg:static">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 bg-white border-r border-gray-100 flex flex-col items-center py-8 z-50 transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between w-full px-6 mb-12">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-primary/20">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="text-lg font-display font-black text-slate-800 leading-none">Rwooga Admin</h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Management Portal</p>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-500" aria-label="Close sidebar" title="Close sidebar">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 w-full space-y-2 px-3">
          <SidebarLink active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }} icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <SidebarLink active={activeTab === 'products'} onClick={() => { setActiveTab('products'); setIsSidebarOpen(false); }} icon={<Briefcase size={20} />} label="Products" />
          <SidebarLink active={activeTab === 'orders'} onClick={() => { setActiveTab('orders'); setIsSidebarOpen(false); }} icon={<ShoppingBag size={20} />} label="Shop Orders" />
          <SidebarLink active={activeTab === 'requests'} onClick={() => { setActiveTab('requests'); setIsSidebarOpen(false); }} icon={<ClipboardList size={20} />} label="Custom Requests" />
          <SidebarLink active={activeTab === 'messages'} onClick={() => { setActiveTab('messages'); setIsSidebarOpen(false); }} icon={<MessageSquare size={20} />} label="Contact Messages" />
          <SidebarLink active={activeTab === 'settings'} onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }} icon={<Settings size={20} />} label="Settings" />
        </nav>

        <div className="mt-auto px-6 w-full pt-8 border-t border-gray-50 flex flex-col space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-brand-primary">
              <ShieldCheck size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">{user?.name || 'Admin User'}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">{user?.role || 'Super Admin'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-all flex items-center justify-center gap-2"
            title="Logout session"
          >
            <Plus className="rotate-45" size={14} />
            LOGOUT SESSION
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full">
        {/* Top Navigation */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 bg-slate-100 rounded-xl text-slate-600" aria-label="Open sidebar" title="Open sidebar">
              <Menu size={20} />
            </button>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-slate-800 capitalize leading-tight">{activeTab}</h2>
              <p className="text-[10px] md:text-xs text-slate-500 hidden sm:block">Overview feedback & stats</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-6">
            <div className="relative group hidden xl:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-primary transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search orders, clients..."
                className="bg-slate-100 border-none rounded-xl py-2 pl-10 pr-4 text-sm w-48 2xl:w-64 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
              />
            </div>

            <div className="flex items-center space-x-3 bg-slate-100 rounded-xl px-3 md:px-4 py-1.5 md:py-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest hidden sm:block">Status</span>
              <div className={`flex items-center space-x-2 px-2 md:px-3 py-0.5 md:py-1 rounded-lg ${isEnabled ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${isEnabled ? 'bg-brand-primary' : 'bg-red-500'} animate-pulse`} />
                <span className="text-[10px] font-black uppercase">{isEnabled ? 'On' : 'Off'}</span>
              </div>
              <button
                onClick={() => onToggle(!isEnabled)}
                className={`w-8 md:w-12 h-4 md:h-6 rounded-full relative transition-all ${isEnabled ? 'bg-brand-primary' : 'bg-slate-300'}`}
                aria-label="Toggle public service mode"
                title="Toggle public service mode"
              >
                <div className={`absolute top-0.5 md:top-1 w-3 md:w-4 h-3 md:h-4 bg-white rounded-full transition-all ${isEnabled ? 'left-4.5 md:left-7' : 'left-0.5 md:left-1'}`} />
              </button>
            </div>

            <button className="w-10 h-10 rounded-xl border border-gray-100 hidden md:flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-all" aria-label="Notifications" title="Notifications">
              <Bell size={20} />
            </button>

            <button
              onClick={() => {
                setActiveTab('products')
                setShowProductForm(true)
              }}
              className="bg-brand-primary text-white p-2.5 md:px-6 md:py-2.5 rounded-xl font-bold flex items-center space-x-2 shadow-lg shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Plus size={18} />
              <span className="hidden md:block">New Project</span>
            </button>
          </div>
        </header>

        <div className="p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Highlight Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DashboardStat
                  label="Total Revenue"
                  value="RWF 2,450,000"
                  trend="+12.5% vs last month"
                  icon={<ShoppingBag className="text-brand-primary" />}
                  bg="bg-emerald-50"
                />
                <DashboardStat
                  label="Active Projects"
                  value="14"
                  trend="5 machines running"
                  icon={<Monitor className="text-brand-primary" />}
                  bg="bg-brand-primary/10"
                />
                <DashboardStat
                  label="Pending Requests"
                  value={customRequests.length.toString()}
                  trend="Requires review"
                  icon={<ClipboardList className="text-brand-orange" />}
                  bg="bg-brand-orange/10"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Custom Requests */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-bold text-slate-800">Recent Custom Requests</h3>
                    <button onClick={() => setActiveTab('requests')} className="text-xs font-bold text-brand-primary hover:underline">View All Requests</button>
                  </div>

                  <div className="overflow-x-auto -mx-8 px-8">
                    <table className="w-full min-w-[600px]">
                      <thead>
                        <tr className="border-b border-gray-50 text-left">
                          <th className="py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Client Name</th>
                          <th className="py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Service Type</th>
                          <th className="py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Design File</th>
                          <th className="py-4 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {customRequests.slice(0, 5).map((req: any) => (
                          <tr key={req.id} className="group hover:bg-slate-50 transition-all rounded-xl overflow-hidden">
                            <td className="py-5">
                              <p className="font-bold text-slate-800">{req.name}</p>
                              <p className="text-[10px] text-slate-500">{req.email}</p>
                            </td>
                            <td className="py-5">
                              <span className="px-3 py-1 rounded-lg bg-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase">{req.projectType}</span>
                            </td>
                            <td className="py-5">
                              <p className="text-xs text-slate-500 font-medium truncate max-w-[150px]">{req.files?.[0] || 'No file attached'}</p>
                            </td>
                            <td className="py-5 text-right">
                              <button className="bg-slate-100 hover:bg-brand-primary hover:text-white p-2 rounded-lg text-slate-500 transition-all" aria-label="Download file" title="Download file">
                                <Download size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {customRequests.length === 0 && (
                          <tr><td colSpan={4} className="py-12 text-center text-slate-500 text-sm">No recent requests</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Shop Orders Highlight */}
                  <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-lg font-bold text-slate-800">Shop Orders</h3>
                      <button onClick={() => setActiveTab('orders')} className="text-slate-500 hover:text-slate-600 transition-colors" aria-label="More options" title="More options">
                        <MoreVertical size={20} />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {products.slice(0, 2).map((p: any, idx) => (
                        <div key={idx} className="flex items-center justify-between group p-2 hover:bg-slate-50 rounded-2xl transition-all">
                          <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                              <ShoppingCart size={24} />
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 text-sm">Order #R-{9021 - idx}</p>
                              <p className="text-[10px] text-slate-500">{p.name}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-slate-800 text-sm">{p.price.toLocaleString()} </p>
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg ${idx === 0 ? 'bg-orange-50 text-orange-500' : 'bg-emerald-50 text-brand-primary'}`}>
                              {idx === 0 ? 'Shipping' : 'Delivered'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Printer Fleet Status */}
                  <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-8">Printer Fleet Status</h3>
                    <div className="space-y-6">
                      {printers.map((printer, idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                            <span>{printer.name}</span>
                            <span className={printer.color}>{printer.status}</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all ${printer.color === 'text-brand-primary' ? 'bg-brand-primary' : printer.color === 'text-brand-primary' ? 'bg-brand-primary' : 'bg-brand-orange'} ${printer.progress === 85 ? 'w-[85%]' : 'w-full'}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="w-full mt-10 py-3 border border-gray-100 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                      Manage Fleet Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="bg-white p-6 md:p-10 rounded-[32px] md:rounded-[40px] border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-5 duration-500">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-1">Catalog Management</h2>
                  <p className="text-sm text-slate-500">Manage your online store items and availability</p>
                </div>
                {!showProductForm && (
                  <button
                    onClick={() => {
                      setShowProductForm(true)
                      setEditingProduct(null)
                      setProductForm({ name: '', price: '', description: '', available: true })
                    }}
                    className="flex items-center space-x-2 px-6 py-3 bg-brand-primary text-white rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-brand-primary/20"
                  >
                    <Plus size={20} />
                    <span>Add Product</span>
                  </button>
                )}
              </div>

              {showProductForm && (
                <motion.form
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleProductSubmit}
                  className="mb-12 p-6 md:p-8 bg-slate-50 rounded-[32px] border border-gray-100"
                >
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest">{editingProduct ? 'Edit Product' : 'New Product'}</h3>
                    <button type="button" onClick={() => setShowProductForm(false)} className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-slate-500 hover:text-red-500 transition-all" aria-label="Close form" title="Close form">
                      <X size={20} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Product Name</label>
                      <input
                        type="text"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        className="w-full bg-white px-5 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all placeholder:text-slate-300"
                        placeholder="e.g., 3D Printed Chess Set"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Price (RWF)</label>
                      <input
                        type="number"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        className="w-full bg-white px-5 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                        placeholder="50,000"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Description</label>
                      <textarea
                        rows={4}
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        className="w-full bg-white px-5 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                        placeholder="Detail about the product material, size, and use..."
                        required
                      />
                    </div>
                    <div className="flex items-center space-x-4 bg-white p-4 rounded-2xl border border-gray-100">
                      <input
                        type="checkbox"
                        id="available"
                        checked={productForm.available}
                        onChange={(e) => setProductForm({ ...productForm, available: e.target.checked })}
                        className="w-6 h-6 accent-brand-primary rounded-lg"
                      />
                      <label htmlFor="available" className="text-sm font-bold text-slate-800">Available for Purchase</label>
                    </div>
                  </div>
                  <div className="mt-10 flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowProductForm(false)}
                      className="px-8 py-4 text-slate-500 font-bold hover:text-slate-700 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center space-x-2 px-10 py-4 bg-brand-primary text-white rounded-2xl font-bold shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      <Save size={22} />
                      <span>{editingProduct ? 'Update Product' : 'Save Item'}</span>
                    </button>
                  </div>
                </motion.form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {products.length === 0 ? (
                  <div className="col-span-2 text-center py-20 bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                      <ShoppingBag className="text-slate-300" size={32} />
                    </div>
                    <p className="text-slate-500 font-bold">No products listed in the shop yet.</p>
                  </div>
                ) : (
                  products.map((p: any) => (
                    <motion.div
                      key={p.id}
                      layout
                      className="group bg-white p-6 rounded-[32px] border border-slate-100 hover:border-brand-primary/30 hover:shadow-xl transition-all relative"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300">
                          <ShoppingBag size={28} />
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => editProduct(p)}
                            className="bg-slate-50 text-slate-500 hover:text-brand-primary hover:bg-brand-primary/10 p-2.5 rounded-xl transition-all"
                            aria-label="Edit product"
                            title="Edit product"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="bg-slate-50 text-slate-500 hover:text-red-500 hover:bg-red-50/50 p-2.5 rounded-xl transition-all"
                            aria-label="Delete product"
                            title="Delete product"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-slate-800 mb-2">{p.name}</h3>
                      <p className="text-sm text-slate-500 mb-6 leading-relaxed line-clamp-2">{p.description}</p>

                      <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                        <span className="text-lg font-black text-slate-800">{p.price.toLocaleString()} <span className="text-xs font-bold text-slate-500">RWF</span></span>
                        <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${p.available ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${p.available ? 'bg-brand-primary' : 'bg-red-500'}`} />
                          <span className="text-[10px] font-black uppercase tracking-wider">{p.available ? 'In Stock' : 'Sold Out'}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          )}

          {(activeTab === 'requests' || activeTab === 'messages') && (
            <div className="bg-white rounded-[32px] md:rounded-[40px] border border-gray-100 p-6 md:p-10 shadow-sm min-h-[500px]">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">{activeTab === 'requests' ? 'Custom Requests' : 'Direct Messages'}</h2>
                  <p className="text-sm text-slate-500">Handle client inquiries and project submissions</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-xl md:rounded-2xl overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('requests')}
                    className={`px-4 md:px-6 py-2 md:py-2.5 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black uppercase whitespace-nowrap transition-all ${activeTab === 'requests' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-600'}`}
                  >
                    Requests ({customRequests.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('messages')}
                    className={`px-4 md:px-6 py-2 md:py-2.5 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black uppercase whitespace-nowrap transition-all ${activeTab === 'messages' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-600'}`}
                  >
                    Messages ({contactMessages.length})
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {activeTab === 'requests' ? (
                  customRequests.length === 0 ? (
                    <EmptyState icon={<ClipboardList size={40} />} text="No project requests yet." />
                  ) : (
                    customRequests.map((r: any) => (
                      <ProjectRequestCard key={r.id} request={r} onDelete={() => deleteRequest(r.id)} />
                    ))
                  )
                ) : (
                  contactMessages.length === 0 ? (
                    <EmptyState icon={<MessageSquare size={40} />} text="Your inbox is empty." />
                  ) : (
                    contactMessages.map((m: any) => (
                      <div key={m.id} className="p-8 bg-slate-50 rounded-[32px] border border-gray-100 group relative">
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-orange shadow-sm">
                              <MessageSquare size={24} />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-slate-800">{m.subject}</h3>
                              <p className="text-xs text-slate-500">From {m.name} • {m.email}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => deleteMessage(m.id)}
                            className="w-10 h-10 bg-white text-slate-300 hover:text-red-500 rounded-xl flex items-center justify-center border border-gray-100 transition-all opacity-0 group-hover:opacity-100"
                            aria-label="Delete message"
                            title="Delete message"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 text-sm text-slate-600 leading-relaxed shadow-sm">
                          {m.message}
                        </div>
                        <div className="flex items-center justify-between mt-6">
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Received {new Date(m.date).toLocaleDateString()}</span>
                          <button className="flex items-center space-x-2 text-xs font-bold text-brand-primary hover:underline">
                            <MessageCircle size={14} />
                            <span>Reply to Client</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )
                )}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white rounded-[32px] md:rounded-[40px] border border-gray-100 p-6 md:p-10 shadow-sm text-center py-20 md:py-32">
              <ShoppingBag className="mx-auto text-slate-200 mb-6" size={64} />
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Order Tracking System</h3>
              <p className="text-slate-500 max-w-sm mx-auto">This complex logistics module is currently being integrated with our carrier APIs. Status updates will appear here soon.</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl bg-white rounded-[32px] md:rounded-[40px] border border-gray-100 p-6 md:p-10 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-800 mb-8">System Settings</h2>
              <div className="space-y-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800">Public Service Mode</p>
                    <p className="text-xs text-slate-500">Visibility of "Quick Quote" buttons</p>
                  </div>
                  <button
                    onClick={() => onToggle(!isEnabled)}
                    className={`w-14 h-8 rounded-full relative transition-all ${isEnabled ? 'bg-brand-primary' : 'bg-slate-300'}`}
                    aria-label="Toggle public service mode"
                    title="Toggle public service mode"
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${isEnabled ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>

                <div className="p-8 bg-slate-50 rounded-3xl border border-gray-100">
                  <h4 className="font-bold text-slate-800 mb-4 flex items-center">
                    <ShieldCheck className="mr-2 text-brand-primary" size={18} /> Critical Access
                  </h4>
                  <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                    Modify root administrative credentials and system API keys. This action requires secondary authentication.
                  </p>
                  <button className="bg-white text-slate-800 px-8 py-3 rounded-2xl font-bold text-xs border border-gray-100 hover:bg-slate-100 transition-all shadow-sm">
                    Re-authenticate Session
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

const SidebarLink: React.FC<{ active: boolean; icon: React.ReactNode; label: string; onClick: () => void }> = ({ active, icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-6 py-4 rounded-2xl font-bold transition-all ${active ? 'bg-brand-primary/10 text-brand-primary' : 'text-slate-500 hover:text-slate-600 hover:bg-slate-50'}`}
  >
    {icon}
    <span className="text-sm">{label}</span>
  </button>
)

const DashboardStat: React.FC<{ label: string; value: string; trend: string; icon: React.ReactNode; bg: string }> = ({ label, value, trend, icon, bg }) => (
  <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm flex flex-col justify-between">
    <div className="flex justify-between items-start mb-6">
      <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center bg-opacity-100 transition-transform hover:scale-110 duration-500`}>
        {icon}
      </div>
      {(label === "Total Revenue") && <div className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded-full">LIVE</div>}
    </div>
    <div>
      <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
      <div className="flex items-baseline space-x-2">
        <h4 className="text-3xl font-display font-black text-slate-800">{value}</h4>
      </div>
      <p className="text-[10px] font-bold text-slate-500 mt-2 flex items-center">
        {trend.includes('+') ? <CheckCircle2 size={12} className="text-brand-primary mr-1" /> : (label === "Pending Requests") ? <AlertCircle size={12} className="text-brand-orange mr-1" /> : <div className="w-1.5 h-1.5 bg-brand-primary rounded-full mr-1" />}
        {trend}
      </p>
    </div>
  </div>
)

const ProjectRequestCard: React.FC<{ request: any; onDelete: () => void }> = ({ request, onDelete }) => (
  <div className="p-8 bg-slate-50 rounded-[40px] border border-gray-100 group">
    <div className="flex justify-between items-start mb-8">
      <div className="flex items-center space-x-6">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-brand-primary shadow-sm">
          <Files size={28} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800 leading-tight">{request.name}</h3>
          <p className="text-xs text-brand-primary font-black uppercase tracking-widest mt-1">{request.projectType}</p>
        </div>
      </div>
      <button onClick={onDelete} className="w-10 h-10 bg-white text-slate-300 hover:text-red-500 rounded-xl flex items-center justify-center border border-gray-100 transition-all" aria-label="Delete request" title="Delete request">
        <Trash2 size={20} />
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <RequestDetail label="Email Address" value={request.email} />
      <RequestDetail label="Phone Number" value={request.phone} />
      <RequestDetail label="Submitted On" value={new Date(request.date).toLocaleDateString()} />
    </div>

    <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm mb-8">
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Project Requirement</p>
      <p className="text-sm text-slate-600 leading-relaxed">{request.description}</p>
    </div>

    {request.files && request.files.length > 0 && (
      <div className="flex flex-wrap gap-4 items-center">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">Attached Files:</span>
        {request.files.map((f: string, idx: number) => (
          <button key={idx} className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl border border-gray-100 hover:border-brand-primary/30 text-[10px] font-bold text-slate-600 transition-all shadow-sm" aria-label={`Download ${f}`} title={`Download ${f}`}>
            <Download size={14} className="text-brand-primary" />
            <span className="truncate max-w-[120px]">{f}</span>
          </button>
        ))}
      </div>
    )}
  </div>
)

const RequestDetail: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-sm font-bold text-slate-800">{value}</p>
  </div>
)

const EmptyState = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
  <div className="text-center py-20 bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 shadow-sm">
      {icon}
    </div>
    <p className="text-slate-500 font-bold">{text}</p>
  </div>
)

export default Admin
