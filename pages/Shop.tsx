import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, ArrowRight, ShoppingCart, X, Trash2, Loader2, Play } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PRODUCTS } from '@/constants'
import { productsService } from '@/services/productsService'
import toast from 'react-hot-toast'

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  currency: string;
}


const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showCart, setShowCart] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    // Load cart from localStorage
    try {
      const savedCart = localStorage.getItem('cart_items');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  }, [])

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.price, 0);
  }

  // Fetch products and categories on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError('')

        // Fetch categories
        const categoriesRes = await productsService.getCategories()
        if (categoriesRes.ok && categoriesRes.data) {
          const categoriesList = categoriesRes.data.results || categoriesRes.data
          setCategories(categoriesList.filter((cat: any) => cat.is_active))
        }

        // Fetch published products from backend
        const productsRes = await productsService.getPublishedProducts()
        if (productsRes.ok && productsRes.data) {
          const productsList = productsRes.data.results || productsRes.data
          
          // Fetch media for each product
          const productsWithMedia = await Promise.all(
            productsList.map(async (product: any) => {
              try {
                const mediaRes = await productsService.getProductMedia(product.id)
                if (mediaRes.ok && mediaRes.data) {
                  const mediaList = mediaRes.data.results || mediaRes.data
                  const sortedMedia = mediaList.sort((a: any, b: any) => a.display_order - b.display_order)
                  return { ...product, media: sortedMedia }
                }
                return { ...product, media: [] }
              } catch (err) {
                console.error(`Error fetching media for product ${product.id}:`, err)
                return { ...product, media: [] }
              }
            })
          )
          
          setProducts(productsWithMedia)
        } else {
          // Fallback to empty array if API fails
          setProducts([])
          setError('Failed to load products')
        }

      } catch (err: any) {
        console.error('Error fetching data:', err)
        setError('Failed to load products')
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const categoryNames = ['All', ...categories.map(c => c.name)]

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory)

  const handleAddToCart = (product: any) => {
    const exists = cart.some(item => item.id === product.id);
    if (exists) {
      toast.error(`${product.name} is already in your cart!`);
      return;
    }
    
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.unit_price || 0,
      currency: product.currency || 'RWF',
      image: product.thumbnail || product.image || '/placeholder-product.jpg',
      category: product.category || 'Product'
    }
    
    const updatedCart = [...cart, cartItem];
    setCart(updatedCart);
    localStorage.setItem('cart_items', JSON.stringify(updatedCart));
    setShowCart(true)
    toast.success(`${product.name} added to cart!`)
  }

  const handleRemoveFromCart = (itemId: string) => {
    const updatedCart = cart.filter(item => item.id !== itemId);
    setCart(updatedCart);
    localStorage.setItem('cart_items', JSON.stringify(updatedCart));
    toast.success('Item removed from cart!')
  }

  const goToCheckout = () => {
    if (cart.length === 0) return
    setShowCart(false)
    navigate('/checkout')
  }

  return (
    <div className="bg-[#000000] min-h-screen pt-32 pb-20 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12 relative z-10">
        
        {/* Apple-style Header */}
        <div className="mb-24 text-center">
          <h1 className="text-5xl md:text-7xl font-display font-semibold text-white tracking-tight mb-6">
            Store. <span className="text-gray-500">The best way to buy the products you love.</span>
          </h1>
          
          {/* Categories Tab */}
          <div className="flex flex-wrap justify-center gap-4 mt-12">
             {categoryNames.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-white text-black'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="w-12 h-12 text-white animate-spin mb-4" />
          </div>
        )}

        {/* Error Message */}
        {error && !loading && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-center">
            {error}
          </div>
        )}

        {/* Product Grid - Apple Style */}
        {!loading && (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-16"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* No Products */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-40">
            <p className="text-gray-500 text-xl font-medium">
              No products found in this category.
            </p>
          </div>
        )}

      </div>

      {/* Cart Button (Floating) */}
      <button
        onClick={() => setShowCart(true)}
        className="fixed bottom-8 right-8 p-4 bg-white text-black rounded-full shadow-2xl hover:scale-110 transition-transform z-50"
      >
        <ShoppingCart size={24} />
        {cart.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
            {cart.length}
          </span>
        )}
      </button>

      {/* --- CART SIDEBAR (Unchanged Logic, refined style) --- */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCart(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-md z-[60]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-full md:w-[450px] h-screen bg-[#1c1c1e] text-white z-[70] p-6 md:p-10 flex flex-col shadow-2xl"
            >
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-bold">Your Cart</h3>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto space-y-6 mb-10 custom-scrollbar">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                    <ShoppingCart size={48} className="mb-4" />
                    <p>Your cart is empty.</p>
                  </div>
                ) : (
                  cart.map((item, idx) => (
                    <div key={`${item.id}-${idx}`} className="flex gap-4 py-4 border-b border-white/10">
                      <img src={item.image} className="w-16 h-16 rounded-xl object-cover bg-white/5" alt={item.name} />
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-lg">{item.name}</h4>
                          <button onClick={() => handleRemoveFromCart(item.id)} className="text-gray-500 hover:text-red-500">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-gray-400 mt-1">{item.price.toLocaleString()} RWF</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="pt-6 border-t border-white/10">
                  <div className="flex justify-between items-end mb-6">
                    <span className="text-gray-400">Total</span>
                    <span className="text-2xl font-bold">{getTotal().toLocaleString()} RWF</span>
                  </div>
                  <button
                    className="w-full bg-green-600 text-white py-4 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    onClick={goToCheckout}
                  >
                    Check Out <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  )
}

const ProductCard: React.FC<{
  product: any;
  index: number;
}> = ({ product, index }) => {
  const navigate = useNavigate()
  
  const price = product.unit_price || product.price || 0
  const currency = product.currency || 'RWF'
  const isNew = calculateIsNew(product.created_at)

  // Get main image
  const getMainImage = () => {
    if (product.media && product.media.length > 0) {
      const mainMedia = product.media.find((m: any) => m.display_order === 0) || product.media[0]
      return mainMedia.image_url || mainMedia.video_file_url || product.thumbnail || product.image
    }
    return product.thumbnail || product.image || '/placeholder-product.jpg'
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group cursor-pointer flex flex-col items-center text-center w-full"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="relative w-full aspect-square bg-gray-900/40 rounded-[30px] overflow-hidden mb-8 transition-transform duration-500 group-hover:scale-[1.02]">
        <img
          src={getMainImage()}
          alt={product.name}
          className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-110"
        />
        
        {isNew && (
          <span className="absolute top-6 left-6 text-orange-500 text-xs font-bold uppercase tracking-widest">New</span>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-3xl font-bold text-white tracking-tight">{product.name}</h3>
        <p className="text-xl text-white">
          <span className="text-gray-500 text-sm align-top mr-1">From</span>
          {price.toLocaleString()} {currency}
        </p>
        
        <div className="pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button className="px-6 py-2 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 transition-colors">
            Buy
          </button>
          <button className="ml-4 text-green-500 hover:underline text-sm font-medium">
            Learn more &gt;
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function calculateIsNew(dateString: string) {
    if (!dateString) return false
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays < 14 // New if less than 14 days old
}

export default Shop

