
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    currency: string;
}

interface CartState {
    items: CartItem[];
    total: number;
}

const calculateTotal = (items: CartItem[]) => {
    return items.reduce((sum, item) => sum + Number(item.price), 0);
};

const items = JSON.parse(localStorage.getItem('cart_items') || '[]');
const initialState: CartState = {
    items: items,
    total: calculateTotal(items),
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            // Check if item already exists in cart
            const exists = state.items.some(item => item.id === action.payload.id);
            if (!exists) {
                state.items.push(action.payload);
                state.total = calculateTotal(state.items);
                localStorage.setItem('cart_items', JSON.stringify(state.items));
                localStorage.setItem('cart_total', state.total.toString());
            }
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item.id !== action.payload);
            state.total = calculateTotal(state.items);
            localStorage.setItem('cart_items', JSON.stringify(state.items));
            localStorage.setItem('cart_total', state.total.toString());
        },
        clearCart: (state) => {
            state.items = [];
            state.total = 0;
            localStorage.removeItem('cart_items');
            localStorage.removeItem('cart_total');
        }
    }
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
