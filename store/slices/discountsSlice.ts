import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { discountsService } from '@/services/discountsService';

export interface Discount {
    id: string;
    code: string;
    discount_type: 'PERCENTAGE' | 'FIXED';
    value: number;
    active: boolean;
    start_date?: string;
    end_date?: string;
    min_purchase_amount?: number;
    usage_limit?: number;
    usage_count: number;
    created_at: string;
    updated_at: string;
}

interface DiscountsState {
    items: Discount[];
    loading: boolean;
    error: string | null;
}

const initialState: DiscountsState = {
    items: [],
    loading: false,
    error: null,
};

export const fetchDiscounts = createAsyncThunk(
    'discounts/fetchDiscounts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await discountsService.getDiscounts();
            if (response.ok) {
                return response.data.results || response.data;
            }
            return rejectWithValue('Failed to fetch discounts');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch discounts');
        }
    }
);

export const createDiscount = createAsyncThunk(
    'discounts/createDiscount',
    async (data: any, { rejectWithValue, dispatch }) => {
        try {
            const response = await discountsService.createDiscount(data);
            if (response.ok) {
                dispatch(fetchDiscounts());
                return response.data;
            }
            return rejectWithValue('Failed to create discount');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to create discount');
        }
    }
);

export const updateDiscount = createAsyncThunk(
    'discounts/updateDiscount',
    async ({ id, data }: { id: string | number; data: any }, { rejectWithValue, dispatch }) => {
        try {
            const response = await discountsService.patchDiscount(id, data);
            if (response.ok) {
                dispatch(fetchDiscounts());
                return response.data;
            }
            return rejectWithValue('Failed to update discount');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to update discount');
        }
    }
);

export const deleteDiscount = createAsyncThunk(
    'discounts/deleteDiscount',
    async (id: string | number, { rejectWithValue, dispatch }) => {
        try {
            const response = await discountsService.deleteDiscount(id);
            if (response.ok) {
                dispatch(fetchDiscounts());
                return id;
            }
            return rejectWithValue('Failed to delete discount');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to delete discount');
        }
    }
);

const discountsSlice = createSlice({
    name: 'discounts',
    initialState,
    reducers: {
        clearDiscountsError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDiscounts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDiscounts.fulfilled, (state, action: PayloadAction<Discount[]>) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchDiscounts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addMatcher(
                (action) => action.type.startsWith('discounts/') && action.type.endsWith('/pending'),
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                (action) => action.type.startsWith('discounts/') && action.type.endsWith('/fulfilled'),
                (state) => {
                    state.loading = false;
                }
            )
            .addMatcher(
                (action) => action.type.startsWith('discounts/') && action.type.endsWith('/rejected'),
                (state, action: any) => {
                    state.loading = false;
                    state.error = action.payload as string;
                }
            );
    },
});

export const { clearDiscountsError } = discountsSlice.actions;
export default discountsSlice.reducer;
