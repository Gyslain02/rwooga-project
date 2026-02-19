import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ordersService } from '@/services/ordersService';

export interface OrderItem {
    id: string;
    product_name: string;
    quantity: number;
    price_at_purchase: number;
    subtotal: number;
    product: {
        id: string;
        name: string;
        image?: string;
        thumbnail?: string;
    };
}

export interface Order {
    id: string;
    order_number: string;
    status: string;
    total_amount: number;
    shipping_fee: number;
    final_amount: number;
    shipping_address: string;
    shipping_phone: number;
    tracking_number?: string;
    customer_notes: string;
    created_at: string;
    paid_at?: string;
    shipped_at?: string;
    delivered_at?: string;
    items: OrderItem[];
}

interface OrdersState {
    items: Order[];
    loading: boolean;
    error: string | null;
}

const initialState: OrdersState = {
    items: [],
    loading: false,
    error: null,
};

export const fetchOrders = createAsyncThunk(
    'orders/fetchOrders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await ordersService.getOrders();
            if (response.ok) {
                return response.data.results || response.data;
            }
            return rejectWithValue('Failed to fetch orders');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch orders');
        }
    }
);

export const createOrder = createAsyncThunk(
    'orders/createOrder',
    async (orderData: any, { rejectWithValue, dispatch }) => {
        try {
            const response = await ordersService.createOrder(orderData);
            if (response.ok) {
                dispatch(fetchOrders());
                return response.data;
            }
            return rejectWithValue('Failed to create order');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to create order');
        }
    }
);

export const cancelOrder = createAsyncThunk(
    'orders/cancelOrder',
    async (orderId: string | number, { rejectWithValue, dispatch }) => {
        try {
            const response = await ordersService.cancelOrder(orderId);
            if (response.ok) {
                dispatch(fetchOrders());
                return response.data;
            }
            return rejectWithValue('Failed to cancel order');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to cancel order');
        }
    }
);

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        clearOrdersError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Orders
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Create Order
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Cancel Order
            .addCase(cancelOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(cancelOrder.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(cancelOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearOrdersError } = ordersSlice.actions;
export default ordersSlice.reducer;
