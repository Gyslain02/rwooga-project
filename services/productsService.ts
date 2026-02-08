import { API_BASE_URL } from '../constants';

const handleResponse = async (response: Response) => {
    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
        const error = (data && (data.message || data.detail || (typeof data === 'string' ? data : JSON.stringify(data)))) || response.statusText;
        throw new Error(error);
    }

    return {
        ok: true,
        status: response.status,
        data: data
    };
};

export const productsService = {
    async getProducts(params?: {
        category?: string;
        published?: boolean;
        min_price?: number;
        max_price?: number;
        search?: string;
        ordering?: string;
    }) {
        const queryParams = new URLSearchParams();
        if (params?.category) queryParams.append('category', params.category);
        if (params?.published !== undefined) queryParams.append('published', String(params.published));
        if (params?.min_price) queryParams.append('min_price', String(params.min_price));
        if (params?.max_price) queryParams.append('max_price', String(params.max_price));
        if (params?.search) queryParams.append('search', params.search);
        if (params?.ordering) queryParams.append('ordering', params.ordering);

        const url = `${API_BASE_URL}/products/products/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        return handleResponse(response);
    },

    async getProduct(id: string | number) {
        const response = await fetch(`${API_BASE_URL}/products/products/${id}/`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        return handleResponse(response);
    },

    async getCategories() {
        const response = await fetch(`${API_BASE_URL}/products/categories/`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        return handleResponse(response);
    },

    async getProductMedia(productId: string | number) {
        const response = await fetch(`${API_BASE_URL}/products/media/?product=${productId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        return handleResponse(response);
    },

    async getProductFeedback(productId: string | number) {
        const response = await fetch(`${API_BASE_URL}/products/feedback/?product=${productId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        return handleResponse(response);
    },

    async createFeedback(data: {
        product: number;
        rating: number;
        comment: string;
    }, token: string) {
        const response = await fetch(`${API_BASE_URL}/products/feedback/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    }
};
