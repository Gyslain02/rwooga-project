import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, ArrowLeft, Package, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/slices/cartSlice';
import { wishlistService } from '@/services/wishlistService';

interface WishlistItem {
  id: string;
  product: {
    id: string;
    name: string;
    unit_price: number;
    image?: string;
    thumbnail?: string;
    category?: string;
  };
  created_at: string;
}

const Wishlist: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    fetchWishlistItems();
  }, []);

  const fetchWishlistItems = async () => {
    try {
      setLoading(true);
      const response = await wishlistService.getWishlist();
      if (response.ok) {
        // The API returns wishlist items with product details
        setWishlistItems(response.data.results || response.data);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      setLoading(true);
      await wishlistService.removeFromWishlist(productId);
      setWishlistItems(wishlistItems.filter(item => item.product.id !== productId));
      toast.success('Item removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove item from wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item: WishlistItem) => {
    dispatch(addToCart({
      id: item.product.id,
      name: item.product.name,
      price: item.product.unit_price || 0,
      currency: 'RWF',
      image: item.product.image || item.product.thumbnail || '/placeholder-product.jpg',
      category: item.product.category || 'Product'
    }));
    toast.success(`${item.product.name} added to cart`);
  };

  const handleClearWishlist = async () => {
    try {
      setLoading(true);
      await wishlistService.clearWishlist();
      setWishlistItems([]);
      toast.success('Wishlist cleared');
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      toast.error('Failed to clear wishlist');
    } finally {
      setLoading(false);
    }
  };

  const getTotalPrice = () => {
    return wishlistItems.reduce((total, item) => total + (item.product.unit_price || 0), 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000000] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#000000] min-h-screen text-white pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-4xl font-bold mb-2">My Wishlist</h1>
              <p className="text-gray-400">{wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}</p>
            </div>
          </div>
          
          {wishlistItems.length > 0 && (
            <button
              onClick={handleClearWishlist}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
            >
              <Trash2 size={18} />
              Clear All
            </button>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <Heart size={48} className="text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Your wishlist is empty</h2>
            <p className="text-gray-400 mb-8">Start adding items you love to your wishlist!</p>
            <button
              onClick={() => navigate('/shop')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-green-700 text-white font-bold rounded-full hover:bg-green-800 transition-colors"
            >
              <Package size={20} />
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <AnimatePresence>
              {wishlistItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-[#1c1c1e] rounded-2xl overflow-hidden border border-white/10 hover:border-green-500/30 transition-all"
                >
                  {/* Product Image */}
                  <div className="aspect-square bg-black/50 relative overflow-hidden">
                    <img
                      src={item.product.image || item.product.thumbnail || '/placeholder-product.jpg'}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => handleRemoveFromWishlist(item.product.id)}
                      className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-red-500/20 transition-colors"
                      disabled={loading}
                    >
                      <Heart size={18} className="text-red-500 fill-red-500" />
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="p-6">
                    <div className="mb-2">
                      <span className="text-xs text-gray-400 uppercase tracking-wider">
                        {item.product.category || 'Product'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-4 line-clamp-2">{item.product.name}</h3>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-green-400">
                        {(item.product.unit_price || 0).toLocaleString()} RWF
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition-colors"
                      >
                        <ShoppingCart size={18} />
                        Add to Cart
                      </button>
                      <button
                        onClick={() => navigate(`/product/${item.product.id}`)}
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                      >
                        <Package size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Summary */}
        {wishlistItems.length > 0 && (
          <div className="bg-[#1c1c1e] rounded-2xl p-8 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Wishlist Summary</h3>
                <p className="text-gray-400">
                  Total value: {getTotalPrice().toLocaleString()} RWF
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    // Add all items to cart
                    wishlistItems.forEach(item => handleAddToCart(item));
                  }}
                  className="px-6 py-3 bg-green-700 text-white font-bold rounded-xl hover:bg-green-800 transition-colors"
                >
                  Add All to Cart
                </button>
                <button
                  onClick={() => navigate('/shop')}
                  className="px-6 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
