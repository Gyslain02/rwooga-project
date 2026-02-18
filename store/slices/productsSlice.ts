
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminProductService } from '@/services/adminProductService';
import { productsService } from '@/services/productsService';

export interface ProductMedia {
    id: number;
    file_type: string;
    media_type: string;
    image_url?: string;
    video_file_url?: string;
    model_file?: string;
    display_order: number;
}

export interface ProductCategory {
    id: number;
    name: string;
    description?: string;
}

export interface Product {
    id: number;
    name: string;
    category: ProductCategory | number;
    category_name?: string;
    short_description: string;
    detailed_description: string;
    unit_price: number;
    currency: string;
    available_colors?: string;
    available_materials?: string;
    published: boolean;
    length?: number;
    width?: number;
    height?: number;
    media: ProductMedia[];
    thumbnail?: string;
    created_at?: string;
    updated_at?: string;
}

export interface ProductsState {
    items: Product[];
    loading: boolean;
    error: string | null;
    count: number;
}

// Thunks
export const fetchAllProducts = createAsyncThunk(
    'products/fetchAll',
    async (params: any, { rejectWithValue }) => {
        try {
            const response = await adminProductService.getAllProducts(params);
            if (response.ok) return response.data;
            return rejectWithValue(response.error || 'Failed to fetch products');
        } catch (error: any) {
            return rejectWithValue(error.message || 'An error occurred');
        }
    }
);

export const fetchPublishedProducts = createAsyncThunk(
    'products/fetchPublished',
    async (params: any, { rejectWithValue }) => {
        try {
            const response = await productsService.getPublishedProducts(params);
            if (response.ok) return response.data;
            return rejectWithValue('Failed to fetch published products');
        } catch (error: any) {
            return rejectWithValue(error.message || 'An error occurred');
        }
    }
);

export const createProduct = createAsyncThunk(
    'products/create',
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await adminProductService.createProduct(data);
            if (response.ok) return response.data;
            return rejectWithValue(response.error || 'Failed to create product');
        } catch (error: any) {
            return rejectWithValue(error.message || 'An error occurred');
        }
    }
);

export const updateProduct = createAsyncThunk(
    'products/update',
    async ({ id, data }: { id: string | number, data: any }, { rejectWithValue }) => {
        try {
            const response = await adminProductService.updateProduct(id.toString(), data);
            if (response.ok) return response.data;
            return rejectWithValue(response.error || 'Failed to update product');
        } catch (error: any) {
            return rejectWithValue(error.message || 'An error occurred');
        }
    }
);

export const deleteProduct = createAsyncThunk(
    'products/delete',
    async (id: string | number, { rejectWithValue }) => {
        try {
            const response = await adminProductService.deleteProduct(id.toString());
            if (response.ok) return id;
            return rejectWithValue(response.error || 'Failed to delete product');
        } catch (error: any) {
            return rejectWithValue(error.message || 'An error occurred');
        }
    }
);

const initialState: ProductsState = {
    items: [],
    loading: false,
    error: null,
    count: 0
};

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch All
            .addCase(fetchAllProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.results || action.payload;
                state.count = action.payload.count || (Array.isArray(action.payload) ? action.payload.length : (action.payload.results ? action.payload.results.length : 0));
            })
            .addCase(fetchAllProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch Published
            .addCase(fetchPublishedProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPublishedProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.results || action.payload;
                state.count = action.payload.count || (Array.isArray(action.payload) ? action.payload.length : (action.payload.results ? action.payload.results.length : 0));
            })
            .addCase(fetchPublishedProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Create
            .addCase(createProduct.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
                state.count += 1;
            })
            // Update
            .addCase(updateProduct.fulfilled, (state, action) => {
                const index = state.items.findIndex(p => p.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            // Delete
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.items = state.items.filter(p => p.id !== action.payload);
                state.count -= 1;
            });
    }
});

export const { clearError } = productsSlice.actions;
export default productsSlice.reducer;
