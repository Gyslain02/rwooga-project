
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CustomRequest {
    id: string | number;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: string;
    date: string;
    [key: string]: any;
}

interface RequestsState {
    items: CustomRequest[];
}

const initialState: RequestsState = {
    items: JSON.parse(localStorage.getItem('custom_requests') || '[]'),
};

const requestsSlice = createSlice({
    name: 'requests',
    initialState,
    reducers: {
        setRequests: (state, action: PayloadAction<CustomRequest[]>) => {
            state.items = action.payload;
            localStorage.setItem('custom_requests', JSON.stringify(state.items));
        },
        deleteRequest: (state, action: PayloadAction<string | number>) => {
            state.items = state.items.filter(r => r.id !== action.payload);
            localStorage.setItem('custom_requests', JSON.stringify(state.items));
        }
    }
});

export const { setRequests, deleteRequest } = requestsSlice.actions;
export default requestsSlice.reducer;
