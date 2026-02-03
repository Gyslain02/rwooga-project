import React, { useState, useEffect } from 'react'
import {
  ToggleLeft, ToggleRight,
  ShieldCheck, ShoppingCart,
  MessageSquare, Files,
  Trash2, Edit2, Plus, X, Save
} from 'lucide-react'
import toast from 'react-hot-toast'

const Admin = () => {
  const [isEnabled, setIsEnabled] = useState(true)
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

  // Load data from localStorage
  useEffect(() => {
    const status = localStorage.getItem('custom_printing_enabled')
    if (status !== null) {
      setIsEnabled(status === 'true')
    }

    const requests = JSON.parse(localStorage.getItem('custom_requests') || '[]')
    const messages = JSON.parse(localStorage.getItem('contact_messages') || '[]')
    const savedProducts = JSON.parse(localStorage.getItem('rwooga_products') || '[]')

    setCustomRequests(requests)
    setContactMessages(messages)
    setProducts(savedProducts)
  }, [])

  const handleToggle = (val: boolean) => {
    setIsEnabled(val)
    localStorage.setItem('custom_printing_enabled', val.toString())
    toast.success(`Custom printing service ${val ? 'enabled' : 'disabled'}`)
  }

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
    <div className="py-20 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-12">
          <div className="w-16 h-16 bg-brand-dark text-white rounded-2xl flex items-center justify-center">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-brand-dark">Store Management</h1>
            <p className="text-gray-500 text-lg">System Controls & Service Toggles</p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Main Toggle */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 col-span-1 md:col-span-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-md">
                <h3 className="text-xl font-bold text-brand-dark mb-2">Custom Printing Service</h3>
                <p className="text-gray-600">
                  Enable or disable the "Custom Request" page and buttons across the website.
                  Turn this off when capacity is full.
                </p>
              </div>
              <button
                onClick={() => handleToggle(!isEnabled)}
                className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-bold transition-all ${isEnabled
                  ? 'bg-brand-cyan text-white shadow-lg shadow-cyan-100'
                  : 'bg-gray-200 text-gray-500'
                  }`}
              >
                {isEnabled ? (
                  <>
                    <span>Service Active</span>
                    <ToggleRight size={32} />
                  </>
                ) : (
                  <>
                    <span>Service Paused</span>
                    <ToggleLeft size={32} />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <AdminStat icon={<ShoppingCart className="text-blue-500" />} label="Shop Products" value={products.length.toString()} />
          <AdminStat icon={<Files className="text-brand-cyan" />} label="Custom Requests" value={customRequests.length.toString()} />
          <AdminStat icon={<MessageSquare className="text-brand-orange" />} label="Unread Messages" value={contactMessages.length.toString()} />

          {/* Access Card */}
          <div className="bg-brand-dark p-8 rounded-3xl text-white">
            <h4 className="font-bold mb-4 flex items-center">
              <ShieldCheck className="mr-2" size={18} /> Admin Access
            </h4>
            <p className="text-emerald-100/60 text-sm mb-6 leading-relaxed">
              This panel is for administrative purposes. Only authorized team members should modify these settings.
            </p>
            <button className="w-full bg-white/10 hover:bg-white/20 py-3 rounded-xl font-bold text-sm transition-all">
              Change Credentials
            </button>
          </div>
        </div>

        {/* --- Data Sections --- */}
        <div className="mt-16 space-y-12 pb-20">
          {/* Shop Products Section */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-brand-dark mb-1">Shop Products</h2>
                <p className="text-gray-500">Manage your online store items</p>
              </div>
              <button
                onClick={() => {
                  setShowProductForm(true)
                  setEditingProduct(null)
                  setProductForm({ name: '', price: '', description: '', available: true })
                }}
                className="flex items-center space-x-2 px-6 py-3 bg-brand-dark text-white rounded-xl font-bold hover:bg-gray-800 transition-all"
              >
                <Plus size={20} />
                <span>Add Product</span>
              </button>
            </div>

            {showProductForm && (
              <form onSubmit={handleProductSubmit} className="mb-10 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-brand-dark">{editingProduct ? 'Edit Product' : 'New Product'}</h3>
                  <button type="button" onClick={() => setShowProductForm(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={20} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-cyan outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Price (RWF)</label>
                    <input
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-cyan outline-none transition-all"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                    <textarea
                      rows={3}
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-cyan outline-none transition-all"
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="available"
                      checked={productForm.available}
                      onChange={(e) => setProductForm({ ...productForm, available: e.target.checked })}
                      className="w-5 h-5 accent-brand-cyan"
                    />
                    <label htmlFor="available" className="text-sm font-bold text-gray-700">Available in Shop</label>
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center space-x-2 px-8 py-3 bg-brand-cyan text-white rounded-xl font-bold shadow-lg shadow-cyan-100 hover:opacity-90 transition-all"
                  >
                    <Save size={20} />
                    <span>{editingProduct ? 'Update Product' : 'Save Product'}</span>
                  </button>
                </div>
              </form>
            )}

            {products.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <ShoppingCart className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-gray-400">No products listed in the shop yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {products.map((p: any) => (
                  <div key={p.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-brand-cyan transition-all">
                    <div>
                      <h3 className="text-lg font-bold text-brand-dark mb-1">{p.name}</h3>
                      <p className="text-sm text-gray-500 mb-2 max-w-xl">{p.description}</p>
                      <div className="flex items-center space-x-4">
                        <span className="text-brand-cyan font-bold">{p.price.toLocaleString()} RWF</span>
                        <span className={`text-[10px] uppercase tracking-wider font-black px-2 py-0.5 rounded-full ${p.available ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                          {p.available ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 mt-4 md:mt-0">
                      <button
                        onClick={() => editProduct(p)}
                        className="p-3 bg-white text-gray-400 hover:text-brand-cyan rounded-xl border border-gray-100 transition-all shadow-sm"
                        title="Edit Product"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="p-3 bg-white text-gray-400 hover:text-red-500 rounded-xl border border-gray-100 transition-all shadow-sm"
                        title="Delete Product"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Custom Requests */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-brand-dark mb-6">Custom Design Requests</h2>
            {customRequests.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <Files className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-gray-400">No custom requests submitted yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {customRequests.map((r: any) => (
                  <div key={r.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-brand-dark">{r.name}</h3>
                        <p className="text-brand-cyan text-sm font-semibold">{r.projectType}</p>
                      </div>
                      <button
                        onClick={() => deleteRequest(r.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 mb-4 text-sm">
                      <p className="text-gray-600"><span className="text-gray-400 font-medium mr-2">Email:</span> {r.email}</p>
                      <p className="text-gray-600"><span className="text-gray-400 font-medium mr-2">Phone:</span> {r.phone}</p>
                      <p className="text-gray-600"><span className="text-gray-400 font-medium mr-2">Date:</span> {new Date(r.date).toLocaleDateString()}</p>
                      {r.deadline && <p className="text-gray-600"><span className="text-gray-400 font-medium mr-2">Deadline:</span> {r.deadline}</p>}
                      {r.budget && <p className="text-gray-600"><span className="text-gray-400 font-medium mr-2">Budget:</span> {r.budget}</p>}
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100">
                      <p className="text-sm font-bold text-gray-700 mb-1">Description:</p>
                      <p className="text-sm text-gray-600 leading-relaxed">{r.description}</p>
                    </div>
                    {r.files && r.files.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {r.files.map((f: string, idx: number) => (
                          <span key={idx} className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">
                            {f}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contact Messages */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-brand-dark mb-6">Unread Messages</h2>
            {contactMessages.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <MessageSquare className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-gray-400">No messages in your inbox.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {contactMessages.map((m: any) => (
                  <div key={m.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-brand-dark">{m.subject}</h3>
                        <p className="text-gray-400 text-sm">From {m.name} • {m.email} {m.phone && `• ${m.phone}`}</p>
                      </div>
                      <button
                        onClick={() => deleteMessage(m.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed bg-white p-4 rounded-xl border border-gray-100">
                      {m.message}
                    </p>
                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-4">
                      Received {new Date(m.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

const AdminStat = ({ icon, label, value }) => (
  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <span className="font-bold text-gray-500 uppercase text-xs tracking-wider">{label}</span>
    </div>
    <span className="text-3xl font-display font-bold text-brand-dark">{value}</span>
  </div>
)

export default Admin
