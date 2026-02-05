
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WishlistItem {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    currency: string;
}

interface WishlistState {
    items: WishlistItem[];
}

const initialState: WishlistState = {
    items: JSON.parse(localStorage.getItem('wishlist_items') || '[]'),
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        addToWishlist: (state, action: PayloadAction<WishlistItem>) => {
            // Check if item already exists in wishlist
            const exists = state.items.some(item => item.id === action.payload.id);
            if (!exists) {
                state.items.push(action.payload);
                localStorage.setItem('wishlist_items', JSON.stringify(state.items));
            }
        },
        removeFromWishlist: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item.id !== action.payload);
            localStorage.setItem('wishlist_items', JSON.stringify(state.items));
        },
        clearWishlist: (state) => {
            state.items = [];
            localStorage.removeItem('wishlist_items');
        }
    }
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
