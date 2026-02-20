import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { removeFromCart, clearCart } from '@/store/slices/cartSlice';
import { Trash2, ShoppingCart, ArrowRight, ArrowLeft } from 'lucide-react';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartState = useSelector((state: RootState) => state.cart);
  const cart = cartState.items || [];
  const total = cartState.total || 0;

  const formatPrice = (price: number, currency: string = 'RWF') => {
    return `${currency} ${Number(price).toLocaleString('en-US', { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 2 
    })}`;
  };

  const handleRemoveItem = (itemId: string) => {
    dispatch(removeFromCart(itemId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      return;
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-10 gap-5">
        <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6">
          <ShoppingCart size={48} className="text-white" />
        </div>
        <h1 className="text-5xl font-bold mb-4">Shopping Cart</h1>
        <p className="text-2xl text-gray-400 mb-2">Your cart is empty</p>
        
        <p className="text-lg text-gray-500 text-center max-w-sm">
          Looks like you haven't added any items to your cart yet
        </p>
        
        <div className="flex flex-col gap-4 items-center mt-4">
          <button 
            onClick={() => navigate('/shop')}
            className="w-60 h-14 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center rounded-xl font-bold text-lg transition-all"
          >
            Continue Shopping
          </button>
          
          <button 
            onClick={() => navigate(-1)}
            className="w-60 h-12 bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center rounded-xl text-sm transition-all"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-10 pt-32">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-4xl font-bold mb-2">Shopping Cart</h1>
              <p className="text-gray-400">{cart.length} {cart.length === 1 ? 'item' : 'items'}</p>
            </div>
          </div>
          
          {cart.length > 0 && (
            <button 
              onClick={handleClearCart}
              className="flex items-center gap-2 px-5 py-3 text-red-500 bg-gray-800 hover:bg-gray-700 rounded-xl transition-all font-medium text-sm"
            >
              <Trash2 size={18} /> Clear Cart
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-green-500 transition-all">
                  <div className="flex gap-6 flex-wrap sm:flex-nowrap">
                    {/* Product Image */}
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-gray-900 shrink-0">
                      <img
                        src={item.image || '/placeholder-product.jpg'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1 pr-4">
                          <h3 className="text-xl font-semibold mb-2 truncate">
                            {item.name}
                          </h3>
                          <p className="text-gray-400 text-base mb-3">{item.category}</p>
                          <p className="text-2xl font-bold text-green-500">
                            {formatPrice(item.price, item.currency)}
                          </p>
                        </div>
                        
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-3 bg-gray-700 hover:bg-gray-600 text-red-400 rounded-xl transition-all"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
                <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 sticky top-32">
                  <h3 className="text-2xl font-bold mb-6">Order Summary</h3>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-lg text-white">
                      <span>Subtotal ({cart.length} items)</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between text-base text-gray-400">
                      <span>Shipping</span>
                      <span className="text-green-500 font-bold">FREE</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-6 mb-8">
                    <div className="flex justify-between items-end">
                      <span className="text-xl font-bold">Total</span>
                      <span className="text-3xl font-bold text-green-500">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout <ArrowRight size={20} />
                  </button>

                  <button
                    onClick={() => navigate('/shop')}
                    className="w-full mt-4 py-3 text-gray-400 hover:text-white bg-transparent transition-all"
                  >
                    Continue Shopping
                  </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
