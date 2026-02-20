
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'visualization' | 'animation' | 'product' | 'print';
  type?: 'image' | 'video';
  image: string;
  description: string;
}

export interface ProductMedia {
  id: number;
  media_type: 'image' | 'video' | '3d_model';
  image?: string;
  image_url?: string;
  video_file?: string;
  video_file_url?: string;
  video_url?: string;
  model_3d?: string;
  model_file?: string;
  alt_text?: string;
  display_order: number;
}

export interface ProductCategory {
  id: number;
  name: string;
  description?: string;
  requires_dimensions?: boolean;
  requires_material?: boolean;
  is_active?: boolean;
  product_count?: number;
}

export interface Product {
  id: number;
  name: string;
  category: ProductCategory | number;
  category_name?: string;
  short_description: string;
  detailed_description?: string;
  unit_price: number;
  currency: string;
  available_colors?: string;
  available_materials?: string;
  published: boolean;
  length?: number | null;
  width?: number | null;
  height?: number | null;
  media: ProductMedia[];
  thumbnail?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AppSettings {
  isCustomPrintingEnabled: boolean;
}
export interface ShippingRecord {
  id: string | number;
  order?: {
    id: string | number;
    order_number: string;
  };
  shipping_fee?: number | string;
  shipping_phone?: string;
  district?: string;
  sector?: string;
  street_address?: string;
  created_at: string;
  updated_at?: string;
}export interface PaymentRecord {
  id: string | number;
  amount: number | string;
  currency: string;
  status: 'PENDING' | 'PROCESSING' | 'SUCCESSFUL' | 'FAILED' | 'CANCELLED';
  payment_method: string;
  provider?: string;
  card_number_masked?: string;
  card_type?: string;
  reference: string;
  transaction_id?: string;
  order?: string | {
    id: string | number;
    order_number: string;
  };
  phone_number?: string;
  district?: string;
  sector?: string;
  street?: string;
  expires_at?: string;
  created_at: string;
  updated_at?: string;
}
