import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { feedbackService } from '@/services/feedbackService';

export interface Feedback {
    id: string;
    product: number;
    product_name?: string;
    rating: number;
    comment: string;
    client_name: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    moderation_comment?: string;
    created_at: string;
    updated_at: string;
}

interface FeedbackState {
    items: Feedback[];
    loading: boolean;
    error: string | null;
}

const initialState: FeedbackState = {
    items: [],
    loading: false,
    error: null,
};

export const fetchFeedbacks = createAsyncThunk(
    'feedback/fetchFeedbacks',
    async (params: any = {}, { rejectWithValue }) => {
        try {
            const response = await feedbackService.getFeedbacks(params);
            if (response.ok) {
                return response.data.results || response.data;
            }
            return rejectWithValue('Failed to fetch feedback');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch feedback');
        }
    }
);

export const createFeedback = createAsyncThunk(
    'feedback/createFeedback',
    async (data: any, { rejectWithValue, dispatch }) => {
        try {
            const response = await feedbackService.createFeedback(data);
            if (response.ok) {
                // If it's a customer submission, we don't necessarily re-fetch all (as it might be pending)
                // but for admin purposes or immediate display if auto-approved:
                return response.data;
            }
            return rejectWithValue('Failed to submit feedback');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to submit feedback');
        }
    }
);

export const moderateFeedback = createAsyncThunk(
    'feedback/moderateFeedback',
    async ({ id, status, comment }: { id: string | number; status: 'APPROVED' | 'REJECTED'; comment?: string }, { rejectWithValue, dispatch }) => {
        try {
            const response = await feedbackService.moderateFeedback(id, {
                status,
                moderation_comment: comment
            });
            if (response.ok) {
                dispatch(fetchFeedbacks({}));
                return response.data;
            }
            return rejectWithValue(`Failed to ${status.toLowerCase()} feedback`);
        } catch (error: any) {
            return rejectWithValue(error.message || `Failed to ${status.toLowerCase()} feedback`);
        }
    }
);

export const deleteFeedback = createAsyncThunk(
    'feedback/deleteFeedback',
    async (id: string | number, { rejectWithValue, dispatch }) => {
        try {
            const response = await feedbackService.deleteFeedback(id);
            if (response.ok) {
                dispatch(fetchFeedbacks({}));
                return id;
            }
            return rejectWithValue('Failed to delete feedback');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to delete feedback');
        }
    }
);

const feedbackSlice = createSlice({
    name: 'feedback',
    initialState,
    reducers: {
        clearFeedbackError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFeedbacks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFeedbacks.fulfilled, (state, action: PayloadAction<Feedback[]>) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchFeedbacks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addMatcher(
                (action) => action.type.startsWith('feedback/') && action.type.endsWith('/pending'),
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                (action) => action.type.startsWith('feedback/') && action.type.endsWith('/fulfilled'),
                (state) => {
                    state.loading = false;
                }
            )
            .addMatcher(
                (action) => action.type.startsWith('feedback/') && action.type.endsWith('/rejected'),
                (state, action: any) => {
                    state.loading = false;
                    state.error = action.payload as string;
                }
            );
    },
});

export const { clearFeedbackError } = feedbackSlice.actions;
export default feedbackSlice.reducer;
