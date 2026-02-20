import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { shippingService } from '@/services/shippingService';
import { ShippingRecord } from '@/types';

interface ShippingState {
    items: ShippingRecord[];
    loading: boolean;
    error: string | null;
}

const initialState: ShippingState = {
    items: [],
    loading: false,
    error: null,
};

export const fetchShippingRecords = createAsyncThunk(
    'shipping/fetchShippingRecords',
    async (_, { rejectWithValue }) => {
        try {
            const response = await shippingService.getShippingRecords();
            if (response.ok) {
                return response.data.results || response.data;
            }
            return rejectWithValue('Failed to fetch shipping records');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch shipping records');
        }
    }
);

export const createShippingRecord = createAsyncThunk(
    'shipping/createShippingRecord',
    async (data: any, { rejectWithValue, dispatch }) => {
        try {
            const response = await shippingService.createShippingRecord(data);
            if (response.ok) {
                dispatch(fetchShippingRecords());
                return response.data;
            }
            return rejectWithValue('Failed to create shipping record');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to create shipping record');
        }
    }
);

export const updateShippingRecord = createAsyncThunk(
    'shipping/updateShippingRecord',
    async ({ id, data }: { id: string | number; data: any }, { rejectWithValue, dispatch }) => {
        try {
            const response = await shippingService.updateShippingRecord(id, data);
            if (response.ok) {
                dispatch(fetchShippingRecords());
                return response.data;
            }
            return rejectWithValue('Failed to update shipping record');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to update shipping record');
        }
    }
);

export const deleteShippingRecord = createAsyncThunk(
    'shipping/deleteShippingRecord',
    async (id: string | number, { rejectWithValue, dispatch }) => {
        try {
            const response = await shippingService.deleteShippingRecord(id);
            if (response.ok) {
                dispatch(fetchShippingRecords());
                return id;
            }
            return rejectWithValue('Failed to delete shipping record');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to delete shipping record');
        }
    }
);

const shippingSlice = createSlice({
    name: 'shipping',
    initialState,
    reducers: {
        clearShippingError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchShippingRecords.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchShippingRecords.fulfilled, (state, action: PayloadAction<ShippingRecord[]>) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchShippingRecords.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addMatcher(
                (action) => action.type.startsWith('shipping/') && action.type.endsWith('/pending'),
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                (action) => action.type.startsWith('shipping/') && action.type.endsWith('/fulfilled'),
                (state) => {
                    state.loading = false;
                }
            )
            .addMatcher(
                (action) => action.type.startsWith('shipping/') && action.type.endsWith('/rejected'),
                (state, action: any) => {
                    state.loading = false;
                    state.error = action.payload as string;
                }
            );
    },
});

export const { clearShippingError } = shippingSlice.actions;
export default shippingSlice.reducer;
