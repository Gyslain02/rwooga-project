
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

export interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  image: string;
  description?: string;
  category: string;
  variants: {
    size: string[];
    material: string[];
    color: string[];
  };
}

export interface AppSettings {
  isCustomPrintingEnabled: boolean;
}
