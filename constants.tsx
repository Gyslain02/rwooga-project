
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
import printImg from './assets/Maguru.jpg';

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

// Video Imports
import herMajestyVideo from './assets/Her Majesty.mp4';
import rwAstronautsVideo from './assets/Rwandan astronotes.mp4';
import nescafeVideo from './assets/nESCAFE.mp4';

// New Image Imports
import abstractArt from './assets/tttvftc.png';
import futuristicConcept from './assets/gaxc.png';

// Additional Video Imports
import akarushoVideo from './assets/AKARUSHO 2.mp4';
import iyaweVideo from './assets/IYAWE.mp4';
import sinaGerardVideo from './assets/SINA GERARD.mp4';
import whatsappVideo from './assets/WhatsApp Video 2024-11-01 at 13.16.35_ca37b94f.mp4';

// Additional Image Imports
import bblImg from './assets/bbl.png';
import fffImg from './assets/fff.png';
import ttImg from './assets/tt.png';
import unknownImg1 from './assets/untiledd.png';
import unknownImg2 from './assets/untitled.png';
import unknownImg3 from './assets/untitled2.png';
import unknownImg4 from './assets/untitled3.png';
import unknownImgA from './assets/untitleda.png';
import unknownImgB from './assets/untitledb.png';
import unknownImgBC from './assets/untitledbc.png';


export const WHATSAPP_NUMBER = "+250784269593";
export const BRAND_EMAIL = "phedokat@gmail.com";
export const API_BASE_URL = import.meta.env.VITE_API_URL || "https://modern-noemi-rwooga3dservices-e96463f8.koyeb.app";

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
  { id: 'v1', title: 'Ruti Room 1', category: 'visualization', type: 'image', image: ruti1, description: 'High-end architectural interior visualization.' },
  { id: 'v2', title: 'Ruti Room 1 (Alt)', category: 'visualization', type: 'image', image: ruti2, description: 'Modern interior design rendering.' },
  { id: 'v3', title: 'Ruti Room 1 (Detail)', category: 'visualization', type: 'image', image: ruti3, description: 'Detailed architectural render.' },
  { id: 'v4', title: 'Ruti Room 2', category: 'visualization', type: 'image', image: ruti4, description: 'Luxury bedroom visualization.' },
  { id: 'v5', title: 'Ruti Room 2 (Alt)', category: 'visualization', type: 'image', image: ruti5, description: 'Elegant interior design visualization.' },
  { id: 'v6', title: 'Ruti Room 2 (Detail)', category: 'visualization', type: 'image', image: ruti6, description: 'Photorealistic architectural rendering.' },
  { id: 'v7', title: 'Futuristic Concept', category: 'visualization', type: 'image', image: futuristicConcept, description: 'Advanced futuristic environment design.' },
  { id: 'v8', title: 'Concept Art FFF', category: 'visualization', type: 'image', image: fffImg, description: 'Creative visualization concept.' },
  { id: 'v9', title: 'Artistic Render TT', category: 'visualization', type: 'image', image: ttImg, description: 'Surreal artistic visualization.' },
  { id: 'v10', title: 'Project Untitled A', category: 'visualization', type: 'image', image: unknownImgA, description: 'Modern design concept.' },

  // Animation
  { id: 'a1', title: 'Insibika Movie', category: 'animation', type: 'video', image: movieVideo, description: 'First look at the MAGURU N_INSIBIKA movie.' },
  { id: 'a2', title: 'Promotional Motion', category: 'animation', type: 'video', image: spVideo, description: 'Dynamic 3D character/product animation.' },
  { id: 'a3', title: 'Her Majesty', category: 'animation', type: 'video', image: herMajestyVideo, description: 'Cinematic character animation showcase.' },
  { id: 'a4', title: 'Rwandan Astronauts', category: 'animation', type: 'video', image: rwAstronautsVideo, description: 'Space exploration concept animation.' },
  { id: 'a5', title: 'Nescafe Commercial', category: 'animation', type: 'video', image: nescafeVideo, description: 'High-energy product commercial.' },
  { id: 'a6', title: 'Akarusho Animation', category: 'animation', type: 'video', image: akarushoVideo, description: 'Engaging promotional animation.' },
  { id: 'a7', title: 'Iyawe Music Visual', category: 'animation', type: 'video', image: iyaweVideo, description: 'Visual accompaniment for music based project.' },
  { id: 'a8', title: 'Sina Gerard Commercial', category: 'animation', type: 'video', image: sinaGerardVideo, description: 'Promotional video for Sina Gerard product.' },
  { id: 'a9', title: 'WhatsApp Project', category: 'animation', type: 'video', image: whatsappVideo, description: 'Social media video project.' },

  // Products
  { id: 'p1', title: 'Maguru Photoshoot', category: 'product', type: 'image', image: maguru1, description: 'Professional product photography showcase.' },
  { id: 'p2', title: 'Maguru & Mom', category: 'product', type: 'image', image: maguru2, description: 'Heartfelt 3D printed/designed character showcase.' },
  { id: 'p3', title: 'Maguru Portrait', category: 'product', type: 'image', image: maguru3, description: 'Clean product portrait.' },
  { id: 'p4', title: 'Artistic Sculpture', category: 'product', type: 'image', image: sample3, description: 'Detailed 3D printed artistic piece.' },
  { id: 'p5', title: 'Tech Component', category: 'product', type: 'image', image: img0300, description: 'Precision engineered 3D printed part.' },
  { id: 'p6', title: 'Product Concept BBL', category: 'product', type: 'image', image: bblImg, description: 'Innovative product design render.' },
  { id: 'p7', title: 'Project Untitled 1', category: 'product', type: 'image', image: unknownImg1, description: 'Conceptual product design.' },
  { id: 'p8', title: 'Project Untitled 2', category: 'product', type: 'image', image: unknownImg2, description: 'Detailed product visualization.' },

  // Print / Custom
  { id: 'pr1', title: 'Custom Model A', category: 'print', type: 'image', image: sp1, description: 'Custom precision 3D printed model.' },
  { id: 'pr2', title: 'Functional Design B', category: 'print', type: 'image', image: sp2, description: 'Mechanical part prototyping.' },
  { id: 'pr3', title: 'Experimental Print C', category: 'print', type: 'image', image: sp3, description: 'Advanced material 3D printing test.' },
  { id: 'pr4', title: 'Abstract Art Print', category: 'print', type: 'image', image: abstractArt, description: 'Complex geometry 3D print.' },
  { id: 'pr6', title: 'Project Untitled 3', category: 'print', type: 'image', image: unknownImg3, description: 'Prototype model print.' },
  { id: 'pr7', title: 'Project Untitled 4', category: 'print', type: 'image', image: unknownImg4, description: 'Testing material properties.' },
  { id: 'pr8', title: 'Project Untitled B', category: 'print', type: 'image', image: unknownImgB, description: 'Mechanical assembly print.' },
  { id: 'pr9', title: 'Project Untitled BC', category: 'print', type: 'image', image: unknownImgBC, description: 'Complex multi-part print.' },
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
