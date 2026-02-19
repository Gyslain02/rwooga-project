import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { mediaService } from '@/services/mediaService';

export interface Media {
    id: string;
    product: number;
    product_name?: string;
    media_type: 'IMAGE' | 'VIDEO' | 'MODEL_3D';
    image_url?: string;
    video_file_url?: string;
    model_file?: string;
    display_order: number;
    created_at: string;
    updated_at: string;
}

interface MediaState {
    items: Media[];
    loading: boolean;
    error: string | null;
}

const initialState: MediaState = {
    items: [],
    loading: false,
    error: null,
};

export const fetchMedia = createAsyncThunk(
    'media/fetchMedia',
    async (params: any = {}, { rejectWithValue }) => {
        try {
            const response = await mediaService.getMedia(params);
            if (response.ok) {
                return response.data.results || response.data;
            }
            return rejectWithValue('Failed to fetch media');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch media');
        }
    }
);

export const uploadMedia = createAsyncThunk(
    'media/uploadMedia',
    async (formData: FormData, { rejectWithValue, dispatch }) => {
        try {
            const response = await mediaService.createMedia(formData);
            if (response.ok) {
                dispatch(fetchMedia({}));
                return response.data;
            }
            return rejectWithValue('Failed to upload media');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to upload media');
        }
    }
);

export const deleteMedia = createAsyncThunk(
    'media/deleteMedia',
    async (id: string | number, { rejectWithValue, dispatch }) => {
        try {
            const response = await mediaService.deleteMedia(id);
            if (response.ok) {
                dispatch(fetchMedia({}));
                return id;
            }
            return rejectWithValue('Failed to delete media');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to delete media');
        }
    }
);

const mediaSlice = createSlice({
    name: 'media',
    initialState,
    reducers: {
        clearMediaError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMedia.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMedia.fulfilled, (state, action: PayloadAction<Media[]>) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchMedia.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addMatcher(
                (action) => action.type.startsWith('media/') && action.type.endsWith('/pending'),
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                (action) => action.type.startsWith('media/') && action.type.endsWith('/fulfilled'),
                (state) => {
                    state.loading = false;
                }
            )
            .addMatcher(
                (action) => action.type.startsWith('media/') && action.type.endsWith('/rejected'),
                (state, action: any) => {
                    state.loading = false;
                    state.error = action.payload as string;
                }
            );
    },
});

export const { clearMediaError } = mediaSlice.actions;
export default mediaSlice.reducer;
