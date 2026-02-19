import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { returnsService } from '@/services/returnsService';

export interface Return {
    id: string;
    return_number: string;
    order: {
        id?: string;
        order_number: string;
        items: Array<{
            product_name: string;
            quantity: number;
            price_at_purchase: number;
        }>;
    };
    reason: string;
    detailed_reason: string;
    rejection_reason?: string;
    requested_refund_amount: number;
    approved_refund_amount?: number;
    status: string;
    created_at: string;
    updated_at?: string;
    approved_at?: string;
}

interface ReturnsState {
    items: Return[];
    loading: boolean;
    error: string | null;
}

const initialState: ReturnsState = {
    items: [],
    loading: false,
    error: null,
};

export const fetchReturns = createAsyncThunk(
    'returns/fetchReturns',
    async (_, { rejectWithValue }) => {
        try {
            const response = await returnsService.getReturns();
            if (response.ok) {
                return response.data.results || response.data;
            }
            return rejectWithValue('Failed to fetch returns');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch returns');
        }
    }
);

export const createReturn = createAsyncThunk(
    'returns/createReturn',
    async (returnData: any, { rejectWithValue, dispatch }) => {
        try {
            const response = await returnsService.createReturn(returnData);
            if (response.ok) {
                dispatch(fetchReturns());
                return response.data;
            }
            return rejectWithValue('Failed to create return request');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to create return request');
        }
    }
);

export const approveReturn = createAsyncThunk(
    'returns/approveReturn',
    async (id: string | number, { rejectWithValue, dispatch }) => {
        try {
            const response = await returnsService.approveReturn(id);
            if (response.ok) {
                dispatch(fetchReturns());
                return response.data;
            }
            return rejectWithValue('Failed to approve return');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to approve return');
        }
    }
);

export const rejectReturn = createAsyncThunk(
    'returns/rejectReturn',
    async ({ id, reason }: { id: string | number; reason?: string }, { rejectWithValue, dispatch }) => {
        try {
            const response = await returnsService.rejectReturn(id, reason);
            if (response.ok) {
                dispatch(fetchReturns());
                return response.data;
            }
            return rejectWithValue('Failed to reject return');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to reject return');
        }
    }
);

export const completeReturn = createAsyncThunk(
    'returns/completeReturn',
    async (id: string | number, { rejectWithValue, dispatch }) => {
        try {
            const response = await returnsService.completeReturn(id);
            if (response.ok) {
                dispatch(fetchReturns());
                return response.data;
            }
            return rejectWithValue('Failed to complete return');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to complete return');
        }
    }
);

export const cancelReturnRequest = createAsyncThunk(
    'returns/cancelReturnRequest',
    async (id: string | number, { rejectWithValue, dispatch }) => {
        try {
            const response = await returnsService.cancelReturnRequest(id);
            if (response.ok) {
                dispatch(fetchReturns());
                return response.data;
            }
            return rejectWithValue('Failed to cancel return request');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to cancel return request');
        }
    }
);

const returnsSlice = createSlice({
    name: 'returns',
    initialState,
    reducers: {
        clearReturnsError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchReturns.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReturns.fulfilled, (state, action: PayloadAction<Return[]>) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchReturns.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addMatcher(
                (action) => action.type.startsWith('returns/') && action.type.endsWith('/pending'),
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                (action) => action.type.startsWith('returns/') && action.type.endsWith('/fulfilled'),
                (state) => {
                    state.loading = false;
                }
            )
            .addMatcher(
                (action) => action.type.startsWith('returns/') && action.type.endsWith('/rejected'),
                (state, action: any) => {
                    state.loading = false;
                    state.error = action.payload as string;
                }
            );
    },
});

export const { clearReturnsError } = returnsSlice.actions;
export default returnsSlice.reducer;
