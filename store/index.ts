
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '@/store/slices/cartSlice';
import wishlistReducer from '@/store/slices/wishlistSlice';
import productsReducer from '@/store/slices/productsSlice';
import requestsReducer from '@/store/slices/requestsSlice';
import settingsReducer from '@/store/slices/settingsSlice';
import usersReducer from '@/store/slices/usersSlice';

import ordersReducer from '@/store/slices/ordersSlice';
import refundsReducer from '@/store/slices/refundsSlice';
import returnsReducer from '@/store/slices/returnsSlice';
import shippingReducer from '@/store/slices/shippingSlice';
import paymentsReducer from '@/store/slices/paymentsSlice';
import discountsReducer from '@/store/slices/discountsSlice';
import feedbackReducer from '@/store/slices/feedbackSlice';
import mediaReducer from '@/store/slices/mediaSlice';

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        wishlist: wishlistReducer,
        products: productsReducer,
        requests: requestsReducer,
        settings: settingsReducer,
        users: usersReducer,
        orders: ordersReducer,
        refunds: refundsReducer,
        returns: returnsReducer,
        shipping: shippingReducer,
        payments: paymentsReducer,
        discounts: discountsReducer,
        feedback: feedbackReducer,
        media: mediaReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
