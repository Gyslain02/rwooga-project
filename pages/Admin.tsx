import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ToggleLeft, ToggleRight,
  ShieldCheck, ShoppingCart,
  MessageSquare, Files,
  Trash2, Edit2, Plus, X, Save,
  LayoutDashboard, Briefcase, ShoppingBag, ClipboardList, Settings,
  Search, Bell, Download, Monitor, CheckCircle2, AlertCircle,
  Truck, MessageCircle, MoreVertical, Menu, Moon, Sun, Users as UsersIcon, UserPlus, Filter,
  Mail, Phone, LogOut, Home, Upload, Image as ImageIcon
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import logo from '@/assets/Rwooga logo.png'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store'
import { addProduct, updateProduct, deleteProduct as removeProduct } from '@/store/slices/productsSlice'
import { deleteRequest as removeRequest } from '@/store/slices/requestsSlice'
import { setAdminTheme } from '@/store/slices/settingsSlice'
import {
  fetchUsers,
  addUser,
  editUser,
  removeUser,
  toggleUserStatus,
  clearUserError
} from '@/store/slices/usersSlice';
import UserModal from '@/components/UserModal'
import DeleteConfirmModal from '@/components/DeleteConfirmModal'
import { adminProductService } from '@/services/adminProductService'
import { productsService } from '@/services/productsService'

const Admin = ({ user, handleLogout, isEnabled, onToggle }: { user: any, handleLogout: () => void, isEnabled: boolean, onToggle: (val: boolean) => void }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const activeTabFromStore = 'dashboard' // Keep as local state if simple, or move to slice if needed
  const [activeTab, setActiveTab] = useState('dashboard')
  const { adminTheme: theme } = useSelector((state: RootState) => state.settings)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { items: customRequests } = useSelector((state: RootState) => state.requests)
  const { items: products } = useSelector((state: RootState) => state.products)

  // Product Management State
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    short_description: '',
    detailed_description: '',
    unit_price: '',
    available_colors: '',
    available_materials: '',
    published: true,
    length: '',
    width: '',
    height: ''
  })
  const [productImages, setProductImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [existingImages, setExistingImages] = useState<any[]>([])
  const [mainImageIndex, setMainImageIndex] = useState<number>(0)
  const [categories, setCategories] = useState<any[]>([])
  const [adminProducts, setAdminProducts] = useState<any[]>([])
  const [productsLoading, setProductsLoading] = useState(false)

  // Category Management State
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    requires_dimensions: false,
    requires_material: false,
    pricing_type: 'custom',
    is_active: true
  })
  const [categoriesLoading, setCategoriesLoading] = useState(false)

  // Users Management State
  const { users, count, loading: usersLoading } = useSelector((state: RootState) => state.users)
  const [userSearch, setUserSearch] = useState('')
  const [userPage, setUserPage] = useState(1)
  const usersPerPage = 5
  const [showUserModal, setShowUserModal] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [userToDelete, setUserToDelete] = useState<any>(null)

  // Initial load - fetch users, categories, and products
  useEffect(() => {
    dispatch(fetchUsers({ page: userPage, search: userSearch }) as any)
    loadCategories()
    loadProducts()
  }, [dispatch, userPage, userSearch])

  // Load categories for product form
  const loadCategories = async () => {
    try {
      const response = await productsService.getCategories()
      if (response.ok && response.data) {
        const categoriesList = response.data.results || response.data
        setCategories(categoriesList.filter((cat: any) => cat.is_active))
      }
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  // Load all products (including unpublished for admin)
  const loadProducts = async () => {
    try {
      setProductsLoading(true)
      const response = await adminProductService.getAllProducts()
      if (response.ok && response.data) {
        const productsList = response.data.results || response.data
        setAdminProducts(productsList)
      }
    } catch (error) {
      console.error('Error loading products:', error)
      toast.error('Failed to load products')
    } finally {
      setProductsLoading(false)
    }
  }

  // Category Management Functions
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = editingCategory
        ? await productsService.updateCategory(editingCategory.id, categoryForm)
        : await productsService.createCategory(categoryForm)

      if (response.ok) {
        toast.success(editingCategory ? 'Category updated successfully' : 'Category created successfully')
        setShowCategoryForm(false)
        resetCategoryForm()
        loadCategories()
      } else {
        toast.error('Failed to save category')
      }
    } catch (error: any) {
      console.error('Error saving category:', error)
      toast.error(error.message || 'Failed to save category')
    }
  }

  const editCategory = (category: any) => {
    setEditingCategory(category)
    setCategoryForm({
      name: category.name,
      description: category.description || '',
      requires_dimensions: category.requires_dimensions || false,
      requires_material: category.requires_material || false,
      pricing_type: category.pricing_type || 'custom',
      is_active: category.is_active !== undefined ? category.is_active : true
    })
    setShowCategoryForm(true)
  }

  const deleteCategory = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this category? This may affect products using this category.')
    if (!confirmed) return

    try {
      const response = await productsService.deleteCategory(id)
      if (response.ok) {
        toast.success('Category deleted successfully')
        loadCategories()
      } else {
        toast.error('Failed to delete category')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error('Failed to delete category')
    }
  }

  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      description: '',
      requires_dimensions: false,
      requires_material: false,
      pricing_type: 'custom',
      is_active: true
    })
    setEditingCategory(null)
  }

  const toggleCategoryStatus = async (category: any) => {
    try {
      const response = await productsService.updateCategory(category.id, {
        ...category,
        is_active: !category.is_active
      })

      if (response.ok) {
        toast.success(category.is_active ? 'Category deactivated' : 'Category activated')
        loadCategories()
      } else {
        toast.error('Failed to update category status')
      }
    } catch (error) {
      console.error('Error toggling category status:', error)
      toast.error('Failed to update category status')
    }
  }

  useEffect(() => {
    localStorage.setItem('admin_theme', theme)
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    return () => {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  const toggleTheme = () => {
    dispatch(setAdminTheme(theme === 'light' ? 'dark' : 'light'))
  }

  const deleteRequest = (id: string | number) => {
    dispatch(removeRequest(id))
    toast.success('Request deleted')
  }

  const deleteProduct = async (id: string | number) => {
    const confirmed = window.confirm('Are you sure you want to delete this product?')
    if (!confirmed) return

    try {
      const response = await adminProductService.deleteProduct(id.toString())
      if (response.ok) {
        toast.success('Product deleted successfully')
        loadProducts() // Reload products list
      } else {
        toast.error('Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Failed to delete product')
    }
  }

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const productData = {
        name: productForm.name,
        category: productForm.category,
        short_description: productForm.short_description,
        detailed_description: productForm.detailed_description,
        unit_price: parseFloat(productForm.unit_price),
        available_colors: productForm.available_colors,
        available_materials: productForm.available_materials,
        published: productForm.published,
        currency: 'RWF',
        length: productForm.length ? parseFloat(productForm.length) : null,
        width: productForm.width ? parseFloat(productForm.width) : null,
        height: productForm.height ? parseFloat(productForm.height) : null
      }

      let response
      if (editingProduct) {
        response = await adminProductService.updateProduct(editingProduct.id, productData)
      } else {
        response = await adminProductService.createProduct(productData)
      }

      if (response.ok && response.data) {
        // Upload multiple images if provided
        if (productImages.length > 0 && response.data.id) {
          toast.loading('Uploading images...', { id: 'upload-progress' });
          
          const uploadResult = await adminProductService.uploadMultipleProductImages(
            response.data.id,
            productImages,
            mainImageIndex,
            productForm.name
          )
          
          toast.dismiss('upload-progress');
          
          if (!uploadResult.ok) {
            toast.error(uploadResult.error || 'Some images failed to upload');
          } else {
            toast.success('All images uploaded successfully');
          }
        }

        toast.success(editingProduct ? 'Product updated successfully' : 'Product created successfully')
        setShowProductForm(false)
        resetProductForm()
        loadProducts() // Reload products list
      } else {
        toast.error(typeof response.error === 'string' ? response.error : 'Failed to save product: ' + JSON.stringify(response.error))
      }
    } catch (error: any) {
      console.error('Error saving product:', error)
      toast.error(error.message || 'Failed to save product')
    }
  }

  const editProduct = async (product: any) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      category: product.category?.id || product.category || '',
      short_description: product.short_description || '',
      detailed_description: product.detailed_description || '',
      unit_price: product.unit_price?.toString() || '',
      available_colors: product.available_colors || '',
      available_materials: product.available_materials || '',
      published: product.published !== undefined ? product.published : true,
      length: product.length?.toString() || '',
      width: product.width?.toString() || '',
      height: product.height?.toString() || ''
    })
    
    // Load existing images
    if (product.media && product.media.length > 0) {
      setExistingImages(product.media)
      // Find main image (display_order = 0)
      const mainIndex = product.media.findIndex((m: any) => m.display_order === 0)
      setMainImageIndex(mainIndex >= 0 ? mainIndex : 0)
    }
    
    setShowProductForm(true)
  }

  const resetProductForm = () => {
    setProductForm({
      name: '',
      category: '',
      short_description: '',
      detailed_description: '',
      unit_price: '',
      available_colors: '',
      available_materials: '',
      published: true,
      length: '',
      width: '',
      height: ''
    })
    setProductImages([])
    setImagePreviews([])
    setExistingImages([])
    setMainImageIndex(0)
    setEditingProduct(null)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const fileArray = Array.from(files) as File[]
      setProductImages(prev => [...prev, ...fileArray])
      
      // Generate previews for all new files
      fileArray.forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeNewImage = (index: number) => {
    setProductImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
    // Adjust main image index if needed
    if (mainImageIndex === index + existingImages.length) {
      setMainImageIndex(0)
    } else if (mainImageIndex > index + existingImages.length) {
      setMainImageIndex(prev => prev - 1)
    }
  }

  const removeExistingImage = async (imageId: string, index: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this image?')
    if (!confirmed) return

    try {
      const response = await adminProductService.deleteProductMedia(imageId)
      if (response.ok) {
        setExistingImages(prev => prev.filter((_, i) => i !== index))
        toast.success('Image deleted successfully')
        // Adjust main image index if needed
        if (mainImageIndex === index) {
          setMainImageIndex(0)
        } else if (mainImageIndex > index) {
          setMainImageIndex(prev => prev - 1)
        }
      } else {
        toast.error('Failed to delete image')
      }
    } catch (error) {
      console.error('Error deleting image:', error)
      toast.error('Failed to delete image')
    }
  }

  const setAsMainImage = (index: number) => {
    setMainImageIndex(index)
  }

  const toggleProductPublish = async (product: any) => {
    try {
      const response = product.published
        ? await adminProductService.unpublishProduct(product.id)
        : await adminProductService.publishProduct(product.id)

      if (response.ok) {
        toast.success(product.published ? 'Product unpublished' : 'Product published')
        loadProducts() // Reload products list
      } else {
        toast.error('Failed to update product status')
      }
    } catch (error) {
      console.error('Error toggling product publish status:', error)
      toast.error('Failed to update product status')
    }
  }

  const handleToggleStatus = async (id: string | number, currentStatus: boolean) => {
    try {
      await dispatch(toggleUserStatus({ id, is_active: currentStatus }) as any).unwrap()
      // Refetch users to ensure UI is in sync with backend
      await dispatch(fetchUsers({ page: userPage, search: userSearch }) as any)
      toast.success('Status updated successfully')
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status')
    }
  }

  const handleUserSubmitLocal = async (userData: any) => {
    try {
      if (editingUser) {
        await dispatch(editUser({ id: editingUser.id, userData }) as any).unwrap()
        toast.success('User updated successfully')
      } else {
        await dispatch(addUser(userData) as any).unwrap()
        toast.success('User created successfully')
      }
      setShowUserModal(false)
      setEditingUser(null)
    } catch (err: any) {
      toast.error(err.message || 'Action failed')
    }
  }

  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      try {
        await dispatch(removeUser(userToDelete.id) as any).unwrap()
        toast.success('User deleted')
        setUserToDelete(null)
      } catch (err: any) {
        toast.error(err.message || 'Delete failed')
      }
    }
  }

  // Filter Users (Local fallback if needed, though API handles it)
  const filteredUsers = users.filter((u: any) =>
    u.full_name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.phone_number.includes(userSearch)
  )
  const totalUserPages = Math.ceil(count / usersPerPage)
  const paginatedUsers = users // API already paginates, so we show the current set

  return (
    <div className={`flex h-screen bg-[#F8FAFC] dark:bg-[#0F172A] overflow-hidden lg:static text-slate-800 dark:text-slate-100 transition-colors duration-300 ${theme}`}>
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
        fixed inset-y-0 left-0 w-72 bg-white dark:bg-[#1E293B] border-r border-gray-100 dark:border-slate-800 flex flex-col items-center py-8 z-50 transition-all duration-300 lg:translate-x-0 lg:static lg:inset-auto
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between w-full px-6 mb-12">
          <div className="flex flex-col items-stretch w-44">
            <img src={logo} alt="Rwooga Logo" className="w-full h-auto object-contain" />
            <div className="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase px-0.5 -mt-3">
              {"Management Portal".split('').map((char, i) => (
                <span key={i} className="inline-block">{char === ' ' ? '\u00A0' : char}</span>
              ))}
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400" aria-label="Close sidebar" title="Close sidebar">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 w-full space-y-2 px-3">
          <SidebarLink active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }} icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <SidebarLink active={activeTab === 'users'} onClick={() => { setActiveTab('users'); setIsSidebarOpen(false); }} icon={<UsersIcon size={20} />} label="Users" />
          <SidebarLink active={activeTab === 'categories'} onClick={() => { setActiveTab('categories'); setIsSidebarOpen(false); }} icon={<Briefcase size={20} />} label="Categories" />
          <SidebarLink active={activeTab === 'products'} onClick={() => { setActiveTab('products'); setIsSidebarOpen(false); }} icon={<ShoppingBag size={20} />} label="Products" />
          <SidebarLink active={activeTab === 'orders'} onClick={() => { setActiveTab('orders'); setIsSidebarOpen(false); }} icon={<ShoppingBag size={20} />} label="Shop Orders" />
          <SidebarLink active={activeTab === 'requests'} onClick={() => { setActiveTab('requests'); setIsSidebarOpen(false); }} icon={<ClipboardList size={20} />} label="Custom Requests" />
          <SidebarLink active={activeTab === 'settings'} onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }} icon={<Settings size={20} />} label="Settings" />
        </nav>

        <div className="mt-auto px-6 w-full pt-8 border-t border-gray-50 dark:border-slate-800 flex flex-col space-y-4">


          <button
            onClick={handleLogout}
            className="w-full py-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl text-xs font-bold hover:bg-red-100 dark:hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
            title="Logout session"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full">
        {/* Top Navigation */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#1E293B]/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 px-4 md:px-8 py-4 flex items-center justify-between transition-colors duration-300">
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400" aria-label="Open sidebar" title="Open sidebar">
              <Menu size={20} />
            </button>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white capitalize leading-tight">
                {activeTab === 'dashboard' ? 'Dashboard Overview' : activeTab}
              </h2>

            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-6">
            <div className="relative group hidden xl:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-primary transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search orders, clients..."
                className="bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-2 pl-10 pr-4 text-sm w-48 2xl:w-64 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all dark:text-white dark:placeholder:text-slate-500"
              />
            </div>

            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl border border-gray-100 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              aria-label="Toggle Theme"
              title="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <div className="flex items-center space-x-3 bg-slate-100 dark:bg-slate-800 rounded-xl px-3 md:px-4 py-1.5 md:py-2">
              <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest hidden sm:block">Status</span>
              <div className={`flex items-center space-x-2 px-2 md:px-3 py-0.5 md:py-1 rounded-lg ${isEnabled ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${isEnabled ? 'bg-brand-primary' : 'bg-red-500'} animate-pulse`} />
                <span className="text-[10px] font-black uppercase">{isEnabled ? 'On' : 'Off'}</span>
              </div>
              <button
                onClick={() => onToggle(!isEnabled)}
                className={`w-8 md:w-12 h-4 md:h-6 rounded-full relative transition-all ${isEnabled ? 'bg-brand-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
                aria-label="Toggle public service mode"
                title="Toggle public service mode"
              >
                <div className={`absolute top-0.5 md:top-1 w-3 md:w-4 h-3 md:h-4 bg-white rounded-full transition-all ${isEnabled ? 'left-4.5 md:left-7' : 'left-0.5 md:left-1'}`} />
              </button>
            </div>

            <button className="w-10 h-10 rounded-xl border border-gray-100 dark:border-slate-800 hidden md:flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all" aria-label="Notifications" title="Notifications">
              <Bell size={20} />
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
                  bg="bg-emerald-50 dark:bg-emerald-500/10"
                />
                <DashboardStat
                  label="Active Products"
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
                <div className="lg:col-span-2 bg-white dark:bg-[#1E293B] rounded-3xl border border-gray-100 dark:border-slate-800 p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Recent Custom Requests</h3>
                    <button onClick={() => setActiveTab('requests')} className="text-xs font-bold text-brand-primary hover:underline">View All Requests</button>
                  </div>

                  <div className="overflow-x-auto -mx-8 px-8">
                    <table className="w-full min-w-[600px]">
                      <thead>
                        <tr className="border-b border-gray-50 dark:border-slate-800 text-left">
                          <th className="py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Client Name</th>
                          <th className="py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Service Type</th>
                          <th className="py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Design File</th>
                          <th className="py-4 text-right text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                        {customRequests.slice(0, 5).map((req: any) => (
                          <tr key={req.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all rounded-xl overflow-hidden">
                            <td className="py-5">
                              <p className="font-bold text-slate-800 dark:text-white">{req.name}</p>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400">{req.email}</p>
                            </td>
                            <td className="py-5">
                              <span className="px-3 py-1 rounded-lg bg-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase">{req.productType}</span>
                            </td>
                            <td className="py-5">
                              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate max-w-[150px]">{req.files?.[0] || 'No file attached'}</p>
                            </td>
                            <td className="py-5 text-right">
                              <button className="bg-slate-100 dark:bg-slate-800 hover:bg-brand-primary hover:text-white p-2 rounded-lg text-slate-500 dark:text-slate-400 transition-all" aria-label="Download file" title="Download file">
                                <Download size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {customRequests.length === 0 && (
                          <tr><td colSpan={4} className="py-12 text-center text-slate-500 dark:text-slate-400 text-sm">No recent requests</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Shop Orders Highlight */}
                  <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-gray-100 dark:border-slate-800 p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white">Shop Orders</h3>
                      <button onClick={() => setActiveTab('orders')} className="text-slate-500 dark:text-slate-400 hover:text-slate-600 transition-colors" aria-label="More options" title="More options">
                        <MoreVertical size={20} />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {products.slice(0, 2).map((p: any, idx) => (
                        <div key={idx} className="flex items-center justify-between group p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all">
                          <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400">
                              <ShoppingCart size={24} />
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 dark:text-white text-sm">Order #R-{9021 - idx}</p>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400">{p.name}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-slate-800 dark:text-white text-sm">{p.price.toLocaleString()} </p>
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg ${idx === 0 ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-500' : 'bg-emerald-50 dark:bg-emerald-500/10 text-brand-primary'}`}>
                              {idx === 0 ? 'Shipping' : 'Delivered'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}


          {activeTab === 'categories' && (
            <div className="bg-white dark:bg-[#1E293B] p-6 md:p-10 rounded-[32px] md:rounded-[40px] border border-gray-100 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-bottom-5 duration-500 transition-colors">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">Category Management</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Manage product categories and their settings</p>
                </div>
                {!showCategoryForm && (
                  <button onClick={() => { setShowCategoryForm(true); resetCategoryForm(); }} className="flex items-center space-x-2 px-6 py-3 bg-brand-primary text-white rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-brand-primary/20">
                    <Plus size={20} />
                    <span>Add Category</span>
                  </button>
                )}
              </div>
              {showCategoryForm && (
                <motion.form initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleCategorySubmit} className="mb-12 p-6 md:p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[32px] border border-gray-100 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-widest">{editingCategory ? 'Edit Category' : 'New Category'}</h3>
                    <button type="button" onClick={() => setShowCategoryForm(false)} className="w-10 h-10 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-red-500 transition-all"><X size={20} /></button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Category Name <span className="text-red-500">*</span></label>
                      <input type="text" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} className="w-full bg-white dark:bg-slate-800 px-5 py-4 rounded-2xl border border-gray-100 dark:border-slate-700 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all dark:text-white" placeholder="e.g., 3D Printing" required />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Pricing Type</label>
                      <select value={categoryForm.pricing_type} onChange={(e) => setCategoryForm({ ...categoryForm, pricing_type: e.target.value })} className="w-full bg-white dark:bg-slate-800 px-5 py-4 rounded-2xl border border-gray-100 dark:border-slate-700 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all dark:text-white">
                        <option value="custom">Custom Quote</option>
                        <option value="fixed">Fixed Price</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Description <span className="text-red-500">*</span></label>
                      <textarea rows={4} value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} className="w-full bg-white dark:bg-slate-800 px-5 py-4 rounded-2xl border border-gray-100 dark:border-slate-700 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all dark:text-white" placeholder="Describe this category and what types of products it includes..." required />
                    </div>
                    <div className="flex items-center space-x-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700">
                      <input type="checkbox" id="requires_dimensions" checked={categoryForm.requires_dimensions} onChange={(e) => setCategoryForm({ ...categoryForm, requires_dimensions: e.target.checked })} className="w-6 h-6 accent-brand-primary rounded-lg" />
                      <label htmlFor="requires_dimensions" className="text-sm font-bold text-slate-800 dark:text-white">Requires Dimensions</label>
                    </div>
                    <div className="flex items-center space-x-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700">
                      <input type="checkbox" id="requires_material" checked={categoryForm.requires_material} onChange={(e) => setCategoryForm({ ...categoryForm, requires_material: e.target.checked })} className="w-6 h-6 accent-brand-primary rounded-lg" />
                      <label htmlFor="requires_material" className="text-sm font-bold text-slate-800 dark:text-white">Requires Material</label>
                    </div>
                    <div className="flex items-center space-x-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700">
                      <input type="checkbox" id="is_active" checked={categoryForm.is_active} onChange={(e) => setCategoryForm({ ...categoryForm, is_active: e.target.checked })} className="w-6 h-6 accent-brand-primary rounded-lg" />
                      <label htmlFor="is_active" className="text-sm font-bold text-slate-800 dark:text-white">Active</label>
                    </div>
                  </div>
                  <div className="mt-10 flex justify-end space-x-4">
                    <button type="button" onClick={() => setShowCategoryForm(false)} className="px-8 py-4 text-slate-500 dark:text-slate-400 font-bold hover:text-slate-700 dark:hover:text-slate-200 transition-all">Cancel</button>
                    <button type="submit" className="flex items-center space-x-2 px-10 py-4 bg-brand-primary text-white rounded-2xl font-bold shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 transition-all"><Save size={22} /><span>{editingCategory ? 'Update Category' : 'Save Category'}</span></button>
                  </div>
                </motion.form>
              )}
              <div className="space-y-6">
                {categoriesLoading ? (
                  <div className="text-center py-20"><p className="text-slate-500 dark:text-slate-400">Loading categories...</p></div>
                ) : categories.length === 0 ? (
                  <EmptyState icon={<Briefcase size={40} />} text="No categories yet. Create one to get started!" />
                ) : (
                  categories.map((cat: any) => (
                    <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 bg-slate-50 dark:bg-slate-800/30 rounded-[40px] border border-gray-100 dark:border-slate-800/50 group transition-colors">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white">{cat.name}</h3>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${cat.is_active ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>{cat.is_active ? 'Active' : 'Inactive'}</span>
                            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-brand-primary/10 text-brand-primary">{cat.pricing_type === 'fixed' ? 'Fixed Price' : 'Custom Quote'}</span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{cat.description}</p>
                          <div className="flex gap-4 text-xs text-slate-500 dark:text-slate-400">
                            {cat.requires_dimensions && <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-brand-primary" />Requires Dimensions</span>}
                            {cat.requires_material && <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-brand-primary" />Requires Material</span>}
                            <span>{cat.product_count || 0} products</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => toggleCategoryStatus(cat)} className={`p-2 rounded-xl transition-all ${cat.is_active ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200'}`} title={cat.is_active ? 'Deactivate' : 'Activate'}>{cat.is_active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}</button>
                          <button onClick={() => editCategory(cat)} className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-xl transition-all" title="Edit Category"><Edit2 size={20} /></button>
                          <button onClick={() => deleteCategory(cat.id)} className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-red-500 hover:bg-red-50/50 rounded-xl transition-all" title="Delete Category"><Trash2 size={20} /></button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          )}


          {activeTab === 'products' && (
            <div className="bg-white dark:bg-[#1E293B] p-6 md:p-10 rounded-[32px] md:rounded-[40px] border border-gray-100 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-bottom-5 duration-500 transition-colors">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">Catalog Management</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Manage your online store items and availability</p>
                </div>
                {!showProductForm && (
                  <button
                    onClick={() => {
                      setShowProductForm(true)
                      resetProductForm()
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
                  className="mb-12 p-6 md:p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[32px] border border-gray-100 dark:border-slate-800"
                >
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-widest">{editingProduct ? 'Edit Product' : 'New Product'}</h3>
                    <button type="button" onClick={() => setShowProductForm(false)} className="w-10 h-10 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-red-500 transition-all" aria-label="Close form" title="Close form">
                      <X size={20} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Product Images Upload */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Product Images</label>
                      
                      {/* Image Gallery */}
                      {(existingImages.length > 0 || imagePreviews.length > 0) && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          {/* Existing Images */}
                          {existingImages.map((media, index) => (
                            <div key={media.id} className="relative group">
                              <div className={`w-full h-32 rounded-2xl overflow-hidden border-2 ${mainImageIndex === index ? 'border-brand-primary' : 'border-gray-100 dark:border-slate-700'}`}>
                                <img src={media.image} alt={media.alt_text || `Image ${index + 1}`} className="w-full h-full object-cover" />
                              </div>
                              {mainImageIndex === index && (
                                <div className="absolute top-2 left-2 bg-brand-primary text-white text-xs font-bold px-2 py-1 rounded-lg">
                                  Main
                                </div>
                              )}
                              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {mainImageIndex !== index && (
                                  <button
                                    type="button"
                                    onClick={() => setAsMainImage(index)}
                                    className="bg-white dark:bg-slate-800 p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-brand-primary transition-all shadow-sm"
                                    title="Set as main image"
                                  >
                                    <CheckCircle2 size={16} />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => removeExistingImage(media.id, index)}
                                  className="bg-white dark:bg-slate-800 p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-red-500 transition-all shadow-sm"
                                  title="Delete image"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                          
                          {/* New Images */}
                          {imagePreviews.map((preview, index) => {
                            const actualIndex = existingImages.length + index;
                            return (
                              <div key={`new-${index}`} className="relative group">
                                <div className={`w-full h-32 rounded-2xl overflow-hidden border-2 ${mainImageIndex === actualIndex ? 'border-brand-primary' : 'border-gray-100 dark:border-slate-700'}`}>
                                  <img src={preview} alt={`New image ${index + 1}`} className="w-full h-full object-cover" />
                                </div>
                                {mainImageIndex === actualIndex && (
                                  <div className="absolute top-2 left-2 bg-brand-primary text-white text-xs font-bold px-2 py-1 rounded-lg">
                                    Main
                                  </div>
                                )}
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  {mainImageIndex !== actualIndex && (
                                    <button
                                      type="button"
                                      onClick={() => setAsMainImage(actualIndex)}
                                      className="bg-white dark:bg-slate-800 p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-brand-primary transition-all shadow-sm"
                                      title="Set as main image"
                                    >
                                      <CheckCircle2 size={16} />
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => removeNewImage(index)}
                                    className="bg-white dark:bg-slate-800 p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-red-500 transition-all shadow-sm"
                                    title="Remove image"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                                <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                                  New
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      
                      {/* Upload Button */}
                      <label className="flex flex-col items-center justify-center px-6 py-8 bg-white dark:bg-slate-800 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl cursor-pointer hover:border-brand-primary transition-all">
                        <Upload className="w-8 h-8 text-slate-400 mb-2" />
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Click to upload images</span>
                        <span className="text-xs text-slate-400 mt-1">PNG, JPG up to 10MB (multiple files supported)</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Product Name */}
                    <div>
                      <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Product Name</label>
                      <input
                        type="text"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        className="w-full bg-white dark:bg-slate-800 px-5 py-4 rounded-2xl border border-gray-100 dark:border-slate-700 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all placeholder:text-slate-300 dark:text-white"
                        placeholder="e.g., 3D Printed Chess Set"
                        required
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Category</label>
                      <select
                        value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                        className="w-full bg-white dark:bg-slate-800 px-5 py-4 rounded-2xl border border-gray-100 dark:border-slate-700 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all dark:text-white"
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Dimensions (Conditionally Rendered) */}
                    {categories.find(c => c.id === productForm.category)?.requires_dimensions && (
                      <div className="md:col-span-2 grid grid-cols-3 gap-4">
                         <div>
                          <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Length (cm)</label>
                          <input
                            type="number"
                            value={productForm.length || ''}
                            onChange={(e) => setProductForm({ ...productForm, length: e.target.value })}
                            className="w-full bg-white dark:bg-slate-800 px-5 py-4 rounded-2xl border border-gray-100 dark:border-slate-700 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all dark:text-white"
                            placeholder="0.00"
                            step="0.01"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Width (cm)</label>
                          <input
                            type="number"
                            value={productForm.width || ''}
                            onChange={(e) => setProductForm({ ...productForm, width: e.target.value })}
                            className="w-full bg-white dark:bg-slate-800 px-5 py-4 rounded-2xl border border-gray-100 dark:border-slate-700 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all dark:text-white"
                            placeholder="0.00"
                            step="0.01"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Height (cm)</label>
                          <input
                            type="number"
                            value={productForm.height || ''}
                            onChange={(e) => setProductForm({ ...productForm, height: e.target.value })}
                            className="w-full bg-white dark:bg-slate-800 px-5 py-4 rounded-2xl border border-gray-100 dark:border-slate-700 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all dark:text-white"
                            placeholder="0.00"
                            step="0.01"
                            required
                          />
                        </div>
                      </div>
                    )}

                    {/* Price */}
                    <div>
                      <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Price (RWF)</label>
                      <input
                        type="number"
                        value={productForm.unit_price}
                        onChange={(e) => setProductForm({ ...productForm, unit_price: e.target.value })}
                        className="w-full bg-white dark:bg-slate-800 px-5 py-4 rounded-2xl border border-gray-100 dark:border-slate-700 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all dark:text-white"
                        placeholder="50,000"
                        required
                      />
                    </div>

                    {/* Available Colors */}
                    <div>
                      <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Available Colors</label>
                      <input
                        type="text"
                        value={productForm.available_colors}
                        onChange={(e) => setProductForm({ ...productForm, available_colors: e.target.value })}
                        className="w-full bg-white dark:bg-slate-800 px-5 py-4 rounded-2xl border border-gray-100 dark:border-slate-700 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all dark:text-white"
                        placeholder="e.g., Red, Blue, Green"
                      />
                    </div>

                    {/* Available Materials */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Available Materials</label>
                      <input
                        type="text"
                        value={productForm.available_materials}
                        onChange={(e) => setProductForm({ ...productForm, available_materials: e.target.value })}
                        className="w-full bg-white dark:bg-slate-800 px-5 py-4 rounded-2xl border border-gray-100 dark:border-slate-700 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all dark:text-white"
                        placeholder="e.g., PLA, ABS, PETG"
                      />
                    </div>

                    {/* Short Description */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Short Description</label>
                      <input
                        type="text"
                        value={productForm.short_description}
                        onChange={(e) => setProductForm({ ...productForm, short_description: e.target.value })}
                        className="w-full bg-white dark:bg-slate-800 px-5 py-4 rounded-2xl border border-gray-100 dark:border-slate-700 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all dark:text-white"
                        placeholder="Brief one-line description"
                        required
                      />
                    </div>

                    {/* Detailed Description */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Detailed Description</label>
                      <textarea
                        rows={4}
                        value={productForm.detailed_description}
                        onChange={(e) => setProductForm({ ...productForm, detailed_description: e.target.value })}
                        className="w-full bg-white dark:bg-slate-800 px-5 py-4 rounded-2xl border border-gray-100 dark:border-slate-700 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all dark:text-white"
                        placeholder="Detail about the product material, size, and use..."
                      />
                    </div>

                    {/* Published Toggle */}
                    <div className="flex items-center space-x-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700">
                      <input
                        type="checkbox"
                        id="published"
                        checked={productForm.published}
                        onChange={(e) => setProductForm({ ...productForm, published: e.target.checked })}
                        className="w-6 h-6 accent-brand-primary rounded-lg"
                      />
                      <label htmlFor="published" className="text-sm font-bold text-slate-800 dark:text-white">Publish to Website</label>
                    </div>
                  </div>
                  <div className="mt-10 flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowProductForm(false)}
                      className="px-8 py-4 text-slate-500 dark:text-slate-400 font-bold hover:text-slate-700 dark:hover:text-slate-200 transition-all"
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
                {productsLoading ? (
                  <div className="col-span-2 text-center py-20">
                    <p className="text-slate-500 dark:text-slate-400">Loading products...</p>
                  </div>
                ) : adminProducts.length === 0 ? (
                  <div className="col-span-2 text-center py-20 bg-slate-50 dark:bg-slate-800/30 rounded-[40px] border border-dashed border-slate-200 dark:border-slate-700">
                    <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                      <ShoppingBag className="text-slate-300 dark:text-slate-600" size={32} />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-bold">No products listed in the shop yet.</p>
                  </div>
                ) : (
                  adminProducts.map((p: any) => (
                    <motion.div
                      key={p.id}
                      layout
                      className="group bg-white dark:bg-[#1E293B] p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 hover:border-brand-primary/30 dark:hover:border-brand-primary/50 hover:shadow-xl transition-all relative"
                    >
                      {/* Product Image Thumbnail */}
                      {p.media && p.media.length > 0 && p.media[0].image ? (
                        <div className="w-full h-48 mb-4 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                          <img 
                            src={p.media[0].image} 
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-48 mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          <ImageIcon className="text-slate-300 dark:text-slate-600" size={48} />
                        </div>
                      )}

                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">{p.name}</h3>
                          <p className="text-xs text-slate-400">{p.category_name || 'Uncategorized'}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => editProduct(p)}
                            className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-brand-primary hover:bg-brand-primary/10 p-2.5 rounded-xl transition-all"
                            aria-label="Edit product"
                            title="Edit product"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-red-500 hover:bg-red-50/50 p-2.5 rounded-xl transition-all"
                            aria-label="Delete product"
                            title="Delete product"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed line-clamp-2">{p.short_description || p.detailed_description}</p>

                      <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800">
                        <span className="text-lg font-black text-slate-800 dark:text-white">{p.unit_price?.toLocaleString() || 0} <span className="text-xs font-bold text-slate-500 dark:text-slate-400">RWF</span></span>
                        <button
                          onClick={() => toggleProductPublish(p)}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                            p.published 
                              ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100' 
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          {p.published ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                          <span className="text-xs font-bold">{p.published ? 'Published' : 'Unpublished'}</span>
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white dark:bg-[#1E293B] p-6 md:p-10 rounded-[32px] md:rounded-[40px] border border-gray-100 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-bottom-5 duration-500 transition-colors">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">User Management</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Manage administrator and client accounts</p>
                </div>
                <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
                  <div className="relative flex-1 sm:min-w-[300px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder="Filter by name, email, or phone..."
                      value={userSearch}
                      onChange={(e) => { setUserSearch(e.target.value); setUserPage(1); }}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all dark:text-white"
                    />
                  </div>
                  <button
                    onClick={() => { setEditingUser(null); setShowUserModal(true); }}
                    className="flex items-center justify-center space-x-2 px-6 py-3 bg-brand-primary text-white rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-brand-primary/20"
                  >
                    <UserPlus size={20} />
                    <span>Add User</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto -mx-6 md:-mx-10 px-6 md:px-10">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="border-b border-gray-50 dark:border-slate-800 text-left">
                      <th className="pb-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-4">User Details</th>
                      <th className="pb-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Contact Info</th>
                      <th className="pb-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">Role</th>
                      <th className="pb-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">Status</th>
                      <th className="pb-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-right pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                    {paginatedUsers.map((u) => (
                      <tr key={u.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                        <td className="py-5 pl-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary font-bold">
                              {u.full_name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 dark:text-white">{u.full_name}</p>
                              <p className="text-[10px] text-slate-400 font-medium">ID: {u.id.substring(0, 8)}...</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-6 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center text-xs text-slate-600 dark:text-slate-400">
                              <Mail size={12} className="mr-2 text-slate-400" />
                              {u.email}
                            </div>
                            <div className="flex items-center text-xs text-slate-600 dark:text-slate-400">
                              <Phone size={12} className="mr-2 text-slate-400" />
                              {u.phone_number}
                            </div>
                          </div>
                        </td>
                        <td className="py-6 px-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.user_type === 'ADMIN' ? 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400' : u.user_type === 'STAFF' ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                            {u.user_type}
                          </span>
                        </td>
                        <td className="py-6 px-4">

                          <button
                            onClick={() => handleToggleStatus(u.id, u.is_active)}
                            className={`w-12 h-6 rounded-full relative transition-all ${u.is_active ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}

                          >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${u.is_active ? 'left-7' : 'left-1'}`} />
                          </button>

                        </td>
                        <td className="py-5 text-right pr-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => { setEditingUser(u); setShowUserModal(true); }}
                              className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-xl transition-all"
                              title="Edit User"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => setUserToDelete(u)}
                              className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-red-500 hover:bg-red-50/50 rounded-xl transition-all"
                              title="Delete User"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-20 text-center">
                          <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-300 dark:text-slate-600">
                              <UsersIcon size={32} />
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 font-bold">No users found matching your search</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalUserPages > 1 && (
                <div className="mt-10 flex items-center justify-between border-t border-gray-50 dark:border-slate-800 pt-8">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                    Showing {Math.min(filteredUsers.length, (userPage - 1) * usersPerPage + 1)}-{Math.min(filteredUsers.length, userPage * usersPerPage)} of {filteredUsers.length} Users
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={userPage === 1}
                      onClick={() => setUserPage(p => p - 1)}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-bold disabled:opacity-50 transition-all hover:bg-slate-200"
                    >
                      Previous
                    </button>
                    {[...Array(totalUserPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setUserPage(i + 1)}
                        className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${userPage === i + 1 ? 'bg-brand-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      disabled={userPage === totalUserPages}
                      onClick={() => setUserPage(p => p + 1)}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-bold disabled:opacity-50 transition-all hover:bg-slate-200"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="bg-white dark:bg-[#1E293B] rounded-[32px] md:rounded-[40px] border border-gray-100 dark:border-slate-800 p-6 md:p-10 shadow-sm min-h-[500px] transition-colors">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Custom Requests</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Handle client inquiries and product submissions</p>
                </div>
              </div>

              <div className="space-y-6">
                {customRequests.length === 0 ? (
                  <EmptyState icon={<ClipboardList size={40} />} text="No product requests yet." />
                ) : (
                  customRequests.map((r: any) => (
                    <ProductRequestCard key={r.id} request={r} onDelete={() => deleteRequest(r.id)} />
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white dark:bg-[#1E293B] rounded-[32px] md:rounded-[40px] border border-gray-100 dark:border-slate-800 p-6 md:p-10 shadow-sm text-center py-20 md:py-32 transition-colors">
              <ShoppingBag className="mx-auto text-slate-200 dark:text-slate-700 mb-6" size={64} />
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Order Tracking System</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">This complex logistics module is currently being integrated with our carrier APIs. Status updates will appear here soon.</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl bg-white dark:bg-[#1E293B] rounded-[32px] md:rounded-[40px] border border-gray-100 dark:border-slate-800 p-6 md:p-10 shadow-sm transition-colors">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-8">System Settings</h2>
              <div className="space-y-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white">Public Service Mode</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Visibility of "Quick Quote" buttons</p>
                  </div>
                  <button
                    onClick={() => onToggle(!isEnabled)}
                    className={`w-14 h-8 rounded-full relative transition-all ${isEnabled ? 'bg-brand-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
                    aria-label="Toggle public service mode"
                    title="Toggle public service mode"
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${isEnabled ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>

                <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-gray-100 dark:border-slate-700">
                  <h4 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center">
                    <ShieldCheck className="mr-2 text-brand-primary" size={18} /> Critical Access
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">
                    Modify root administrative credentials and system API keys. This action requires secondary authentication.
                  </p>
                  <button className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white px-8 py-3 rounded-2xl font-bold text-xs border border-gray-100 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shadow-sm">
                    Re-authenticate Session
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <UserModal
        isOpen={showUserModal}
        onClose={() => { setShowUserModal(false); setEditingUser(null); }}
        onSubmit={handleUserSubmitLocal}
        user={editingUser}
        loading={usersLoading}
      />

      <DeleteConfirmModal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        message={`Are you sure you want to delete ${userToDelete?.name}? This action cannot be undone.`}
        loading={usersLoading}
      />
    </div>
  )
}

const SidebarLink: React.FC<{ active: boolean; icon: React.ReactNode; label: string; onClick: () => void }> = ({ active, icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-6 py-4 rounded-2xl font-bold transition-all ${active ? 'bg-brand-primary/10 text-brand-primary' : 'text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
  >
    {icon}
    <span className="text-sm">{label}</span>
  </button>
)

const DashboardStat: React.FC<{ label: string; value: string; trend: string; icon: React.ReactNode; bg: string }> = ({ label, value, trend, icon, bg }) => (
  <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-gray-100 dark:border-slate-800 p-8 shadow-sm flex flex-col justify-between transition-colors">
    <div className="flex justify-between items-start mb-6">
      <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center bg-opacity-100 transition-transform hover:scale-110 duration-500 shadow-sm`}>
        {icon}
      </div>
      {(label === "Total Revenue") && <div className="text-[10px] bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full">LIVE</div>}
    </div>
    <div>
      <p className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <div className="flex items-baseline space-x-2">
        <h4 className="text-3xl font-display font-black text-slate-800 dark:text-white">{value}</h4>
      </div>
      <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-2 flex items-center">
        {trend.includes('+') ? <CheckCircle2 size={12} className="text-brand-primary mr-1" /> : (label === "Pending Requests") ? <AlertCircle size={12} className="text-brand-orange mr-1" /> : <div className="w-1.5 h-1.5 bg-brand-primary rounded-full mr-1" />}
        {trend}
      </p>
    </div>
  </div>
)

const ProductRequestCard: React.FC<{ request: any; onDelete: () => void }> = ({ request, onDelete }) => (
  <div className="p-8 bg-slate-50 dark:bg-slate-800/30 rounded-[40px] border border-gray-100 dark:border-slate-800/50 group transition-colors">
    <div className="flex justify-between items-start mb-8">
      <div className="flex items-center space-x-6">
        <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-brand-primary shadow-sm">
          <Files size={28} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white leading-tight">{request.name}</h3>
          <p className="text-xs text-brand-primary font-black uppercase tracking-widest mt-1">{request.productType}</p>
        </div>
      </div>
      <button onClick={onDelete} className="w-10 h-10 bg-white dark:bg-slate-800 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 rounded-xl flex items-center justify-center border border-gray-100 dark:border-slate-700 transition-all shadow-sm" aria-label="Delete request" title="Delete request">
        <Trash2 size={20} />
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <RequestDetail label="Email Address" value={request.email} />
      <RequestDetail label="Phone Number" value={request.phone} />
      <RequestDetail label="Submitted On" value={new Date(request.date).toLocaleDateString()} />
    </div>

    <div className="bg-white dark:bg-slate-800 p-6 rounded-[32px] border border-gray-100 dark:border-slate-700 shadow-sm mb-8">
      <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Product Requirement</p>
      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{request.description}</p>
    </div>

    {request.files && request.files.length > 0 && (
      <div className="flex flex-wrap gap-4 items-center">
        <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mr-2">Attached Files:</span>
        {request.files.map((f: string, idx: number) => (
          <button key={idx} className="flex items-center space-x-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-gray-100 dark:border-slate-700 hover:border-brand-primary/30 text-[10px] font-bold text-slate-600 dark:text-slate-300 transition-all shadow-sm" aria-label={`Download ${f}`} title={`Download ${f}`}>
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
    <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-sm font-bold text-slate-800 dark:text-white">{value}</p>
  </div>
)

const EmptyState: React.FC<{ icon: React.ReactNode, text: string }> = ({ icon, text }) => (
  <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/20 rounded-[40px] border border-dashed border-slate-200 dark:border-slate-700 transition-colors">
    <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 dark:text-slate-600 shadow-sm">
      {icon}
    </div>
    <p className="text-slate-500 dark:text-slate-400 font-bold">{text}</p>
  </div>
)

export default Admin

