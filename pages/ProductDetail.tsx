import React, { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, ShoppingCart, Plus, Minus, X, Heart, Share2,
  Star, Truck, Shield, Clock, ChevronLeft, ChevronRight,
  Loader2, AlertCircle, Box
} from 'lucide-react'
import toast from 'react-hot-toast'
import { wishlistService } from '@/services/wishlistService'
import { productsService } from '@/services/productsService'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '@/store/slices/cartSlice'
import { toggleWishlist, fetchWishlist } from '@/store/slices/wishlistSlice'
import { fetchFeedbacks } from '@/store/slices/feedbackSlice'
import { fetchMedia } from '@/store/slices/mediaSlice'
import { RootState } from '@/store'
import ThreeDViewer from '@/components/ThreeDViewer'

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [product, setProduct] = useState<any>(null)
  const [media, setMedia] = useState<any[]>([])
  const [feedback, setFeedback] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [activeMediaIndex, setActiveMediaIndex] = useState(0)
  const [show3D, setShow3D] = useState(false)

  const wishlistItems = useSelector((state: RootState) => state.wishlist.items)
  const isInWishlist = product ? wishlistItems.some((item: any) => item.product.id === product.id) : false

  // Scroll tracking for sticky header/buy bar
  const [isScrolled, setIsScrolled] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isScrollingUp, setIsScrollingUp] = useState(false)

  useEffect(() => {
    if (id) {
      fetchProductData(id)
    }
  }, [id])

  useEffect(() => {
    dispatch(fetchWishlist() as any)
  }, [dispatch])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const scrolled = currentScrollY > 100

      setIsScrolled(scrolled)
      setIsScrollingUp(currentScrollY < lastScrollY)
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const fetchProductData = async (productId: string) => {
    try {
      setLoading(true)
      setError('')

      const productRes = await productsService.getProduct(productId)
      if (productRes.ok && productRes.data) {
        setProduct(productRes.data)

        const mediaRes: any = await dispatch(fetchMedia({ product: productId }) as any).unwrap()
        if (mediaRes) {
          const sortedMedia = [...mediaRes].sort((a: any, b: any) => a.display_order - b.display_order)
          setMedia(sortedMedia)

          // Check if there is a 3D model
          const has3D = sortedMedia.some((m: any) => m.media_type === 'model_3d' || m.file_type === 'glb' || m.file_type === 'gltf' || m.model_file)
          if (has3D) {
            // Logic to initialize 3D view
          }
        }

        const feedbackRes: any = await dispatch(fetchFeedbacks({ product: productId, status: 'APPROVED' }) as any).unwrap()
        if (feedbackRes) {
          setFeedback(feedbackRes)
        }
      } else {
        setError('Product not found')
      }
    } catch (err: any) {
      console.error('Error fetching product:', err)
      setError('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!product) return

    const cartItem = {
      id: product.id.toString(),
      name: product.name,
      price: product.unit_price || 0,
      currency: product.currency || 'RWF',
      image: getMainImage(),
      category: getCategoryName()
    }

    dispatch(addToCart(cartItem))
    toast.success(`${product.name} added to cart`);
  }

  const handleToggleWishlist = async () => {
    if (!product) return

    try {
      await dispatch(toggleWishlist(product.id) as any).unwrap()
      if (isInWishlist) {
        toast.success(`${product.name} removed from wishlist`)
      } else {
        toast.success(`${product.name} added to wishlist`)
      }
    } catch (error: any) {
      console.error('Error toggling wishlist:', error)
      const message = typeof error === 'string' ? error : (error?.message || 'Failed to update wishlist')
      toast.error(message)
    }
  }

  const getMainImage = () => {
    if (media.length > 0) {
      const mainMedia = media.find(m => m.display_order === 0) || media[0]
      return mainMedia.image_url || mainMedia.image || mainMedia.video_file_url || mainMedia.video_file || '/placeholder-product.jpg'
    }
    return product?.thumbnail || product?.image || '/placeholder-product.jpg'
  }

  const getCategoryName = () => {
    return typeof product?.category === 'object' ? product.category.name : product?.category || 'Unknown'
  }

  const get3DModelUrl = () => {
    // Look for GLB/GLTF files in media
    const model = media.find(m =>
      m.model_file ||
      m.model_3d ||
      m.model_3d_url ||
      m.image_url?.endsWith('.glb') ||
      m.image_url?.endsWith('.gltf') ||
      m.media_type === 'model_3d'
    )
    return model?.model_file || model?.model_3d || model?.model_3d_url || model?.image_url
  }

  const is3DAvailable = !!get3DModelUrl();

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-white" /></div>
  if (error) return <div className="min-h-screen bg-black flex items-center justify-center text-white">{error}</div>

  return (
    <div className="bg-[#000000] min-h-screen text-[#f5f5f7] pb-20">

      {/* Sticky Product Nav */}
      <div className={`fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10 transition-all duration-300 ${isScrolled && isScrollingUp ? 'translate-y-0' :
        isScrolled && !isScrollingUp ? '-translate-y-full' :
          'translate-y-0'
        }`}>
        <div className="max-w-[1000px] mx-auto px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">{product.name}</h2>
          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-400">{(product.unit_price || 0).toLocaleString()} RWF</span>
            <button onClick={handleAddToCart} className="bg-green-700 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-green-800">Buy</button>
          </div>
        </div>
      </div>

      {/* Hero / Media Section - Apple Style */}
      <div className="max-w-[1200px] mx-auto pt-32 px-6">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
        >
          <div className="p-2 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
            <ArrowLeft size={20} />
          </div>
          <span className="font-medium">Back</span>
        </button>

        {/* Title Area */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 border border-orange-500 text-orange-500 rounded-full text-[10px] uppercase font-bold tracking-widest">New</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-semibold tracking-tighter mb-4">{product.name}</h1>
          <p className="text-2xl md:text-3xl font-medium text-gray-400 max-w-2xl">
            {product.short_description}
          </p>
          <div className="mt-8 flex items-baseline gap-2">
            <span className="text-4xl font-semibold">{(product.unit_price || 0).toLocaleString()}</span>
            <span className="text-xl text-gray-500">RWF</span>
          </div>
        </div>

        {/* Main Viewer Area */}
        <div className="relative w-full aspect-[4/3] md:aspect-[16/9] bg-[#1c1c1e] rounded-3xl overflow-hidden mb-16 group">

          {show3D && is3DAvailable ? (
            <ThreeDViewer
              src={get3DModelUrl()}
              alt={product.name}
              className="w-full h-full"
            />
          ) : (
            <div className="w-full h-full relative">
              {/* Check for video or image */}
              {(media[activeMediaIndex]?.video_file_url || media[activeMediaIndex]?.video_file) ? (
                <video
                  src={media[activeMediaIndex].video_file_url || media[activeMediaIndex].video_file}
                  className="w-full h-full object-contain"
                  controls
                />
              ) : (
                <img
                  src={media[activeMediaIndex]?.image_url || media[activeMediaIndex]?.image || getMainImage()}
                  alt={product.name}
                  className="w-full h-full object-contain p-8 md:p-16 transition-transform duration-700 hover:scale-105"
                />
              )}
            </div>
          )}

          {/* Controls Overlay */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 bg-black/50 backdrop-blur-md p-2 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {is3DAvailable && (
              <button
                onClick={() => setShow3D(!show3D)}
                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all ${show3D ? 'bg-white text-black' : 'hover:bg-white/20 text-white'}`}
              >
                <Box size={16} /> 3D View
              </button>
            )}
            {media.map((_, idx) => (
              <button
                key={idx}
                onClick={() => { setShow3D(false); setActiveMediaIndex(idx); }}
                className={`w-2 h-2 rounded-full transition-all ${!show3D && activeMediaIndex === idx ? 'bg-white w-4' : 'bg-white/30'}`}
              />
            ))}
          </div>

        </div>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-24 mb-32">

          {/* Left Col - Interaction */}
          <div className="md:col-span-1 space-y-12">
            <div className="sticky top-32">
              <div className="bg-[#1c1c1e] rounded-3xl p-8 space-y-6">
                <h3 className="text-xl font-semibold">Order Now</h3>

                <div className="flex items-center justify-center p-2 bg-black rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:text-green-600"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="mx-6 font-bold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:text-green-600"
                  >
                    <Plus size={20} />
                  </button>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleToggleWishlist}
                    className={`p-4 rounded-xl font-semibold transition flex items-center justify-center ${isInWishlist
                      ? 'bg-red-500 text-white'
                      : 'bg-white/10 text-gray-400 hover:bg-white/20'
                      }`}
                    aria-label="Add to wishlist"
                  >
                    <Heart size={20} className={isInWishlist ? 'fill-current' : ''} />
                  </button>

                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-green-700 text-white py-4 rounded-xl font-semibold text-lg hover:bg-green-800 transition"
                  >
                    Add to Cart
                  </button>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <Truck size={18} />
                    <span>Free delivery for orders over 100k</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <Shield size={18} />
                    <span>2-year warranty included</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Col - Content */}
          <div className="md:col-span-2 space-y-24">

            {/* Description Section */}
            <section>
              <h2 className="text-3xl font-semibold mb-6">Overview</h2>
              <div className="text-xl leading-relaxed text-gray-400 space-y-6">
                <p>{product.detailed_description || product.short_description}</p>
              </div>
            </section>

            {/* Specs Section */}
            <section className="border-t border-white/10 pt-16">
              <h2 className="text-3xl font-semibold mb-12">Specifications</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-16">
                {product.length && (
                  <div>
                    <h4 className="font-semibold text-white mb-2 text-lg">Dimensions</h4>
                    <p className="text-gray-400">{product.length}cm (L) x {product.width}cm (W) x {product.height}cm (H)</p>
                  </div>
                )}
                {product.available_materials && (
                  <div>
                    <h4 className="font-semibold text-white mb-2 text-lg">Material</h4>
                    <p className="text-gray-400">{product.available_materials}</p>
                  </div>
                )}
                {product.available_colors && (
                  <div>
                    <h4 className="font-semibold text-white mb-2 text-lg">Colors</h4>
                    <p className="text-gray-400">{product.available_colors}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Reviews Section */}
            {feedback.length > 0 && (
              <section className="border-t border-white/10 pt-16">
                <h2 className="text-3xl font-semibold mb-12">Reviews</h2>
                <div className="space-y-8">
                  {feedback.map((review: any) => (
                    <div key={review.id} className="bg-[#1c1c1e] p-6 rounded-2xl">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-semibold">{review.client_name}</span>
                        <div className="flex text-yellow-500">
                          {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />)}
                        </div>
                      </div>
                      <p className="text-gray-400">{review.message}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>

        </div>

      </div>
    </div>
  )
}

export default ProductDetail
