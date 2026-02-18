import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { customRequestService } from '@/services/customRequestService';

export const fetchRequests = createAsyncThunk(
    'requests/fetchAll',
    async (params: any = {}, { rejectWithValue }) => {
        try {
            const response = await customRequestService.getCustomRequests(params);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.message || 'Failed to fetch requests');
        }
    }
);

export const submitRequest = createAsyncThunk(
    'requests/submit',
    async (formData: FormData, { rejectWithValue }) => {
        try {
            const response = await customRequestService.createCustomRequest(formData);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.message || 'Failed to submit request');
        }
    }
);

export const removeRequest = createAsyncThunk(
    'requests/remove',
    async (id: string | number, { rejectWithValue }) => {
        try {
            await customRequestService.deleteCustomRequest(id);
            return id;
        } catch (err: any) {
            return rejectWithValue(err.message || 'Failed to delete request');
        }
    }
);

export const updateRequestStatus = createAsyncThunk(
    'requests/updateStatus',
    async ({ id, status }: { id: string | number; status: string }, { rejectWithValue }) => {
        try {
            const response = await customRequestService.updateCustomStatus(id, status);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.message || 'Failed to update status');
        }
    }
);

export const updateExistingRequest = createAsyncThunk(
    'requests/update',
    async ({ id, data }: { id: string | number; data: any }, { rejectWithValue }) => {
        try {
            const response = await customRequestService.updateCustomRequest(id, data);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.message || 'Failed to update request');
        }
    }
);

interface CustomRequest {
    id: string;
    client_name: string;
    client_email: string;
    client_phone: number;
    title: string;
    description: string;
    budget: string | null;
    status: string;
    created_at: string;
    service_category_name: string;
    reference_file: string | null;
}

interface RequestsState {
    items: CustomRequest[];
    loading: boolean;
    error: string | null;
    count: number;
}

const initialState: RequestsState = {
    items: [],
    loading: false,
    error: null,
    count: 0,
};

const requestsSlice = createSlice({
    name: 'requests',
    initialState,
    reducers: {
        clearRequestError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch All
            .addCase(fetchRequests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.results || action.payload;
                state.count = action.payload.count || action.payload.length;
            })
            .addCase(fetchRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Submit
            .addCase(submitRequest.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
            })
            // Remove
            .addCase(removeRequest.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item.id !== action.payload);
                state.count -= 1;
            })
            // Update Status
            .addCase(updateRequestStatus.fulfilled, (state, action) => {
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            // Update Request
            .addCase(updateExistingRequest.fulfilled, (state, action) => {
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            });
    }
});

export const { clearRequestError } = requestsSlice.actions;
export default requestsSlice.reducer;
