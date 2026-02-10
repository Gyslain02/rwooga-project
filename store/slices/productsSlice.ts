
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PRODUCTS } from '@/constants';

interface Product {
    id: string | number;
    name: string;
    price: number;
    description: string;
    available: boolean;
    image: string;
    currency?: string;
}

interface ProductsState {
    items: Product[];
}

const savedProducts = JSON.parse(localStorage.getItem('rwooga_products') || '[]');
const initialState: ProductsState = {
    items: savedProducts.length > 0 ? savedProducts : PRODUCTS.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        description: p.description || '',
        available: true,
        image: p.image,
        currency: p.currency
    })),
};

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setProducts: (state, action: PayloadAction<Product[]>) => {
            state.items = action.payload;
            localStorage.setItem('rwooga_products', JSON.stringify(state.items));
        },
        addProduct: (state, action: PayloadAction<Product>) => {
            state.items.push(action.payload);
            localStorage.setItem('rwooga_products', JSON.stringify(state.items));
        },
        updateProduct: (state, action: PayloadAction<Product>) => {
            const index = state.items.findIndex(p => p.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
                localStorage.setItem('rwooga_products', JSON.stringify(state.items));
            }
        },
        deleteProduct: (state, action: PayloadAction<string | number>) => {
            state.items = state.items.filter(p => p.id !== action.payload);
            localStorage.setItem('rwooga_products', JSON.stringify(state.items));
        }
    }
});

export const { setProducts, addProduct, updateProduct, deleteProduct } = productsSlice.actions;
export default productsSlice.reducer;
