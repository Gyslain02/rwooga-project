import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { returnsService } from '@/services/returnsService';

export interface Refund {
    id: string;
    refund_number: string;
    order: {
        id?: string;
        order_number: string;
    };
    amount: number;
    status: string;
    reason: string;
    transaction_id?: string;
    created_at: string;
    completed_at?: string;
}

interface RefundsState {
    items: Refund[];
    loading: boolean;
    error: string | null;
}

const initialState: RefundsState = {
    items: [],
    loading: false,
    error: null,
};

export const fetchRefunds = createAsyncThunk(
    'refunds/fetchRefunds',
    async (_, { rejectWithValue }) => {
        try {
            const response = await returnsService.getRefunds();
            if (response.ok) {
                return response.data.results || response.data;
            }
            return rejectWithValue('Failed to fetch refunds');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch refunds');
        }
    }
);

export const createRefund = createAsyncThunk(
    'refunds/createRefund',
    async (refundData: any, { rejectWithValue, dispatch }) => {
        try {
            const response = await returnsService.createRefund(refundData);
            if (response.ok) {
                dispatch(fetchRefunds());
                return response.data;
            }
            return rejectWithValue('Failed to create refund');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to create refund');
        }
    }
);

export const updateRefund = createAsyncThunk(
    'refunds/updateRefund',
    async ({ id, data }: { id: string | number; data: any }, { rejectWithValue, dispatch }) => {
        try {
            const response = await returnsService.updateRefund(id, data);
            if (response.ok) {
                dispatch(fetchRefunds());
                return response.data;
            }
            return rejectWithValue('Failed to update refund');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to update refund');
        }
    }
);

export const deleteRefund = createAsyncThunk(
    'refunds/deleteRefund',
    async (id: string | number, { rejectWithValue, dispatch }) => {
        try {
            const response = await returnsService.deleteRefund(id);
            if (response.ok) {
                dispatch(fetchRefunds());
                return id;
            }
            return rejectWithValue('Failed to delete refund');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to delete refund');
        }
    }
);

export const completeRefund = createAsyncThunk(
    'refunds/completeRefund',
    async (id: string | number, { rejectWithValue, dispatch }) => {
        try {
            const response = await returnsService.completeRefund(id);
            if (response.ok) {
                dispatch(fetchRefunds());
                return response.data;
            }
            return rejectWithValue('Failed to complete refund');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to complete refund');
        }
    }
);

export const failRefund = createAsyncThunk(
    'refunds/failRefund',
    async (id: string | number, { rejectWithValue, dispatch }) => {
        try {
            const response = await returnsService.failRefund(id);
            if (response.ok) {
                dispatch(fetchRefunds());
                return response.data;
            }
            return rejectWithValue('Failed to fail refund');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fail refund');
        }
    }
);

const refundsSlice = createSlice({
    name: 'refunds',
    initialState,
    reducers: {
        clearRefundsError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Refunds
            .addCase(fetchRefunds.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRefunds.fulfilled, (state, action: PayloadAction<Refund[]>) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchRefunds.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Generic Loading Handler for other thunks
            .addMatcher(
                (action) => action.type.startsWith('refunds/') && action.type.endsWith('/pending'),
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                (action) => action.type.startsWith('refunds/') && action.type.endsWith('/fulfilled'),
                (state) => {
                    state.loading = false;
                }
            )
            .addMatcher(
                (action) => action.type.startsWith('refunds/') && action.type.endsWith('/rejected'),
                (state, action: any) => {
                    state.loading = false;
                    state.error = action.payload as string;
                }
            );
    },
});

export const { clearRefundsError } = refundsSlice.actions;
export default refundsSlice.reducer;
