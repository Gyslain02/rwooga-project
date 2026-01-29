
import React from 'react';
import {
  Box,
  Video,
  Printer,
  Layout,
  Layers,
  Palette,
  Cpu
} from 'lucide-react';
import { Service, PortfolioItem, Product } from './types';

// Asset Imports
import vizImg from './assets/Ruti v4_Room 1.jpg.jpeg';
import animImg from './assets/sp.mp4';
import customImg from './assets/sp2.png';
import printImg from './assets/sp1.png';

// Portfolio Imports
import ruti1 from './assets/Ruti v4_Room 1.jpg.jpeg';
import ruti2 from './assets/Ruti v4_Room 1 (2).jpg.jpeg';
import ruti3 from './assets/Ruti v4_Room 1 (3).jpg.jpeg';
import ruti4 from './assets/Ruti v4_Room 2.jpg.jpeg';
import ruti5 from './assets/Ruti v4_Room 2 (2).jpg.jpeg';
import ruti6 from './assets/Ruti v4_Room 2 (3).jpg.jpeg';

import maguru1 from './assets/Maguru photoshoot.png';
import maguru2 from './assets/Maguru and mom 2.png';
import maguru3 from './assets/Maguru.jpg';

import sp1 from './assets/sp1.png';
import sp2 from './assets/sp2.png';
import sp3 from './assets/sp3.png';
import spVideo from './assets/sp.mp4';
import movieVideo from './assets/MAGURU N_INSIBIKA MOVIE first look.mp4';

import sample3 from './assets/sample 3.png';
import img0300 from './assets/0300.png';

// Product Imports
import prod1 from './assets/sample 3.png';
import prod2 from './assets/sp1.png';
import prod3 from './assets/0300.png';

export const WHATSAPP_NUMBER = "+250784269593";
export const BRAND_EMAIL = "phedokat@gmail.com";

export const SERVICES: Service[] = [
  {
    id: 'viz',
    title: '3D Visualization',
    description: 'Hyper-realistic architectural and product renderings that bring your blueprints to life.',
    icon: 'Layout',
    image: vizImg
  },
  {
    id: 'anim',
    title: 'Animated Movies & Ads',
    description: 'Engaging promotional content and storytelling through high-end 3D animation.',
    icon: 'Video',
    image: animImg
  },
  {
    id: 'custom',
    title: 'Custom 3D Design',
    description: 'Bespoke design services for unique mechanical parts, art, or prototypes.',
    icon: 'Palette',
    image: customImg
  },
  {
    id: 'print',
    title: '3D Printing',
    description: 'Precision manufacturing of custom designs and ready-made products in various materials.',
    icon: 'Printer',
    image: printImg
  }
];

export const PORTFOLIO: PortfolioItem[] = [
  // Visualization
  { id: 'v1', title: 'Ruti Room 1', category: 'visualization', image: ruti1, description: 'High-end architectural interior visualization.' },
  { id: 'v2', title: 'Ruti Room 1 (Alt)', category: 'visualization', image: ruti2, description: 'Modern interior design rendering.' },
  { id: 'v3', title: 'Ruti Room 1 (Detail)', category: 'visualization', image: ruti3, description: 'Detailed architectural render.' },
  { id: 'v4', title: 'Ruti Room 2', category: 'visualization', image: ruti4, description: 'Luxury bedroom visualization.' },
  { id: 'v5', title: 'Ruti Room 2 (Alt)', category: 'visualization', image: ruti5, description: 'Elegant interior design visualization.' },
  { id: 'v6', title: 'Ruti Room 2 (Detail)', category: 'visualization', image: ruti6, description: 'Photorealistic architectural rendering.' },

  // Animation
  { id: 'a1', title: 'Insibika Movie', category: 'animation', image: movieVideo, description: 'First look at the MAGURU N_INSIBIKA movie.' },
  { id: 'a2', title: 'Promotional Motion', category: 'animation', image: spVideo, description: 'Dynamic 3D character/product animation.' },

  // Products
  { id: 'p1', title: 'Maguru Photoshoot', category: 'product', image: maguru1, description: 'Professional product photography showcase.' },
  { id: 'p2', title: 'Maguru & Mom', category: 'product', image: maguru2, description: 'Heartfelt 3D printed/designed character showcase.' },
  { id: 'p3', title: 'Maguru Portrait', category: 'product', image: maguru3, description: 'Clean product portrait.' },
  { id: 'p4', title: 'Artistic Sculpture', category: 'product', image: sample3, description: 'Detailed 3D printed artistic piece.' },
  { id: 'p5', title: 'Tech Component', category: 'product', image: img0300, description: 'Precision engineered 3D printed part.' },

  // Print / Custom
  { id: 'pr1', title: 'Custom Model A', category: 'print', image: sp1, description: 'Custom precision 3D printed model.' },
  { id: 'pr2', title: 'Functional Design B', category: 'print', image: sp2, description: 'Mechanical part prototyping.' },
  { id: 'pr3', title: 'Experimental Print C', category: 'print', image: sp3, description: 'Advanced material 3D printing test.' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Geometric Planter',
    price: 15000,
    currency: 'RWF',
    image: prod1,
    category: 'Home Decor',
    variants: { size: ['Small', 'Medium', 'Large'], material: ['PLA', 'PETG'], color: ['Cyan', 'White', 'Black'] }
  },
  {
    id: 'p2',
    name: 'Minimalist Phone Stand',
    price: 8000,
    currency: 'RWF',
    image: prod2,
    category: 'Accessories',
    variants: { size: ['Standard'], material: ['PLA'], color: ['Silver', 'Gold', 'Black'] }
  },
  {
    id: 'p3',
    name: 'Articulated Dragon',
    price: 25000,
    currency: 'RWF',
    image: prod3,
    category: 'Toys',
    variants: { size: ['Medium'], material: ['Silk PLA'], color: ['Rainbow', 'Blue-Green'] }
  }
];

export const getIcon = (name: string) => {
  switch (name) {
    case 'Layout': return <Layout size={24} />;
    case 'Video': return <Video size={24} />;
    case 'Palette': return <Palette size={24} />;
    case 'Printer': return <Printer size={24} />;
    case 'Layers': return <Layers size={24} />;
    case 'Cpu': return <Cpu size={24} />;
    default: return <Box size={24} />;
  }
};
