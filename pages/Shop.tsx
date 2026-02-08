import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, ArrowRight, ShoppingCart, X, Trash2, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PRODUCTS } from '../constants'
import { productsService } from '../services/productsService'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store'
import { addToCart, removeFromCart } from '../store/slices/cartSlice'

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showCart, setShowCart] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { items: cart, total } = useSelector((state: RootState) => state.cart)

  // Fetch products and categories on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError('')
        
        // Fetch products and categories in parallel
        const [productsRes, categoriesRes] = await Promise.all([
          productsService.getProducts({ published: true }),
          productsService.getCategories()
        ])

        if (productsRes.ok && productsRes.data) {
          // Handle both paginated and non-paginated responses
          const productsList = productsRes.data.results || productsRes.data
          setProducts(productsList)
        }

        if (categoriesRes.ok && categoriesRes.data) {
          const categoriesList = categoriesRes.data.results || categoriesRes.data
          setCategories(categoriesList.filter((cat: any) => cat.is_active))
        }
      } catch (err: any) {
        console.error('Error fetching products:', err)
        setError('Failed to load products. Using sample data.')
        toast.error('Could not load products from server')
        // Fallback to static products
        setProducts(PRODUCTS)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const categoryNames = ['All', ...categories.map(c => c.name)]

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter(p => {
          // Handle both category object and category_name field
          const categoryName = typeof p.category === 'object' ? p.category.name : p.category_name
          return categoryName === selectedCategory
        })

  const handleAddToCart = (product: any) => {
    const exists = cart.some(item => item.id === product.id);
    if (exists) {
      toast.error(`${product.name} is already in your cart!`);
      return;
    }
    dispatch(addToCart(product))
    setShowCart(true)
    toast.success(`${product.name} added to cart!`)
  }

  const handleRemoveFromCart = (id: string) => {
    const item = cart.find(i => i.id === id);
    dispatch(removeFromCart(id))
    if (item) toast.success(`${item.name} removed from cart`);
  }

  const goToCheckout = () => {
    if (cart.length === 0) return
    setShowCart(false)
    navigate('/checkout')
  }

  return (
    <div className="bg-brand-dark min-h-screen pt-40 pb-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-24">
          <div className="max-w-2xl">
            <span className="text-brand-primary font-bold tracking-[0.4em] uppercase text-xs mb-6 block">Premium Goods</span>
            <h1 className="text-6xl md:text-[100px] font-display font-extrabold text-white leading-[0.85] tracking-tighter uppercase">
              3D Printed <br />
              <span className="text-gray-500">Products</span>
            </h1>
          </div>

          <div className="mt-8 md:mt-0 flex flex-wrap gap-x-8 gap-y-4 items-center">
            {categoryNames.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-sm font-bold uppercase tracking-widest transition-all pb-2 border-b-2 ${selectedCategory === cat
                  ? 'text-brand-primary border-brand-primary'
                  : 'text-gray-500 border-transparent hover:text-white'
                  }`}
              >
                {cat}
              </button>
            ))}

            <button
              onClick={() => setShowCart(true)}
              className="ml-4 p-4 bg-brand-primary text-black rounded-full hover:scale-110 transition-all relative flex items-center justify-center"
            >
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-black rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="w-16 h-16 text-brand-primary animate-spin mb-6" />
            <p className="text-gray-500 font-bold uppercase tracking-widest">Loading products...</p>
          </div>
        )}

        {/* Error Message */}
        {error && !loading && (
          <div className="mb-8 p-4 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-2xl text-center">
            {error}
          </div>
        )}

        {/* product grid */}
        {!loading && (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* No Products */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-40 border-2 border-dashed border-white/5 rounded-[40px]">
            <p className="text-gray-500 font-bold uppercase tracking-widest">
              No products found in this category.
            </p>
          </div>
        )}


      </div>

      {/* --- CART SIDEBAR --- */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCart(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-full md:w-[450px] h-screen bg-brand-dark border-l border-white/5 z-[70] p-6 md:p-10 flex flex-col"
            >
              <div className="flex justify-between items-center mb-16">
                <h3 className="text-4xl font-display font-bold text-white uppercase tracking-tighter">Your <span className="text-gray-500">Cart</span></h3>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-3 bg-white/5 rounded-full text-white hover:bg-white/10 transition-all"
                  aria-label="Close cart"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto space-y-6 mb-10 pr-2 custom-scrollbar">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <ShoppingBag size={64} className="text-white/10 mb-6" />
                    <p className="text-gray-500 font-bold uppercase tracking-widest">Your cart is empty</p>
                  </div>
                ) : (
                  cart.map((item, idx) => (
                    <motion.div
                      key={`${item.id}-${idx}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-6 p-6 bg-white/3 rounded-3xl border border-white/5 group"
                    >
                      <img src={item.image} className="w-20 h-20 rounded-2xl object-cover" alt={item.name} />
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-bold text-white">{item.name}</h4>
                          <button
                            onClick={() => handleRemoveFromCart(item.id)}
                            className="text-gray-500 hover:text-red-500 transition-colors"
                            aria-label="Remove from cart"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <p className="text-brand-primary font-bold">{item.price.toLocaleString()} RWF</p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">Total Amount</span>
                    <span className="text-4xl font-display font-bold text-white tracking-tighter">
                      {total.toLocaleString()} <span className="text-lg">RWF</span>
                    </span>
                  </div>

                  <button
                    className="w-full bg-brand-primary text-black py-6 rounded-3xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] transition-all text-lg shadow-xl shadow-brand-primary/20"
                    onClick={goToCheckout}
                  >
                    PROCEED TO CHECKOUT <ArrowRight size={24} />
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
  onAddToCart: (product: any) => void;
}> = ({ product, index, onAddToCart }) => {
  // Handle both API format (unit_price) and static format (price)
  const price = product.unit_price || product.price || 0
  const currency = product.currency || 'RWF'
  const image = product.thumbnail || product.image
  const category = typeof product.category === 'object' ? product.category.name : product.category_name || product.category
  
  // For variants, handle both API format and static format
  const materialText = product.material || (product.variants?.material && product.variants.material[0]) || 'PLA'
  const colorCount = product.available_colors?.length || product.variants?.color?.length || 0

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <div className="aspect-square rounded-[40px] overflow-hidden bg-white/5 relative mb-6">
        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
        />
        <div className="absolute top-6 left-6 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">{category}</span>
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
          <button
            onClick={() => onAddToCart(product)}
            className="bg-brand-primary text-black px-8 py-4 rounded-full font-bold hover:scale-105 transition-all shadow-2xl"
          >
            ADD TO CART
          </button>
        </div>
      </div>

      <div className="px-2">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-2xl font-bold text-white uppercase tracking-tight">{product.name}</h3>
          <p className="text-brand-primary font-bold text-xl">{price.toLocaleString()} {currency}</p>
        </div>
        <p className="text-gray-500 text-sm font-medium">
          {colorCount > 0 ? `Available in ${materialText} & ${colorCount} colors` : `Made with ${materialText}`}
        </p>
      </div>
    </motion.div>
  )
}

export default Shop
