import api from './api';

const API_URL = '/api/v1/products';

export interface ProductFormData {
  name: string;
  category: string;
  short_description: string;
  detailed_description?: string;
  unit_price: number;
  currency?: string;
  available_sizes?: string;
  available_colors?: string;
  available_materials?: string;
  length?: number;
  width?: number;
  height?: number;
  measurement_unit?: string;
  published?: boolean;
}

export interface ProductMediaData {
  product: string;
  image?: File;
  video_file?: File;
  video_url?: string;
  alt_text?: string;
  display_order?: number;
}

class AdminProductService {
  /**
   * Get all products (including unpublished for admin)
   */
  async getAllProducts(params?: { category?: string; published?: boolean; search?: string }) {
    try {
      const response = await api.get(`${API_URL}/products/`, {
        params,
        headers: this.getAuthHeaders(),
      });
      return { ok: true, data: response.data };
    } catch (error: any) {
      console.error('Error fetching products:', error);
      return { ok: false, error: error.response?.data || error.message };
    }
  }

  /**
   * Get a single product by ID
   */
  async getProduct(id: string) {
    try {
      const response = await api.get(`${API_URL}/products/${id}/`, {
        headers: this.getAuthHeaders(),
      });
      return { ok: true, data: response.data };
    } catch (error: any) {
      console.error('Error fetching product:', error);
      return { ok: false, error: error.response?.data || error.message };
    }
  }

  /**
   * Create a new product
   */
  async createProduct(productData: ProductFormData) {
    try {
      const response = await api.post(`${API_URL}/products/`, productData, {
        headers: this.getAuthHeaders(),
      });
      return { ok: true, data: response.data };
    } catch (error: any) {
      console.error('Error creating product:', error);
      return { ok: false, error: error.response?.data || error.message };
    }
  }

  /**
   * Update an existing product
   */
  async updateProduct(id: string, productData: Partial<ProductFormData>) {
    try {
      const response = await api.patch(`${API_URL}/products/${id}/`, productData, {
        headers: this.getAuthHeaders(),
      });
      return { ok: true, data: response.data };
    } catch (error: any) {
      console.error('Error updating product:', error);
      return { ok: false, error: error.response?.data || error.message };
    }
  }

  /**
   * Delete a product
   */
  async deleteProduct(id: string) {
    try {
      await api.delete(`${API_URL}/products/${id}/`, {
        headers: this.getAuthHeaders(),
      });
      return { ok: true };
    } catch (error: any) {
      console.error('Error deleting product:', error);
      return { ok: false, error: error.response?.data || error.message };
    }
  }

  /**
   * Publish a product
   */
  async publishProduct(id: string) {
    try {
      const response = await api.post(`${API_URL}/products/${id}/publish/`, {}, {
        headers: this.getAuthHeaders(),
      });
      return { ok: true, data: response.data };
    } catch (error: any) {
      console.error('Error publishing product:', error);
      return { ok: false, error: error.response?.data || error.message };
    }
  }

  /**
   * Unpublish a product
   */
  async unpublishProduct(id: string) {
    try {
      const response = await api.post(`${API_URL}/products/${id}/unpublish/`, {}, {
        headers: this.getAuthHeaders(),
      });
      return { ok: true, data: response.data };
    } catch (error: any) {
      console.error('Error unpublishing product:', error);
      return { ok: false, error: error.response?.data || error.message };
    }
  }

  /**
   * Upload product media (images, videos, 3D models)
   */
  async uploadProductMedia(productId: string, mediaFile: File, mediaType: 'image' | 'video' | '3d_model', altText?: string, displayOrder?: number) {
    try {
      const formData = new FormData();
      formData.append('product', productId);

      if (mediaType === 'image') {
        formData.append('image', mediaFile);
      } else if (mediaType === 'video') {
        formData.append('video_file', mediaFile);
      } else if (mediaType === '3d_model') {
        formData.append('model_3d', mediaFile);
      }

      if (altText) formData.append('alt_text', altText);
      if (displayOrder !== undefined) formData.append('display_order', displayOrder.toString());

      // Manually construct headers to avoid Content-Type issue and potential TS errors
      const token = localStorage.getItem('access_token');
      const headers = {
        'Authorization': token ? `Bearer ${token}` : '',
      };

      const response = await api.post(`${API_URL}/media/`, formData, {
        headers: headers,
      });
      return { ok: true, data: response.data };
    } catch (error: any) {
      console.error('Error uploading product media:', error);
      return { ok: false, error: error.response?.data || error.message };
    }
  }

  /**
   * Upload multiple product images with display order
   * @param productId - Product ID to upload images for
   * @param images - Array of image files to upload
   * @param mainImageIndex - Index of the image that should be the main image (display_order = 0)
   * @param productName - Product name for alt text
   */
  async uploadMultipleProductImages(productId: string, images: File[], mainImageIndex: number = 0, productName?: string) {
    try {
      const results = [];
      let failedCount = 0;

      // Upload images sequentially to avoid overwhelming the server
      for (let index = 0; index < images.length; index++) {
        try {
          const image = images[index];
          // Main image gets display_order = 0, others get sequential order
          const displayOrder = index === mainImageIndex ? 0 : (index < mainImageIndex ? index + 1 : index);
          const altText = productName ? `${productName} - Image ${index + 1}` : undefined;

          const result = await this.uploadProductMedia(productId, image, 'image', altText, displayOrder);
          results.push(result);

          if (!result.ok) {
            failedCount++;
            console.error(`Failed to upload image ${index + 1}:`, result.error);
          }

          // Small delay between uploads to prevent server overload
          await new Promise(resolve => setTimeout(resolve, 300));

        } catch (error: any) {
          failedCount++;
          console.error(`Error uploading image ${index + 1}:`, error);
          results.push({ ok: false, error: error.message });
        }
      }

      if (failedCount > 0) {
        return {
          ok: false,
          error: `${failedCount} out of ${images.length} image(s) failed to upload. Please try uploading the failed images individually.`,
          results
        };
      }

      return { ok: true, data: results.map(r => r.data) };
    } catch (error: any) {
      console.error('Error uploading multiple images:', error);
      return { ok: false, error: error.message };
    }
  }

  /**
   * Delete product media
   */
  async deleteProductMedia(mediaId: string) {
    try {
      await api.delete(`${API_URL}/media/${mediaId}/`, {
        headers: this.getAuthHeaders(),
      });
      return { ok: true };
    } catch (error: any) {
      console.error('Error deleting product media:', error);
      return { ok: false, error: error.response?.data || error.message };
    }
  }

  /**
   * Get product media for a specific product
   */
  async getProductMedia(productId: string) {
    try {
      const response = await api.get(`${API_URL}/media/`, {
        params: { product: productId },
        headers: this.getAuthHeaders(),
      });
      return { ok: true, data: response.data };
    } catch (error: any) {
      console.error('Error fetching product media:', error);
      return { ok: false, error: error.response?.data || error.message };
    }
  }

  /**
   * Get auth headers with token
   */
  private getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    };
  }
}

export const adminProductService = new AdminProductService();
