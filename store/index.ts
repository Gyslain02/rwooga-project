
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '@/store/slices/cartSlice';
import wishlistReducer from '@/store/slices/wishlistSlice';
import productsReducer from '@/store/slices/productsSlice';
import requestsReducer from '@/store/slices/requestsSlice';
import settingsReducer from '@/store/slices/settingsSlice';
import usersReducer from '@/store/slices/usersSlice';

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        wishlist: wishlistReducer,
        products: productsReducer,
        requests: requestsReducer,
        settings: settingsReducer,
        users: usersReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
