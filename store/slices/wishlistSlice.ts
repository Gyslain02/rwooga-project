
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { wishlistService } from '@/services/wishlistService';

export interface WishlistItem {
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

interface WishlistState {
    items: WishlistItem[];
    loading: boolean;
    error: string | null;
}

const initialState: WishlistState = {
    items: [],
    loading: false,
    error: null,
};

export const fetchWishlist = createAsyncThunk(
    'wishlist/fetchWishlist',
    async (_, { rejectWithValue }) => {
        try {
            const response = await wishlistService.getWishlist();
            if (response.ok) {
                return response.data.results || response.data;
            }
            return rejectWithValue('Failed to fetch wishlist');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch wishlist');
        }
    }
);

export const toggleWishlist = createAsyncThunk(
    'wishlist/toggleWishlist',
    async (productId: string | number, { rejectWithValue, dispatch }) => {
        try {
            const response = await wishlistService.addToWishlist(productId);
            if (response.ok) {
                dispatch(fetchWishlist());
                return response.data;
            }
            return rejectWithValue('Failed to update wishlist');
        } catch (error: any) {
            // Include the actual error message for debugging
            return rejectWithValue(error.message || 'Failed to update wishlist');
        }
    }
);

export const clearWishlist = createAsyncThunk(
    'wishlist/clearWishlist',
    async (_, { rejectWithValue }) => {
        try {
            const response = await wishlistService.clearWishlist();
            if (response.ok) {
                return [];
            }
            return rejectWithValue('Failed to clear wishlist');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to clear wishlist');
        }
    }
);

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Wishlist
            .addCase(fetchWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWishlist.fulfilled, (state, action: PayloadAction<WishlistItem[]>) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Toggle Wishlist
            .addCase(toggleWishlist.pending, (state) => {
                state.loading = true;
            })
            .addCase(toggleWishlist.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(toggleWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Clear Wishlist
            .addCase(clearWishlist.pending, (state) => {
                state.loading = true;
            })
            .addCase(clearWishlist.fulfilled, (state) => {
                state.loading = false;
                state.items = [];
            })
            .addCase(clearWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export default wishlistSlice.reducer;
