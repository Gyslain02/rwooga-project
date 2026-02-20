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
  Mail, Phone, LogOut, Home, Upload, Image as ImageIcon,
  Lock, Shield, Calendar, Eye, EyeOff, RefreshCw, AlertTriangle, User, DollarSign, Tag, Video, Box, Star
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { profileService, UserProfile } from '@/services/profileService';
import { authService } from '@/services/authService';
import logo from '@/assets/Rwooga logo.png'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/store'
import { fetchAllProducts, createProduct, updateProduct, deleteProduct as deleteProductRedux, clearError as clearProductError, fetchProduct } from '@/store/slices/productsSlice'
import {
  fetchRequests,
  submitRequest,
  removeRequest,
  updateRequestStatus
} from '@/store/slices/requestsSlice';
import { setAdminTheme } from '@/store/slices/settingsSlice'
import {
  fetchUsers,
  addUser,
  editUser,
  removeUser,
  toggleUserStatus,
  clearUserError
} from '@/store/slices/usersSlice';
import { fetchRefunds, completeRefund, failRefund } from '@/store/slices/refundsSlice';
import { fetchReturns, approveReturn, rejectReturn, completeReturn as completeReturnRequest, cancelReturnRequest } from '@/store/slices/returnsSlice';
import { fetchShippingRecords } from '@/store/slices/shippingSlice';
import { fetchPayments, cancelPayment } from '@/store/slices/paymentsSlice';
import { fetchDiscounts, deleteDiscount } from '@/store/slices/discountsSlice';
import { fetchFeedbacks, moderateFeedback, deleteFeedback } from '@/store/slices/feedbackSlice';
import { fetchMedia, deleteMedia } from '@/store/slices/mediaSlice';
import { fetchOrders } from '@/store/slices/ordersSlice';
import UserModal from '@/components/UserModal'
import DeleteConfirmModal from '@/components/DeleteConfirmModal'
import { adminProductService } from '@/services/adminProductService'
import { productsService } from '@/services/productsService'
import { PaymentRecord, ShippingRecord } from '@/types'

const Admin = ({ user, handleLogout, isEnabled, onToggle }: { user: any, handleLogout: () => void, isEnabled: boolean, onToggle: (val: boolean) => void }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return 'N/A';
    }
  };
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const activeTabFromStore = 'dashboard' // Keep as local state if simple, or move to slice if needed
  const [activeTab, setActiveTab] = useState('dashboard')
  const { adminTheme: theme } = useSelector((state: RootState) => state.settings)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Profile State
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Profile form state
  const [profileFormState, setProfileFormState] = useState({
    full_name: '',
    phone_number: '' as string | number
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Email change state
  const [showEmailChange, setShowEmailChange] = useState(false);
  const [emailChangeStep, setEmailChangeStep] = useState<'request' | 'confirm'>('request');
  const [emailChangeForm, setEmailChangeForm] = useState({
    new_email: '',
    password: '',
    code: ''
  });
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [showEmailPassword, setShowEmailPassword] = useState(false);

  // Delete Account state
  const [showDeleteProfileConfirm, setShowDeleteProfileConfirm] = useState(false);
  const [isDeletingProfile, setIsDeletingProfile] = useState(false);

  useEffect(() => {
    if (activeTab === 'settings') {
      loadProfile();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'requests') {
      dispatch(fetchRequests({}))
    }
    if (activeTab === 'refunds') {
      dispatch(fetchRefunds())
    }
    if (activeTab === 'returns') {
      dispatch(fetchReturns())
    }
    if (activeTab === 'shipping') {
      dispatch(fetchShippingRecords())
    }
    if (activeTab === 'payments') {
      dispatch(fetchPayments())
    }
    if (activeTab === 'discounts') {
      dispatch(fetchDiscounts())
    }
    if (activeTab === 'feedback') {
      dispatch(fetchFeedbacks({}))
    }
    if (activeTab === 'media') {
      dispatch(fetchMedia({}))
    }
    if (activeTab === 'orders') {
      dispatch(fetchOrders())
    }
  }, [activeTab, dispatch]);

  const loadProfile = async () => {
    try {
      setLoadingProfile(true);
      const response = await profileService.getProfile();
      if (response.ok && response.data) {
        setProfile(response.data);
        setProfileFormState({
          full_name: response.data.full_name,
          phone_number: response.data.phone_number
        });
      } else {
        toast.error('Failed to load profile');
      }
    } catch (error: any) {
      console.error('Error loading profile:', error);
      toast.error(error.message || 'Failed to load profile');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsSavingProfile(true);
      const response = await profileService.updateProfile({
        full_name: profileFormState.full_name,
        phone_number: profileFormState.phone_number === '' ? undefined : Number(profileFormState.phone_number)
      });
      if (response.ok) {
        toast.success('Profile updated successfully');
        setIsEditingProfile(false);
        loadProfile();
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleCancelEditProfile = () => {
    if (profile) {
      setProfileFormState({
        full_name: profile.full_name,
        phone_number: profile.phone_number
      });
    }
    setIsEditingProfile(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordForm.new_password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    try {
      setIsChangingPassword(true);
      const response = await profileService.changePassword({
        old_password: passwordForm.old_password,
        new_password: passwordForm.new_password,
        new_password_confirm: passwordForm.confirm_password
      });
      if (response.ok) {
        toast.success('Password changed successfully');
        setPasswordForm({
          old_password: '',
          new_password: '',
          confirm_password: ''
        });
      } else {
        toast.error('Failed to change password');
      }
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast.error(error.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleEmailChangeRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailChangeForm.new_email || !emailChangeForm.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsChangingEmail(true);
      const response = await profileService.emailChangeRequest({
        new_email: emailChangeForm.new_email,
        password: emailChangeForm.password
      });
      if (response.ok) {
        toast.success('Verification code sent to your new email');
        setEmailChangeStep('confirm');
      } else {
        toast.error('Failed to request email change');
      }
    } catch (error: any) {
      console.error('Error requesting email change:', error);
      toast.error(error.message || 'Failed to request email change');
    } finally {
      setIsChangingEmail(false);
    }
  };

  const handleEmailChangeConfirm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailChangeForm.code || emailChangeForm.code.length !== 6) {
      toast.error('Please enter the 6-digit verification code');
      return;
    }

    try {
      setIsChangingEmail(true);
      const response = await profileService.emailChangeConfirm({
        new_email: emailChangeForm.new_email,
        code: emailChangeForm.code
      });
      if (response.ok) {
        toast.success('Email changed successfully');
        setShowEmailChange(false);
        setEmailChangeStep('request');
        setEmailChangeForm({ new_email: '', password: '', code: '' });
        loadProfile();
      } else {
        toast.error('Failed to confirm email change');
      }
    } catch (error: any) {
      console.error('Error confirming email change:', error);
      toast.error(error.message || 'Failed to confirm email change');
    } finally {
      setIsChangingEmail(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setIsChangingEmail(true);
      const response = await profileService.resendEmailChangeCode({
        new_email: emailChangeForm.new_email,
        password: emailChangeForm.password
      });
      if (response.ok) {
        toast.success('Verification code resent');
      } else {
        toast.error('Failed to resend code');
      }
    } catch (error: any) {
      console.error('Error resending code:', error);
      toast.error(error.message || 'Failed to resend code');
    } finally {
      setIsChangingEmail(false);
    }
  };

  const handleCancelEmailChange = () => {
    setShowEmailChange(false);
    setEmailChangeStep('request');
    setEmailChangeForm({ new_email: '', password: '', code: '' });
  };

  const handleDeleteProfileAccount = async () => {
    if (!profile) return;

    try {
      setIsDeletingProfile(true);
      const response = await profileService.deleteAccount(profile.id);
      if (response.ok) {
        toast.success('Account deleted successfully');
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          await authService.logout(refreshToken);
        }
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else {
        toast.error('Failed to delete account');
      }
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast.error(error.message || 'Failed to delete account');
    } finally {
      setIsDeletingProfile(false);
      setShowDeleteProfileConfirm(false);
    }
  };

  const { items: customRequests } = useSelector((state: RootState) => state.requests)
  const { items: products, loading: productsLoading, error: productsError } = useSelector((state: RootState) => state.products)
  const { items: refunds } = useSelector((state: RootState) => state.refunds)
  const { items: returns } = useSelector((state: RootState) => state.returns)
  const { items: shipping } = useSelector((state: RootState) => state.shipping)
  const { items: payments } = useSelector((state: RootState) => state.payments)
  const { items: discounts } = useSelector((state: RootState) => state.discounts)
  const { items: feedback } = useSelector((state: RootState) => state.feedback)
  const { items: media } = useSelector((state: RootState) => state.media)
  const { items: orders } = useSelector((state: RootState) => state.orders)

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

  // Category Management State
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    requires_dimensions: false,
    requires_material: false,
    is_active: true
  })
  const [categoriesLoading, setCategoriesLoading] = useState(false)

  // Users Management State
  const { users, count, loading: usersLoading } = useSelector((state: RootState) => state.users)
  const [userSearch, setUserSearch] = useState('')
  const [userPage, setUserPage] = useState(1)
  const usersPerPage = 5
  const [showUserModal, setShowUserModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [userToDelete, setUserToDelete] = useState<any>(null)
  const [categoryToDelete, setCategoryToDelete] = useState<any>(null)
  const [requestToDelete, setRequestToDelete] = useState<any>(null)
  const [productToDelete, setProductToDelete] = useState<any>(null)
  const [discountToDelete, setDiscountToDelete] = useState<any>(null)
  const [mediaToDelete, setMediaToDelete] = useState<any>(null)
  const [isDeletingProduct, setIsDeletingProduct] = useState(false)
  const [isDeletingDiscount, setIsDeletingDiscount] = useState(false)
  const [isDeletingMedia, setIsDeletingMedia] = useState(false)

  // Initial load - fetch users, categories, and products
  useEffect(() => {
    dispatch(fetchUsers({ page: userPage, search: userSearch }))
  }, [dispatch, userPage, userSearch])

  useEffect(() => {
    loadCategories()
    dispatch(fetchAllProducts({}))
  }, [])

  // Load categories for product form
  const loadCategories = async () => {
    try {
      const response = await productsService.getCategories()
      if (response.ok && response.data) {
        const categoriesList = response.data.results || response.data
        setCategories(categoriesList)
      }
    } catch (error) {
      console.error('Error loading categories:', error)
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
      is_active: category.is_active !== undefined ? category.is_active : true
    })
    setShowCategoryForm(true)
  }

  const deleteCategory = (category: any) => {
    setCategoryToDelete(category)
  }

  const handleCategoryDeleteConfirm = async () => {
    if (!categoryToDelete) return

    try {
      setCategoriesLoading(true)
      const response = await productsService.deleteCategory(categoryToDelete.id)
      if (response.ok) {
        toast.success('Category deleted successfully')
        loadCategories()
      } else {
        toast.error('Failed to delete category')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error('Failed to delete category')
    } finally {
      setCategoriesLoading(false)
      setCategoryToDelete(null)
    }
  }

  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      description: '',
      requires_dimensions: false,
      requires_material: false,
      is_active: true
    })
    setEditingCategory(null)
  }

  const toggleCategoryStatus = async (category: any) => {
    try {
      const response = await productsService.updateCategory(category.id, {
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

  const deleteRequest = (request: any) => {
    setRequestToDelete(request)
  }

  const handleRequestDeleteConfirm = async () => {
    if (!requestToDelete) return

    try {
      await dispatch(removeRequest(requestToDelete.id)).unwrap()
      toast.success('Request deleted')
    } catch (error: any) {
      console.error('Error deleting request:', error)
      toast.error('Failed to delete request')
    } finally {
      setRequestToDelete(null)
    }
  }

  const deleteProduct = (product: any) => {
    setProductToDelete(product)
  }

  const handleProductDeleteConfirm = async () => {
    if (!productToDelete) return
    try {
      setIsDeletingProduct(true)
      await dispatch(deleteProductRedux(productToDelete.id)).unwrap()
      toast.success('Product deleted successfully')
    } catch (error: any) {
      console.error('Error deleting product:', error)
      toast.error('Failed to delete product: ' + (error.message || error))
    } finally {
      setIsDeletingProduct(false)
      setProductToDelete(null)
    }
  }

  const handleDiscountDeleteConfirm = async () => {
    if (!discountToDelete) return
    try {
      setIsDeletingDiscount(true)
      await dispatch(deleteDiscount(discountToDelete.id) as any).unwrap()
      toast.success('Discount deleted')
    } catch (error: any) {
      console.error('Error deleting discount:', error)
      toast.error('Failed to delete discount')
    } finally {
      setIsDeletingDiscount(false)
      setDiscountToDelete(null)
    }
  }

  const handleMediaDeleteConfirm = async () => {
    if (!mediaToDelete) return
    try {
      setIsDeletingMedia(true)
      await dispatch(deleteMedia(mediaToDelete.id) as any).unwrap()
      toast.success('Asset deleted')
    } catch (error: any) {
      console.error('Error deleting media:', error)
      toast.error('Failed to delete asset')
    } finally {
      setIsDeletingMedia(false)
      setMediaToDelete(null)
    }
  }

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const productData = {
        name: productForm.name,
        category: (productForm.category && !isNaN(Number(productForm.category))) ? Number(productForm.category) : productForm.category,
        short_description: productForm.short_description,
        detailed_description: productForm.detailed_description,
        unit_price: parseFloat(productForm.unit_price),
        available_colors: productForm.available_colors,
        available_materials: productForm.available_materials,
        published: productForm.published,
        currency: 'RWF',
        length: productForm.length ? parseFloat(productForm.length) : null,
        width: productForm.width ? parseFloat(productForm.width) : null,
        height: productForm.height ? parseFloat(productForm.height) : null,
        material: productForm.available_materials ? [productForm.available_materials] : [],
        materials: productForm.available_materials ? [productForm.available_materials] : []
      }

      let result: any
      if (editingProduct) {
        result = await dispatch(updateProduct({ id: editingProduct.id, data: productData })).unwrap()
      } else {
        result = await dispatch(createProduct(productData)).unwrap()
      }

      if (result && result.id) {
        // Upload multiple images if provided
        if (productImages.length > 0) {
          toast.loading('Uploading images...', { id: 'upload-progress' });

          const uploadResult = await adminProductService.uploadMultipleProductImages(
            result.id,
            productImages,
            mainImageIndex,
            productForm.name
          )

          toast.dismiss('upload-progress');

          if (!uploadResult.ok) {
            toast.error(uploadResult.error || 'Some images failed to upload');
          } else {
            toast.success('All images uploaded successfully');
            // Fetch the product again to get updated media data
            await new Promise(resolve => setTimeout(resolve, 500)); // Small delay for backend processing
            await dispatch(fetchProduct(result.id));
          }
        }

        toast.success(editingProduct ? 'Product updated successfully' : 'Product created successfully')
        setShowProductForm(false)
        resetProductForm()
        // Refresh all products to display updates
        if (!productImages.length) {
          dispatch(fetchAllProducts({}) as any) // Refresh to get all data
        }
      }
    } catch (error: any) {
      console.error('Error saving product:', error)
      const errorMsg = typeof error === 'object' ? (error.message || JSON.stringify(error)) : error;
      toast.error(errorMsg || 'Failed to save product')
    }
  }

  const editProduct = async (product: any) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      category: (product.category?.id || product.category || '').toString(),
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
      if (product.published) {
        await adminProductService.unpublishProduct(product.id)
      } else {
        await adminProductService.publishProduct(product.id)
      }
      toast.success(`Product ${product.published ? 'unpublished' : 'published'} successfully`)
      dispatch(fetchAllProducts({}))
    } catch (error: any) {
      console.error('Error toggling product status:', error)
      toast.error('Failed to update product status')
    }
  }

  const handleToggleStatus = async (id: string | number, currentStatus: boolean) => {
    try {
      await dispatch(toggleUserStatus({ id, is_active: currentStatus })).unwrap()
      // Refetch users to ensure UI is in sync with backend
      await dispatch(fetchUsers({ page: userPage, search: userSearch }))
      toast.success('Status updated successfully')
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status')
    }
  }

  const handleUserSubmitLocal = async (userData: any) => {
    try {
      if (selectedUser) {
        await dispatch(editUser({ id: selectedUser.id, userData }) as any).unwrap()
        toast.success('User updated successfully')
      } else {
        await dispatch(addUser(userData) as any).unwrap()
        toast.success('User created successfully')
      }
      setShowUserModal(false)
      setSelectedUser(null)
      // Refetch users to ensure we have the full object (including backend-generated fields like date_joined)
      await dispatch(fetchUsers({ page: userPage, search: userSearch }) as any)
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
    (u.full_name || '').toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.phone_number || '').includes(userSearch)
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

        <nav className="flex-1 w-full space-y-2 px-3 overflow-y-auto custom-scrollbar">
          <SidebarLink active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }} icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <SidebarLink active={activeTab === 'users'} onClick={() => { setActiveTab('users'); setIsSidebarOpen(false); }} icon={<UsersIcon size={20} />} label="Users" />
          <SidebarLink active={activeTab === 'categories'} onClick={() => { setActiveTab('categories'); setIsSidebarOpen(false); }} icon={<Briefcase size={20} />} label="Categories" />
          <SidebarLink active={activeTab === 'products'} onClick={() => { setActiveTab('products'); setIsSidebarOpen(false); }} icon={<ShoppingBag size={20} />} label="Products" />
          <SidebarLink active={activeTab === 'orders'} onClick={() => { setActiveTab('orders'); setIsSidebarOpen(false); }} icon={<ShoppingBag size={20} />} label="Shop Orders" />
          <SidebarLink active={activeTab === 'returns'} onClick={() => { setActiveTab('returns'); setIsSidebarOpen(false); }} icon={<RefreshCw size={20} />} label="Returns" />
          <SidebarLink active={activeTab === 'shipping'} onClick={() => { setActiveTab('shipping'); setIsSidebarOpen(false); }} icon={<Truck size={20} />} label="Shipping" />
          <SidebarLink active={activeTab === 'payments'} onClick={() => { setActiveTab('payments'); setIsSidebarOpen(false); }} icon={<DollarSign size={20} />} label="Payments" />
          <SidebarLink active={activeTab === 'discounts'} onClick={() => { setActiveTab('discounts'); setIsSidebarOpen(false); }} icon={<Tag size={20} />} label="Discounts" />
          <SidebarLink active={activeTab === 'feedback'} onClick={() => { setActiveTab('feedback'); setIsSidebarOpen(false); }} icon={<MessageSquare size={20} />} label="Feedback" />
          <SidebarLink active={activeTab === 'media'} onClick={() => { setActiveTab('media'); setIsSidebarOpen(false); }} icon={<ImageIcon size={20} />} label="Media" />
          <SidebarLink active={activeTab === 'refunds'} onClick={() => { setActiveTab('refunds'); setIsSidebarOpen(false); }} icon={<DollarSign size={20} />} label="Refunds" />
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
                  value={(customRequests || []).length.toString()}
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
                    <table className="w-full min-w-150">
                      <thead>
                        <tr className="border-b border-gray-50 dark:border-slate-800 text-left">
                          <th className="py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Client Name</th>
                          <th className="py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Service Type</th>
                          <th className="py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Design File</th>
                          <th className="py-4 text-right text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                        {((customRequests || []).slice(0, 5)).map((req: any) => (
                          <tr key={req.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all rounded-xl overflow-hidden">
                            <td className="py-5">
                              <p className="font-bold text-slate-800 dark:text-white">{req.name}</p>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400">{req.email}</p>
                            </td>
                            <td className="py-5">
                              <span className="px-3 py-1 rounded-lg bg-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase">{req.productType}</span>
                            </td>
                            <td className="py-5">
                              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate max-w-37.5">{req.files?.[0] || 'No file attached'}</p>
                            </td>
                            <td className="py-5 text-right">
                              <button className="bg-slate-100 dark:bg-slate-800 hover:bg-brand-primary hover:text-white p-2 rounded-lg text-slate-500 dark:text-slate-400 transition-all" aria-label="Download file" title="Download file">
                                <Download size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {(customRequests || []).length === 0 && (
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
                            <p className="font-black text-slate-800 dark:text-white text-sm">{((p.unit_price || p.price || 0)).toLocaleString()} </p>
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
            <div className="bg-white dark:bg-[#1E293B] p-6 md:p-10 rounded-4xl md:rounded-[40px] border border-gray-100 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-bottom-5 duration-500 transition-colors">
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
                <motion.form initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleCategorySubmit} className="mb-12 p-6 md:p-8 bg-slate-50 dark:bg-slate-800/50 rounded-4xl border border-gray-100 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-widest">{editingCategory ? 'Edit Category' : 'New Category'}</h3>
                    <button type="button" onClick={() => setShowCategoryForm(false)} className="w-10 h-10 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-red-500 transition-all"><X size={20} /></button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Category Name <span className="text-red-500">*</span></label>
                      <input type="text" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} className="w-full bg-white dark:bg-slate-800 px-5 py-4 rounded-2xl border border-gray-100 dark:border-slate-700 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all dark:text-white" placeholder="e.g., 3D Printing" required />
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
                          <button onClick={() => deleteCategory(cat)} className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-red-500 hover:bg-red-50/50 rounded-xl transition-all" title="Delete Category"><Trash2 size={20} /></button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="bg-white dark:bg-[#1E293B] p-6 md:p-10 rounded-4xl md:rounded-[40px] border border-gray-100 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-bottom-5 duration-500 transition-colors">
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
                  className="mb-12 p-6 md:p-8 bg-slate-50 dark:bg-slate-800/50 rounded-4xl border border-gray-100 dark:border-slate-800"
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
                                <img src={media.image_url || media.image} alt={media.alt_text || `Image ${index + 1}`} className="w-full h-full object-cover" />
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
                    {categories.find(c => String(c.id) === String(productForm.category))?.requires_dimensions && (
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
                ) : products.length === 0 ? (
                  <div className="col-span-2 text-center py-20 bg-slate-50 dark:bg-slate-800/30 rounded-[40px] border border-dashed border-slate-200 dark:border-slate-700">
                    <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                      <ShoppingBag className="text-slate-300 dark:text-slate-600" size={32} />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-bold">No products listed in the shop yet.</p>
                  </div>
                ) : (
                  (products || []).map((p: any) => (
                    <motion.div
                      key={p.id}
                      layout
                      className="group bg-white dark:bg-[#1E293B] p-6 rounded-4xl border border-slate-100 dark:border-slate-800 hover:border-brand-primary/30 dark:hover:border-brand-primary/50 hover:shadow-xl transition-all relative"
                    >
                      {/* Product Image Thumbnail */}
                      {(p.media && p.media.length > 0 && (p.media[0].image_url || p.media[0].image)) ? (
                        <div className="w-full h-48 mb-4 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                          <img
                            src={p.media[0].image_url || p.media[0].image}
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
                            onClick={() => deleteProduct(p)}
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
                          className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${p.published
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

          {
            activeTab === 'users' && (
              <div className="bg-white dark:bg-[#1E293B] p-6 md:p-10 rounded-4xl md:rounded-[40px] border border-gray-100 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-bottom-5 duration-500 transition-colors">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">User Management</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Manage administrator and client accounts</p>
                  </div>
                  <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
                    <div className="relative flex-1 sm:min-w-75">
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
                      onClick={() => { setSelectedUser(null); setShowUserModal(true); }}
                      className="flex items-center justify-center space-x-2 px-6 py-3 bg-brand-primary text-white rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-brand-primary/20"
                    >
                      <UserPlus size={20} />
                      <span>Add User</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto -mx-6 md:-mx-10 px-6 md:px-10">
                  <table className="w-full min-w-225">
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
                                {(u.full_name || 'U').charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-slate-800 dark:text-white">{u.full_name}</p>
                                <p className="text-[10px] text-slate-400 font-medium">ID: {String(u.id).substring(0, 8)}...</p>
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
                                onClick={() => { setSelectedUser(u); setShowUserModal(true); }}
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
            )
          }

          {
            activeTab === 'requests' && (
              <div className="bg-white dark:bg-[#1E293B] rounded-4xl md:rounded-[40px] border border-gray-100 dark:border-slate-800 p-6 md:p-10 shadow-sm min-h-125 transition-colors">
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
                      <ProductRequestCard
                        key={r.id}
                        request={r}
                        onUpdateStatus={async (newStatus: string) => {
                          try {
                            await dispatch(updateRequestStatus({ id: r.id, status: newStatus }) as any).unwrap();
                            toast.success(`Request status updated to ${newStatus}`);
                          } catch (err: any) {
                            toast.error(err || 'Failed to update status');
                          }
                        }}
                        onDelete={() => deleteRequest(r)}
                      />
                    ))
                  )}
                </div>
              </div>
            )
          }

          {
            activeTab === 'returns' && (
              <div className="bg-white dark:bg-[#1E293B] p-6 md:p-10 rounded-4xl md:rounded-[40px] border border-gray-100 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-bottom-5 duration-500">
                <div className="mb-10">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">Return Management</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Review and process customer return requests</p>
                </div>

                <div className="overflow-x-auto -mx-6 md:-mx-10 px-6 md:px-10">
                  <table className="w-full min-w-250">
                    <thead>
                      <tr className="border-b border-gray-50 dark:border-slate-800 text-left">
                        <th className="pb-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-4">Return ID</th>
                        <th className="pb-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Order Info</th>
                        <th className="pb-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest px-4">Refund Requested</th>
                        <th className="pb-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest px-4 text-center">Status</th>
                        <th className="pb-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-right pr-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                      {returns.map((ret: any) => (
                        <tr key={ret.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                          <td className="py-5 pl-4">
                            <p className="font-bold text-slate-800 dark:text-white">{ret.return_number}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{formatDate(ret.created_at)}</p>
                          </td>
                          <td className="py-5">
                            <p className="text-sm font-bold text-slate-800 dark:text-white">Order: {ret.order?.order_number || 'N/A'}</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-50">{ret.reason}</p>
                          </td>
                          <td className="py-5 px-4 font-black">
                            {(ret.requested_refund_amount || 0).toLocaleString()} RWF
                          </td>
                          <td className="py-5 px-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${ret.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' :
                              ret.status === 'REQUESTED' ? 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400' :
                                ret.status === 'REJECTED' ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400' :
                                  'bg-slate-50 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400'
                              }`}>
                              {ret.status}
                            </span>
                          </td>
                          <td className="py-5 text-right pr-4">
                            <div className="flex items-center justify-end gap-2">
                              {ret.status === 'REQUESTED' && (
                                <>
                                  <button
                                    onClick={async () => {
                                      if (window.confirm('Approve this return request?')) {
                                        await dispatch(approveReturn(ret.id) as any);
                                        toast.success('Return approved');
                                      }
                                    }}
                                    className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-[10px] font-black uppercase hover:brightness-110 transition-all"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={async () => {
                                      const reason = window.prompt('Enter rejection reason:');
                                      if (reason !== null) {
                                        await dispatch(rejectReturn({ id: ret.id, reason }) as any);
                                        toast.error('Return rejected');
                                      }
                                    }}
                                    className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-[10px] font-black uppercase hover:brightness-110 transition-all"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                              {ret.status === 'APPROVED' && (
                                <button
                                  onClick={async () => {
                                    if (window.confirm('Mark this return as completed?')) {
                                      await dispatch(completeReturnRequest(ret.id) as any);
                                      toast.success('Return completed');
                                    }
                                  }}
                                  className="px-3 py-1.5 bg-brand-primary text-white rounded-lg text-[10px] font-black uppercase hover:brightness-110 transition-all"
                                >
                                  Complete
                                </button>
                              )}
                              <button
                                className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-xl transition-all"
                                title="View Details"
                              >
                                <Eye size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {returns.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-20 text-center text-slate-500 dark:text-slate-400 text-sm font-bold">
                            No return requests found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          }

          {
            activeTab === 'shipping' && (
              <div className="bg-white dark:bg-[#1E293B] p-6 md:p-10 rounded-4xl md:rounded-[40px] border border-gray-100 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-bottom-5 duration-500">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">Shipping Management</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Track and manage shipments via /api/v1/orders/shipping/</p>
                  </div>
                </div>


                {/* Shipments Table */}
                <div className="overflow-x-auto -mx-6 md:-mx-10 px-6 md:px-10">
                  <table className="w-full min-w-[750px]">
                    <thead>
                      <tr className="border-b border-gray-50 dark:border-slate-800 text-left">
                        <th className="pb-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-4">ID</th>
                        <th className="pb-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Order</th>
                        <th className="pb-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest px-4">Address</th>
                        <th className="pb-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest px-4">Fee</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                      {shipping.map((ship: ShippingRecord) => (
                        <tr key={ship.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                          <td className="py-5 pl-4 pr-2 font-bold text-slate-800 dark:text-white text-sm">
                            #{ship.id?.toString().slice(-6).toUpperCase() || 'N/A'}
                          </td>
                          <td className="py-5">
                            <p className="text-sm font-bold text-slate-800 dark:text-white">{ship.order?.order_number || 'N/A'}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{formatDate(ship.created_at)}</p>
                          </td>
                          <td className="py-5 px-4">
                            <p className="text-sm font-bold text-slate-800 dark:text-white">
                              {[ship.street_address, ship.sector, ship.district].filter(Boolean).join(', ') || 'N/A'}
                            </p>
                            {ship.shipping_phone && (
                              <p className="text-[10px] text-slate-400 font-medium">{ship.shipping_phone}</p>
                            )}
                          </td>
                          <td className="py-5 px-4 font-bold text-slate-800 dark:text-white text-sm">
                            {ship.shipping_fee ? `${Number(ship.shipping_fee).toLocaleString()} RWF` : '—'}
                          </td>
                        </tr>
                      ))}
                      {shipping.length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-20 text-center text-slate-500 dark:text-slate-400 text-sm font-bold">
                            No shipping records found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          }

          {
            activeTab === 'payments' && (
              <div className="bg-white dark:bg-[#1E293B] p-6 md:p-10 rounded-4xl md:rounded-[40px] border border-gray-100 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-bottom-5 duration-500">
                <div className="mb-10">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">Payment Transactions</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Monitor and manage all payment activities</p>
                </div>

                <div className="overflow-x-auto -mx-6 md:-mx-10 px-6 md:px-10">
                  <table className="w-full min-w-250">
                    <thead>
                      <tr className="border-b border-gray-50 dark:border-slate-800 text-left">
                        <th className="pb-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-4">Transaction ID</th>
                        <th className="pb-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Customer</th>
                        <th className="pb-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest px-4">Amount</th>
                        <th className="pb-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest px-4">Method</th>
                        <th className="pb-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest px-4 text-center">Status</th>
                        <th className="pb-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-right pr-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                      {payments.map((pay: PaymentRecord) => (
                        <tr key={pay.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                          <td className="py-5 pl-4">
                            <p className="font-bold text-slate-800 dark:text-white">#{pay.id?.toString().slice(-8).toUpperCase() || 'N/A'}</p>
                            <p className="text-[10px] text-slate-400 font-medium select-all">{pay.reference || 'N/A'}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{formatDate(pay.created_at)}</p>
                          </td>
                          <td className="py-5">
                            <p className="text-sm font-bold text-slate-800 dark:text-white">{pay.customer_name || 'N/A'}</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">{pay.customer_email || 'N/A'}</p>
                          </td>
                          <td className="py-5 px-4 font-black">
                            {(pay.amount || 0).toLocaleString()} {pay.currency || 'RWF'}
                          </td>
                          <td className="py-5 px-4 font-bold text-xs">
                            <span className="uppercase tracking-widest">{pay.payment_method || 'N/A'}</span>
                          </td>
                          <td className="py-5 px-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${pay.status === 'SUCCESSFUL' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' :
                              pay.status === 'PENDING' ? 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400' :
                                pay.status === 'FAILED' ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400' :
                                  'bg-slate-50 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400'
                              }`}>
                              {pay.status}
                            </span>
                          </td>
                          <td className="py-5 text-right pr-4">
                            <div className="flex items-center justify-end gap-2">
                              {pay.status === 'PENDING' && (
                                <button
                                  onClick={async () => {
                                    if (window.confirm('Cancel this pending payment?')) {
                                      await dispatch(cancelPayment(pay.id) as any);
                                      toast.success('Payment cancelled');
                                    }
                                  }}
                                  className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-[10px] font-black uppercase hover:brightness-110 transition-all"
                                >
                                  Cancel
                                </button>
                              )}
                              <button
                                className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-xl transition-all"
                                title="View Details"
                              >
                                <Eye size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {payments.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-20 text-center text-slate-500 dark:text-slate-400 text-sm font-bold">
                            No payment records found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          }

          {
            activeTab === 'discounts' && (
              <div className="bg-white dark:bg-[#1E293B] p-6 md:p-10 rounded-4xl md:rounded-[40px] border border-gray-100 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-bottom-5 duration-500">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">Discount Management</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Manage promo codes and product discounts</p>
                  </div>
                  <button
                    onClick={() => toast.error('Create discount coming soon')}
                    className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-2xl hover:brightness-110 transition-all font-bold text-xs uppercase tracking-widest shadow-lg shadow-brand-primary/25"
                  >
                    <Plus size={16} />
                    New Discount
                  </button>
                </div>

                <div className="overflow-x-auto -mx-6 md:-mx-10 px-6 md:px-10">
                  <table className="w-full min-w-250">
                    <thead>
                      <tr className="border-b border-gray-50 dark:border-slate-800 text-left">
                        <th className="pb-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-4">Code</th>
                        <th className="pb-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Type</th>
                        <th className="pb-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest px-4">Value</th>
                        <th className="pb-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest px-4">Usage</th>
                        <th className="pb-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest px-4 text-center">Status</th>
                        <th className="pb-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-right pr-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                      {discounts.map((discount: any) => (
                        <tr key={discount.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                          <td className="py-5 pl-4 px-4 font-black text-brand-primary">
                            {discount.code || 'N/A'}
                          </td>
                          <td className="py-5">
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                              {discount.discount_type || 'N/A'}
                            </span>
                          </td>
                          <td className="py-5 px-4 font-black">
                            {discount.discount_type === 'PERCENTAGE' ? `${discount.value || 0}%` : `${(discount.value || 0).toLocaleString()} RWF`}
                          </td>
                          <td className="py-5 px-4 text-sm font-bold text-slate-600 dark:text-slate-400">
                            {discount.usage_count || 0} / {discount.usage_limit || '∞'}
                          </td>
                          <td className="py-5 px-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${discount.active ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
                              }`}>
                              {discount.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="py-5 text-right pr-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => toast.error('Edit coming soon')}
                                className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-xl transition-all"
                                title="Edit Discount"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => setDiscountToDelete(discount)}
                                className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-red-500 hover:bg-red-50/50 rounded-xl transition-all"
                                title="Delete Discount"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {discounts.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-20 text-center text-slate-500 dark:text-slate-400 text-sm font-bold">
                            No discounts found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          }

          {
            activeTab === 'feedback' && (
              <div className="bg-white dark:bg-[#1E293B] p-6 md:p-10 rounded-4xl md:rounded-[40px] border border-gray-100 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-bottom-5 duration-500">
                <div className="mb-10">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">Customer Feedback</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Moderate and manage product reviews</p>
                </div>

                <div className="overflow-x-auto -mx-6 md:-mx-10 px-6 md:px-10">
                  <table className="w-full min-w-250">
                    <thead>
                      <tr className="border-b border-gray-50 dark:border-slate-800 text-left">
                        <th className="pb-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-4">Client</th>
                        <th className="pb-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Product</th>
                        <th className="pb-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest px-4">Rating</th>
                        <th className="pb-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest px-4">Comment</th>
                        <th className="pb-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest px-4 text-center">Status</th>
                        <th className="pb-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-right pr-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                      {feedback.map((review: any) => (
                        <tr key={review.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                          <td className="py-5 pl-4 px-4 font-bold text-slate-800 dark:text-white">
                            {review.client_name || 'Anonymous'}
                            <p className="text-[10px] text-slate-400 font-medium">{formatDate(review.created_at)}</p>
                          </td>
                          <td className="py-5">
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                              {review.product_name || (review.product ? `Product ID: ${review.product}` : 'Unknown Product')}
                            </span>
                          </td>
                          <td className="py-5 px-4">
                            <div className="flex text-yellow-500">
                              {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />)}
                            </div>
                          </td>
                          <td className="py-5 px-4">
                            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 max-w-75">
                              {review.comment}
                            </p>
                          </td>
                          <td className="py-5 px-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${review.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' :
                              review.status === 'PENDING' ? 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400' :
                                'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
                              }`}>
                              {review.status}
                            </span>
                          </td>
                          <td className="py-5 text-right pr-4">
                            <div className="flex items-center justify-end gap-2">
                              {review.status === 'PENDING' && (
                                <>
                                  <button
                                    onClick={async () => {
                                      await dispatch(moderateFeedback({ id: review.id, status: 'APPROVED' }) as any);
                                      toast.success('Feedback approved');
                                    }}
                                    className="p-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:brightness-110 rounded-xl transition-all"
                                    title="Approve"
                                  >
                                    <CheckCircle2 size={16} />
                                  </button>
                                  <button
                                    onClick={async () => {
                                      const reason = window.prompt('Enter rejection reason:');
                                      if (reason !== null) {
                                        await dispatch(moderateFeedback({ id: review.id, status: 'REJECTED', comment: reason }) as any);
                                        toast.error('Feedback rejected');
                                      }
                                    }}
                                    className="p-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:brightness-110 rounded-xl transition-all"
                                    title="Reject"
                                  >
                                    <X size={16} />
                                  </button>
                                </>
                              )}
                              <button
                                onClick={async () => {
                                  if (window.confirm('Delete this feedback entry?')) {
                                    await dispatch(deleteFeedback(review.id) as any);
                                    toast.success('Feedback deleted');
                                  }
                                }}
                                className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-red-500 hover:bg-red-50/50 rounded-xl transition-all"
                                title="Delete Forever"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {feedback.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-20 text-center text-slate-500 dark:text-slate-400 text-sm font-bold">
                            No feedback records found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          }

          {
            activeTab === 'media' && (
              <div className="bg-white dark:bg-[#1E293B] p-6 md:p-10 rounded-4xl md:rounded-[40px] border border-gray-100 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-bottom-5 duration-500">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">Media Gallery</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Manage all product images, videos, and 3D models</p>
                  </div>
                  <button
                    onClick={() => toast.error('Upload coming soon')}
                    className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-2xl hover:brightness-110 transition-all font-bold text-xs uppercase tracking-widest shadow-lg shadow-brand-primary/25"
                  >
                    <Upload size={16} />
                    Upload Media
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {media.map((m: any) => (
                    <div key={m.id} className="group relative aspect-square bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:shadow-brand-primary/10 transition-all duration-300">
                      {m.media_type === 'IMAGE' ? (
                        <img src={m.image_url} alt="" className="w-full h-full object-cover" />
                      ) : m.media_type === 'VIDEO' ? (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 group-hover:text-brand-primary">
                          <Video size={40} className="mb-2" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Video</span>
                        </div>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 group-hover:text-brand-primary">
                          <Box size={40} className="mb-2" />
                          <span className="text-[10px] font-black uppercase tracking-widest">3D Model</span>
                        </div>
                      )}

                      <div className="absolute inset-x-0 bottom-0 p-3 bg-linear-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform">
                        <p className="text-[10px] font-bold text-white truncate mb-1">{m.product_name || `ID: ${m.product}`}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] text-slate-300 font-black uppercase tracking-tighter">Order: {m.display_order}</span>
                          <button
                            onClick={() => setMediaToDelete(m)}
                            className="p-1.5 bg-red-500 text-white rounded-lg hover:brightness-110 transition-all"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {media.length === 0 && (
                    <div className="col-span-full py-24 text-center">
                      <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ImageIcon size={32} className="text-slate-300" />
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-bold">No media assets found.</p>
                    </div>
                  )}
                </div>
              </div>
            )
          }

          {
            activeTab === 'refunds' && (
              <div className="bg-white dark:bg-[#1E293B] p-6 md:p-10 rounded-4xl md:rounded-[40px] border border-gray-100 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-bottom-5 duration-500">
                <div className="mb-10">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">Refund Management</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Process and track customer refund requests</p>
                </div>

                <div className="overflow-x-auto -mx-6 md:-mx-10 px-6 md:px-10">
                  <table className="w-full min-w-225">
                    <thead>
                      <tr className="border-b border-gray-50 dark:border-slate-800 text-left">
                        <th className="pb-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-4">Refund ID</th>
                        <th className="pb-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Order Info</th>
                        <th className="pb-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest px-4">Amount</th>
                        <th className="pb-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest px-4 text-center">Status</th>
                        <th className="pb-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-right pr-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                      {refunds.map((refund: any) => (
                        <tr key={refund.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                          <td className="py-5 pl-4">
                            <p className="font-bold text-slate-800 dark:text-white">{refund.refund_number}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{formatDate(refund.created_at)}</p>
                          </td>
                          <td className="py-5">
                            <p className="text-sm font-bold text-slate-800 dark:text-white">Order: {refund.order?.order_number || 'N/A'}</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-50">{refund.reason || 'N/A'}</p>
                          </td>
                          <td className="py-5 px-4 font-black">
                            {(refund.amount || 0).toLocaleString()} RWF
                          </td>
                          <td className="py-5 px-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${refund.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' :
                              refund.status === 'PENDING' ? 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400' :
                                'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
                              }`}>
                              {refund.status}
                            </span>
                          </td>
                          <td className="py-5 text-right pr-4">
                            <div className="flex items-center justify-end gap-2">
                              {refund.status === 'PENDING' && (
                                <>
                                  <button
                                    onClick={async () => {
                                      if (window.confirm('Mark this refund as completed?')) {
                                        await dispatch(completeRefund(refund.id));
                                        toast.success('Refund completed');
                                      }
                                    }}
                                    className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-[10px] font-black uppercase hover:brightness-110 transition-all"
                                  >
                                    Complete
                                  </button>
                                  <button
                                    onClick={async () => {
                                      if (window.confirm('Mark this refund as failed?')) {
                                        await dispatch(failRefund(refund.id));
                                        toast.error('Refund failed');
                                      }
                                    }}
                                    className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-[10px] font-black uppercase hover:brightness-110 transition-all"
                                  >
                                    Fail
                                  </button>
                                </>
                              )}
                              <button
                                className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-xl transition-all"
                                title="View Details"
                              >
                                <Eye size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {refunds.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-20 text-center text-slate-500 dark:text-slate-400 text-sm font-bold">
                            No refund requests found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          }

          {
            activeTab === 'orders' && (
              <div className="bg-white dark:bg-[#1E293B] rounded-4xl md:rounded-[40px] border border-gray-100 dark:border-slate-800 p-6 md:p-10 shadow-sm text-center py-20 md:py-32 transition-colors">
                <ShoppingBag className="mx-auto text-slate-200 dark:text-slate-700 mb-6" size={64} />
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Order Tracking System</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">This complex logistics module is currently being integrated with our carrier APIs. Status updates will appear here soon.</p>
              </div>
            )
          }

          {
            activeTab === 'settings' && (
              <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
                {/* Header */}
                <div className="bg-white dark:bg-[#1E293B] rounded-4xl md:rounded-[40px] border border-gray-100 dark:border-slate-800 p-8 text-center shadow-sm transition-colors">
                  {loadingProfile ? (
                    <div className="py-12">
                      <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-400">Loading profile...</p>
                    </div>
                  ) : !profile ? (
                    <div className="py-12">
                      <p className="text-gray-400">Failed to load profile</p>
                      <button onClick={loadProfile} className="mt-4 text-brand-primary font-bold hover:underline">Retry</button>
                    </div>
                  ) : (
                    <>
                      <div className="w-24 h-24 bg-linear-to-br from-brand-primary to-brand-secondary rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4 shadow-xl">
                        {profile.full_name?.charAt(0).toUpperCase()}
                      </div>
                      <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
                        {profile.full_name}
                      </h1>
                      <p className="text-gray-500 dark:text-gray-400">{profile.email}</p>
                      <div className="flex items-center justify-center gap-2 mt-4">
                        <span className="inline-block px-4 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400">
                          {profile.user_type}
                        </span>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${profile.is_active
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-red-500/10 text-red-400'
                          }`}>
                          {profile.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {profile && (
                  <>
                    {/* Profile Information Card */}
                    <div className="bg-white dark:bg-[#1E293B] rounded-4xl md:rounded-[40px] border border-gray-100 dark:border-slate-800 p-8 shadow-sm transition-colors">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center">
                          <User className="mr-2" size={24} />
                          Profile Information
                        </h2>
                        {!isEditingProfile ? (
                          <button
                            onClick={() => setIsEditingProfile(true)}
                            className="flex items-center space-x-2 px-4 py-2 bg-brand-primary text-white rounded-xl font-bold hover:brightness-110 transition-all"
                          >
                            <Edit2 size={18} />
                            <span>Edit</span>
                          </button>
                        ) : (
                          <div className="flex space-x-2">
                            <button
                              onClick={handleCancelEditProfile}
                              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                            >
                              <X size={18} />
                              <span>Cancel</span>
                            </button>
                            <button
                              onClick={handleSaveProfile}
                              disabled={isSavingProfile}
                              className="flex items-center space-x-2 px-4 py-2 bg-brand-primary text-white rounded-xl font-bold hover:brightness-110 transition-all disabled:opacity-50"
                            >
                              <Save size={18} />
                              <span>{isSavingProfile ? 'Saving...' : 'Save'}</span>
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="space-y-6">
                        {/* Full Name */}
                        <div>
                          <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">
                            Full Name
                          </label>
                          {isEditingProfile ? (
                            <input
                              type="text"
                              value={profileFormState.full_name}
                              onChange={(e) => setProfileFormState({ ...profileFormState, full_name: e.target.value })}
                              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all text-slate-800 dark:text-white"
                            />
                          ) : (
                            <div className="flex items-center px-4 py-3 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-transparent">
                              <User size={20} className="text-gray-500 mr-3" />
                              <span className="text-slate-800 dark:text-white">{profile.full_name}</span>
                            </div>
                          )}
                        </div>

                        {/* Email (Read-only with change option) */}
                        <div>
                          <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">
                            Email Address
                          </label>
                          <div className="flex items-center px-4 py-3 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-transparent">
                            <Mail size={20} className="text-gray-500 mr-3" />
                            <span className="text-slate-800 dark:text-white">{profile.email}</span>
                            <button
                              onClick={() => setShowEmailChange(!showEmailChange)}
                              className="ml-auto text-xs bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-lg font-bold hover:bg-brand-primary/20 transition-all"
                            >
                              Change Email
                            </button>
                          </div>
                        </div>

                        {/* Email Change Section */}
                        <AnimatePresence>
                          {showEmailChange && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mt-4">
                                {emailChangeStep === 'request' ? (
                                  <form onSubmit={handleEmailChangeRequest} className="space-y-4">
                                    <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-2">Change Email Address</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                                      A verification code will be sent to your new email address.
                                    </p>
                                    <div>
                                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
                                        New Email Address
                                      </label>
                                      <input
                                        type="email"
                                        value={emailChangeForm.new_email}
                                        onChange={(e) => setEmailChangeForm({ ...emailChangeForm, new_email: e.target.value })}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-900/60 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all text-slate-800 dark:text-white"
                                        placeholder="Enter new email"
                                        required
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
                                        Current Password
                                      </label>
                                      <div className="relative">
                                        <input
                                          type={showEmailPassword ? 'text' : 'password'}
                                          value={emailChangeForm.password}
                                          onChange={(e) => setEmailChangeForm({ ...emailChangeForm, password: e.target.value })}
                                          className="w-full px-4 py-3 bg-white dark:bg-gray-900/60 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all text-slate-800 dark:text-white pr-12"
                                          placeholder="Enter current password"
                                          required
                                        />
                                        <button
                                          type="button"
                                          onClick={() => setShowEmailPassword(!showEmailPassword)}
                                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                                        >
                                          {showEmailPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <button
                                        type="button"
                                        onClick={handleCancelEmailChange}
                                        className="flex-1 px-4 py-2.5 bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-700 transition-all text-sm"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        type="submit"
                                        disabled={isChangingEmail}
                                        className="flex-1 px-4 py-2.5 bg-brand-primary text-white rounded-xl font-bold hover:brightness-110 transition-all disabled:opacity-50 text-sm"
                                      >
                                        {isChangingEmail ? 'Sending...' : 'Send Code'}
                                      </button>
                                    </div>
                                  </form>
                                ) : (
                                  <form onSubmit={handleEmailChangeConfirm} className="space-y-4">
                                    <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-2">Verify New Email</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                                      Enter the 6-digit code sent to <span className="text-slate-800 dark:text-white font-bold">{emailChangeForm.new_email}</span>
                                    </p>
                                    <div>
                                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
                                        Verification Code
                                      </label>
                                      <input
                                        type="text"
                                        value={emailChangeForm.code}
                                        onChange={(e) => {
                                          const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                                          setEmailChangeForm({ ...emailChangeForm, code: val });
                                        }}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-900/60 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all text-slate-800 dark:text-white text-center text-2xl tracking-[0.5em] font-mono"
                                        placeholder="000000"
                                        maxLength={6}
                                        required
                                      />
                                    </div>
                                    <div className="flex gap-2">
                                      <button
                                        type="button"
                                        onClick={handleCancelEmailChange}
                                        className="flex-1 px-4 py-2.5 bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-700 transition-all text-sm"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        type="submit"
                                        disabled={isChangingEmail}
                                        className="flex-1 px-4 py-2.5 bg-brand-primary text-white rounded-xl font-bold hover:brightness-110 transition-all disabled:opacity-50 text-sm"
                                      >
                                        {isChangingEmail ? 'Confirming...' : 'Confirm'}
                                      </button>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={handleResendCode}
                                      disabled={isChangingEmail}
                                      className="w-full flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white transition-colors disabled:opacity-50"
                                    >
                                      <RefreshCw size={14} />
                                      Resend verification code
                                    </button>
                                  </form>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Phone Number */}
                        <div>
                          <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">
                            Phone Number
                          </label>
                          {isEditingProfile ? (
                            <input
                              type="tel"
                              value={profileFormState.phone_number}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                setProfileFormState({ ...profileFormState, phone_number: value === '' ? '' : Number(value) });
                              }}
                              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all text-slate-800 dark:text-white"
                            />
                          ) : (
                            <div className="flex items-center px-4 py-3 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-transparent">
                              <Phone size={20} className="text-gray-500 mr-3" />
                              <span className="text-slate-800 dark:text-white">{profile.phone_number}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Security Card */}
                    <div className="bg-white dark:bg-[#1E293B] rounded-4xl md:rounded-[40px] border border-gray-100 dark:border-slate-800 p-8 shadow-sm transition-colors">
                      <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center mb-6">
                        <Lock className="mr-2" size={24} />
                        Change Password
                      </h2>

                      <form onSubmit={handleChangePassword} className="space-y-6">
                        {/* Current Password */}
                        <div>
                          <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">
                            Current Password
                          </label>
                          <div className="relative">
                            <input
                              type={showOldPassword ? 'text' : 'password'}
                              value={passwordForm.old_password}
                              onChange={(e) => setPasswordForm({ ...passwordForm, old_password: e.target.value })}
                              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all text-slate-800 dark:text-white pr-12"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowOldPassword(!showOldPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                            >
                              {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                          </div>
                        </div>

                        {/* New Password */}
                        <div>
                          <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">
                            New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? 'text' : 'password'}
                              value={passwordForm.new_password}
                              onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all text-slate-800 dark:text-white pr-12"
                              required
                              minLength={8}
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                            >
                              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Must be at least 8 characters long
                          </p>
                        </div>

                        {/* Confirm New Password */}
                        <div>
                          <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">
                            Confirm New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              value={passwordForm.confirm_password}
                              onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all text-slate-800 dark:text-white pr-12"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                            >
                              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isChangingPassword}
                          className="w-full px-6 py-3 bg-brand-primary text-white rounded-xl font-bold hover:brightness-110 transition-all disabled:opacity-50"
                        >
                          {isChangingPassword ? 'Changing Password...' : 'Change Password'}
                        </button>
                      </form>
                    </div>

                    {/* Account Details Card */}
                    <div className="bg-white dark:bg-[#1E293B] rounded-4xl md:rounded-[40px] border border-gray-100 dark:border-slate-800 p-8 shadow-sm transition-colors">
                      <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center mb-6">
                        <Shield className="mr-2" size={24} />
                        Account Details
                      </h2>

                      <div className="space-y-4">

                        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-white/10">
                          <span className="text-gray-500 dark:text-gray-400">Status</span>
                          <span className={`font-bold ${profile.is_active ? 'text-green-500' : 'text-red-500'}`}>
                            {profile.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-white/10">
                          <span className="text-gray-500 dark:text-gray-400">Phone Number</span>
                          <span className="font-bold text-slate-800 dark:text-white">{String(profile.phone_number || 'N/A')}</span>
                        </div>
                        <div className="flex items-center justify-between py-3">
                          <span className="text-gray-500 dark:text-gray-400">Last Updated</span>
                          <span className="font-bold text-slate-800 dark:text-white">{profile.updated_at ? formatDate(profile.updated_at) : 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* System Settings (Preserved) */}
                <div className="bg-white dark:bg-[#1E293B] rounded-4xl md:rounded-[40px] border border-gray-100 dark:border-slate-800 p-8 shadow-sm transition-colors">
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

                {/* Danger Zone */}
                {profile && (
                  <div className="bg-red-500/5 border border-red-500/20 rounded-4xl md:rounded-[40px] shadow-xl p-8 mb-6">
                    <h2 className="text-xl font-bold text-red-500 flex items-center mb-4">
                      <AlertTriangle className="mr-2" size={24} />
                      Danger Zone
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button
                      onClick={() => setShowDeleteProfileConfirm(true)}
                      className="bg-red-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-600 transition-all flex items-center"
                    >
                      <Trash2 size={18} className="mr-2" />
                      Delete Account
                    </button>
                  </div>
                )}
              </div>
            )}
        </div >
      </main >

      <UserModal
        isOpen={showUserModal}
        onClose={() => { setShowUserModal(false); setSelectedUser(null); }}
        onSubmit={handleUserSubmitLocal}
        user={selectedUser}
        loading={usersLoading}
      />

      <DeleteConfirmModal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        message={`Are you sure you want to delete ${userToDelete?.full_name}? This action cannot be undone.`}
        loading={usersLoading}
      />

      <DeleteConfirmModal
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleCategoryDeleteConfirm}
        title="Delete Category"
        message={`Are you sure you want to delete the category "${categoryToDelete?.name}"? This may affect products linked to this category.`}
        loading={categoriesLoading}
      />

      <DeleteConfirmModal
        isOpen={!!requestToDelete}
        onClose={() => setRequestToDelete(null)}
        onConfirm={handleRequestDeleteConfirm}
        title="Delete Custom Request"
        message={`Are you sure you want to delete the request from ${requestToDelete?.client_name || requestToDelete?.name}? This action cannot be undone.`}
      />

      <DeleteConfirmModal
        isOpen={showDeleteProfileConfirm}
        onClose={() => setShowDeleteProfileConfirm(false)}
        onConfirm={handleDeleteProfileAccount}
        title="Delete Your Account"
        message="Are you sure you want to delete your account? This action cannot be undone and you will lose all access immediately."
        loading={isDeletingProfile}
      />

      <DeleteConfirmModal
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleProductDeleteConfirm}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
        loading={isDeletingProduct}
      />

      <DeleteConfirmModal
        isOpen={!!discountToDelete}
        onClose={() => setDiscountToDelete(null)}
        onConfirm={handleDiscountDeleteConfirm}
        title="Delete Discount"
        message={`Are you sure you want to delete the discount code "${discountToDelete?.code}"? This action cannot be undone.`}
        loading={isDeletingDiscount}
      />

      <DeleteConfirmModal
        isOpen={!!mediaToDelete}
        onClose={() => setMediaToDelete(null)}
        onConfirm={handleMediaDeleteConfirm}
        title="Delete Media Asset"
        message={`Are you sure you want to delete this media asset? This action cannot be undone.`}
        loading={isDeletingMedia}
      />

    </div >
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
      <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-2 flex items-center">
        {trend.includes('+') ? <CheckCircle2 size={12} className="text-brand-primary mr-1" /> : (label === "Pending Requests") ? <AlertCircle size={12} className="text-brand-orange mr-1" /> : <div className="w-1.5 h-1.5 bg-brand-primary rounded-full mr-1" />}
        {trend}
      </div>
    </div>
  </div>
)

const ProductRequestCard: React.FC<{ request: any; onUpdateStatus: (status: string) => void; onDelete: () => void }> = ({ request, onUpdateStatus, onDelete }) => (
  <div className="p-8 bg-white dark:bg-slate-800/40 rounded-[40px] border border-gray-100 dark:border-slate-800/50 group transition-all hover:border-brand-primary/20">
    <div className="flex justify-between items-start mb-8">
      <div className="flex items-center space-x-6">
        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-brand-primary shadow-inner">
          <Files size={28} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white leading-tight">{request.client_name}</h3>
          <p className="text-xs text-brand-primary font-black uppercase tracking-widest mt-1">{request.service_category_name || 'General Inquiry'}</p>
        </div>
      </div>
      <button onClick={onDelete} className="w-10 h-10 bg-white dark:bg-slate-800 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 rounded-xl flex items-center justify-center border border-gray-100 dark:border-slate-700 transition-all shadow-sm" aria-label="Delete request" title="Delete request">
        <Trash2 size={20} />
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <RequestDetail label="Title" value={request.title} />
      <RequestDetail label="Email" value={request.client_email} />
      <RequestDetail label="Phone" value={request.client_phone} />
      <RequestDetail label="Budget (RWF)" value={request.budget ? Number(request.budget).toLocaleString() : 'N/A'} />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <RequestDetail label="Submitted On" value={formatDate(request.created_at)} />
      <div className="flex flex-col">
        <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Manage Status</p>
        <div className="flex flex-wrap gap-2">
          {['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map((status) => (
            <button
              key={status}
              onClick={() => onUpdateStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border ${request.status === status
                ? 'bg-brand-primary/10 text-brand-primary border-brand-primary'
                : 'bg-slate-50 dark:bg-slate-900 border-gray-100 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>
    </div>

    <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-4xl border border-gray-100 dark:border-slate-800 shadow-inner mb-8 transition-colors">
      <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Project Description</p>
      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{request.description}</p>
    </div>

    {request.reference_file && (
      <div className="flex items-center">
        <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mr-4">Reference File:</span>
        <a
          href={request.reference_file}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 bg-brand-primary/10 text-brand-primary px-5 py-2.5 rounded-xl hover:bg-brand-primary/20 text-xs font-bold transition-all"
        >
          <Download size={16} />
          <span>View / Download Attachment</span>
        </a>
      </div>
    )}
  </div>
)

const formatDate = (dateString: any) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    return 'N/A';
  }
};

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

