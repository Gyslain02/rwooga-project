import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { paymentsService } from '@/services/paymentsService';
import { PaymentRecord } from '@/types';

interface PaymentsState {
    items: PaymentRecord[];
    loading: boolean;
    error: string | null;
}

const initialState: PaymentsState = {
    items: [],
    loading: false,
    error: null,
};

export const fetchPayments = createAsyncThunk(
    'payments/fetchPayments',
    async (_, { rejectWithValue }) => {
        try {
            const response = await paymentsService.getPayments();
            if (response.ok) {
                return response.data.results || response.data;
            }
            return rejectWithValue('Failed to fetch payments');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch payments');
        }
    }
);

export const cancelPayment = createAsyncThunk(
    'payments/cancelPayment',
    async (id: string | number, { rejectWithValue, dispatch }) => {
        try {
            const response = await paymentsService.cancelPayment(id);
            if (response.ok) {
                dispatch(fetchPayments());
                return response.data;
            }
            return rejectWithValue('Failed to cancel payment');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to cancel payment');
        }
    }
);

export const initiateCardPayment = createAsyncThunk(
    'payments/initiateCardPayment',
    async (paymentData: any, { rejectWithValue, dispatch }) => {
        try {
            const response = await paymentsService.initiateCardPayment(paymentData);
            if (response.ok) {
                dispatch(fetchPayments());
                return response.data;
            }
            return rejectWithValue('Failed to initiate card payment');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to initiate card payment');
        }
    }
);

export const initiateMomoPayment = createAsyncThunk(
    'payments/initiateMomoPayment',
    async (paymentData: any, { rejectWithValue, dispatch }) => {
        try {
            const response = await paymentsService.initiateMomoPayment(paymentData);
            if (response.ok) {
                dispatch(fetchPayments());
                return response.data;
            }
            return rejectWithValue('Failed to initiate Momo payment');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to initiate Momo payment');
        }
    }
);

const paymentsSlice = createSlice({
    name: 'payments',
    initialState,
    reducers: {
        clearPaymentsError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPayments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPayments.fulfilled, (state, action: PayloadAction<PaymentRecord[]>) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchPayments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addMatcher(
                (action) => action.type.startsWith('payments/') && action.type.endsWith('/pending'),
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                (action) => action.type.startsWith('payments/') && action.type.endsWith('/fulfilled'),
                (state) => {
                    state.loading = false;
                }
            )
            .addMatcher(
                (action) => action.type.startsWith('payments/') && action.type.endsWith('/rejected'),
                (state, action: any) => {
                    state.loading = false;
                    state.error = action.payload as string;
                }
            );
    },
});

export const { clearPaymentsError } = paymentsSlice.actions;
export default paymentsSlice.reducer;
