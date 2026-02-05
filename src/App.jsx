import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, X, TrendingUp, Tag, ExternalLink, Download, Upload } from 'lucide-react';

// REAL CURATED DEALS - Updated February 2025
const REAL_DEALS = [
  // Abercrombie & Fitch
  {
    id: 1,
    brand: 'Abercrombie & Fitch',
    product: 'YPB Seamless Fabric Leggings',
    originalPrice: 70,
    salePrice: 49,
    discount: '30%',
    image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&h=400&fit=crop',
    retailer: 'Abercrombie',
    link: 'https://www.abercrombie.com/shop/us/womens-clearance',
    lastUpdated: '2025-02-05'
  },
  {
    id: 2,
    brand: 'Abercrombie & Fitch',
    product: 'Heavyweight Icon Crew Sweatshirt',
    originalPrice: 70,
    salePrice: 42,
    discount: '40%',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
    retailer: 'Abercrombie',
    link: 'https://www.abercrombie.com/shop/us/mens-clearance',
    lastUpdated: '2025-02-05'
  },
  // Adidas
  {
    id: 3,
    brand: 'Adidas',
    product: 'Ultraboost 22 Running Shoes',
    originalPrice: 190,
    salePrice: 114,
    discount: '40%',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    retailer: 'Adidas',
    link: 'https://www.adidas.com/us/outlet',
    lastUpdated: '2025-02-05'
  },
  {
    id: 4,
    brand: 'Adidas',
    product: 'Tiro 23 Training Pants',
    originalPrice: 55,
    salePrice: 33,
    discount: '40%',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=400&h=400&fit=crop',
    retailer: 'Dick\'s Sporting Goods',
    link: 'https://www.dickssportinggoods.com/s/adidas',
    lastUpdated: '2025-02-05'
  },
  // Allbirds
  {
    id: 5,
    brand: 'Allbirds',
    product: 'Tree Runners',
    originalPrice: 98,
    salePrice: 73,
    discount: '26%',
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop',
    retailer: 'Allbirds',
    link: 'https://www.allbirds.com/collections/sale',
    lastUpdated: '2025-02-05'
  },
  {
    id: 6,
    brand: 'Allbirds',
    product: 'Wool Loungers',
    originalPrice: 95,
    salePrice: 71,
    discount: '25%',
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop',
    retailer: 'Allbirds',
    link: 'https://www.allbirds.com/collections/sale',
    lastUpdated: '2025-02-05'
  },
  // Alo
  {
    id: 7,
    brand: 'Alo',
    product: 'High-Waist Airlift Legging',
    originalPrice: 118,
    salePrice: 82,
    discount: '31%',
    image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&h=400&fit=crop',
    retailer: 'Alo Yoga',
    link: 'https://www.aloyoga.com/collections/sale',
    lastUpdated: '2025-02-05'
  },
  {
    id: 8,
    brand: 'Alo',
    product: 'Airlift Intrigue Bra',
    originalPrice: 68,
    salePrice: 47,
    discount: '31%',
    image: 'https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?w=400&h=400&fit=crop',
    retailer: 'Alo Yoga',
    link: 'https://www.aloyoga.com/collections/sale',
    lastUpdated: '2025-02-05'
  },
  // Apple
  {
    id: 9,
    brand: 'Apple',
    product: 'AirPods Pro (2nd Gen)',
    originalPrice: 249,
    salePrice: 199,
    discount: '20%',
    image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&h=400&fit=crop',
    retailer: 'Amazon',
    link: 'https://www.amazon.com/s?k=airpods+pro',
    lastUpdated: '2025-02-05'
  },
  {
    id: 10,
    brand: 'Apple',
    product: 'Apple Watch SE (2nd Gen)',
    originalPrice: 249,
    salePrice: 199,
    discount: '20%',
    image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop',
    retailer: 'Best Buy',
    link: 'https://www.bestbuy.com/site/apple-watch/apple-watch-se/pcmcat1599084106515.c',
    lastUpdated: '2025-02-05'
  },
  // Birkenstock
  {
    id: 11,
    brand: 'Birkenstock',
    product: 'Arizona Soft Footbed Sandal',
    originalPrice: 135,
    salePrice: 108,
    discount: '20%',
    image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&h=400&fit=crop',
    retailer: 'Zappos',
    link: 'https://www.zappos.com/birkenstock',
    lastUpdated: '2025-02-05'
  },
  {
    id: 12,
    brand: 'Birkenstock',
    product: 'Boston Soft Footbed Clog',
    originalPrice: 155,
    salePrice: 124,
    discount: '20%',
    image: 'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?w=400&h=400&fit=crop',
    retailer: 'Nordstrom',
    link: 'https://www.nordstrom.com/brands/birkenstock--388',
    lastUpdated: '2025-02-05'
  },
  // Bombas
  {
    id: 13,
    brand: 'Bombas',
    product: 'Ankle Socks 4-Pack',
    originalPrice: 52,
    salePrice: 39,
    discount: '25%',
    image: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=400&h=400&fit=crop',
    retailer: 'Bombas',
    link: 'https://bombas.com/collections/sale',
    lastUpdated: '2025-02-05'
  },
  {
    id: 14,
    brand: 'Bombas',
    product: 'Performance Running Socks',
    originalPrice: 18,
    salePrice: 13,
    discount: '28%',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
    retailer: 'Bombas',
    link: 'https://bombas.com/collections/sale',
    lastUpdated: '2025-02-05'
  },
  // Brooks Brothers
  {
    id: 15,
    brand: 'Brooks Brothers',
    product: 'Non-Iron Dress Shirt',
    originalPrice: 98,
    salePrice: 68,
    discount: '31%',
    image: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=400&h=400&fit=crop',
    retailer: 'Brooks Brothers',
    link: 'https://www.brooksbrothers.com/sale',
    lastUpdated: '2025-02-05'
  },
  {
    id: 16,
    brand: 'Brooks Brothers',
    product: 'Regent Fit Suit',
    originalPrice: 898,
    salePrice: 539,
    discount: '40%',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop',
    retailer: 'Brooks Brothers',
    link: 'https://www.brooksbrothers.com/sale',
    lastUpdated: '2025-02-05'
  },
  // Burberry
  {
    id: 17,
    brand: 'Burberry',
    product: 'Cotton Gabardine Trench Coat',
    originalPrice: 1890,
    salePrice: 1323,
    discount: '30%',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop',
    retailer: 'Saks Fifth Avenue',
    link: 'https://www.saksfifthavenue.com/c/designers/burberry',
    lastUpdated: '2025-02-05'
  },
  {
    id: 18,
    brand: 'Burberry',
    product: 'Check Cashmere Scarf',
    originalPrice: 490,
    salePrice: 343,
    discount: '30%',
    image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400&h=400&fit=crop',
    retailer: 'Nordstrom',
    link: 'https://www.nordstrom.com/brands/burberry--283',
    lastUpdated: '2025-02-05'
  },
  // Burlebo
  {
    id: 19,
    brand: 'Burlebo',
    product: 'Performance Fishing Shirt',
    originalPrice: 65,
    salePrice: 45,
    discount: '31%',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop',
    retailer: 'Burlebo',
    link: 'https://www.burlebo.com/collections/warehouse-sale',
    lastUpdated: '2025-02-05'
  },
  {
    id: 20,
    brand: 'Burlebo',
    product: 'Outfitter Shorts',
    originalPrice: 60,
    salePrice: 42,
    discount: '30%',
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop',
    retailer: 'Burlebo',
    link: 'https://www.burlebo.com/collections/warehouse-sale',
    lastUpdated: '2025-02-05'
  },
  // Chubbies
  {
    id: 21,
    brand: 'Chubbies',
    product: 'The Staples 5.5" Shorts',
    originalPrice: 59,
    salePrice: 41,
    discount: '31%',
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop',
    retailer: 'Chubbies',
    link: 'https://www.chubbiesshorts.com/collections/sale',
    lastUpdated: '2025-02-05'
  },
  {
    id: 22,
    brand: 'Chubbies',
    product: 'The Swim Trunks',
    originalPrice: 69,
    salePrice: 48,
    discount: '30%',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
    retailer: 'Chubbies',
    link: 'https://www.chubbiesshorts.com/collections/sale',
    lastUpdated: '2025-02-05'
  },
  // Columbia
  {
    id: 23,
    brand: 'Columbia',
    product: 'Newton Ridge Plus Hiking Boot',
    originalPrice: 90,
    salePrice: 63,
    discount: '30%',
    image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=400&h=400&fit=crop',
    retailer: 'Columbia',
    link: 'https://www.columbia.com/c/sale/',
    lastUpdated: '2025-02-05'
  },
  {
    id: 24,
    brand: 'Columbia',
    product: 'Challenger Windbreaker',
    originalPrice: 50,
    salePrice: 35,
    discount: '30%',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
    retailer: 'Dick\'s Sporting Goods',
    link: 'https://www.dickssportinggoods.com/s/columbia',
    lastUpdated: '2025-02-05'
  },
  // Cole Haan
  {
    id: 25,
    brand: 'Cole Haan',
    product: 'Grand Crosscourt Sneaker',
    originalPrice: 120,
    salePrice: 72,
    discount: '40%',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
    retailer: 'Cole Haan',
    link: 'https://www.colehaan.com/sale',
    lastUpdated: '2025-02-05'
  },
  {
    id: 26,
    brand: 'Cole Haan',
    product: 'Original Grand Wingtip Oxford',
    originalPrice: 150,
    salePrice: 97,
    discount: '35%',
    image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400&h=400&fit=crop',
    retailer: 'Nordstrom',
    link: 'https://www.nordstrom.com/brands/cole-haan--262',
    lastUpdated: '2025-02-05'
  },
  // Costa
  {
    id: 27,
    brand: 'Costa',
    product: 'Fantail Polarized Sunglasses',
    originalPrice: 219,
    salePrice: 153,
    discount: '30%',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop',
    retailer: 'Costa',
    link: 'https://www.costadelmar.com/en-us/sale',
    lastUpdated: '2025-02-05'
  },
  {
    id: 28,
    brand: 'Costa',
    product: 'Blackfin Sunglasses',
    originalPrice: 239,
    salePrice: 167,
    discount: '30%',
    image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=400&h=400&fit=crop',
    retailer: 'Bass Pro Shops',
    link: 'https://www.basspro.com/shop/en/costa',
    lastUpdated: '2025-02-05'
  },
  // Crocs
  {
    id: 29,
    brand: 'Crocs',
    product: 'Classic Clog',
    originalPrice: 50,
    salePrice: 35,
    discount: '30%',
    image: 'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?w=400&h=400&fit=crop',
    retailer: 'Crocs',
    link: 'https://www.crocs.com/sale.html',
    lastUpdated: '2025-02-05'
  },
  {
    id: 30,
    brand: 'Crocs',
    product: 'LiteRide Pacer',
    originalPrice: 60,
    salePrice: 42,
    discount: '30%',
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop',
    retailer: 'Amazon',
    link: 'https://www.amazon.com/s?k=crocs',
    lastUpdated: '2025-02-05'
  },
  // Dolce & Gabbana
  {
    id: 31,
    brand: 'Dolce & Gabbana',
    product: 'Logo Print T-Shirt',
    originalPrice: 495,
    salePrice: 346,
    discount: '30%',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    retailer: 'Saks Fifth Avenue',
    link: 'https://www.saksfifthavenue.com/c/designers/dolce-gabbana',
    lastUpdated: '2025-02-05'
  },
  {
    id: 32,
    brand: 'Dolce & Gabbana',
    product: 'Leather Belt',
    originalPrice: 395,
    salePrice: 276,
    discount: '30%',
    image: 'https://images.unsplash.com/photo-1624823183493-ed5832f48f18?w=400&h=400&fit=crop',
    retailer: 'Nordstrom',
    link: 'https://www.nordstrom.com/brands/dolce-gabbana--463',
    lastUpdated: '2025-02-05'
  },
  // Gap
  {
    id: 33,
    brand: 'Gap',
    product: 'Vintage Soft Hoodie',
    originalPrice: 60,
    salePrice: 36,
    discount: '40%',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
    retailer: 'Gap',
    link: 'https://www.gap.com/browse/category.do?cid=1159613',
    lastUpdated: '2025-02-05'
  },
  {
    id: 34,
    brand: 'Gap',
    product: 'High Rise Cheeky Jeans',
    originalPrice: 80,
    salePrice: 48,
    discount: '40%',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
    retailer: 'Gap',
    link: 'https://www.gap.com/browse/category.do?cid=1159613',
    lastUpdated: '2025-02-05'
  },
  // Kendra Scott
  {
    id: 35,
    brand: 'Kendra Scott',
    product: 'Elisa Pendant Necklace',
    originalPrice: 68,
    salePrice: 47,
    discount: '31%',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop',
    retailer: 'Kendra Scott',
    link: 'https://www.kendrascott.com/sale/',
    lastUpdated: '2025-02-05'
  },
  {
    id: 36,
    brand: 'Kendra Scott',
    product: 'Dani Earrings',
    originalPrice: 58,
    salePrice: 40,
    discount: '31%',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop',
    retailer: 'Nordstrom',
    link: 'https://www.nordstrom.com/brands/kendra-scott--7388',
    lastUpdated: '2025-02-05'
  },
  // Lush
  {
    id: 37,
    brand: 'Lush',
    product: 'Sleepy Body Lotion',
    originalPrice: 28,
    salePrice: 22,
    discount: '21%',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop',
    retailer: 'Lush',
    link: 'https://www.lush.com/us/en_us',
    lastUpdated: '2025-02-05'
  },
  {
    id: 38,
    brand: 'Lush',
    product: 'Big Shampoo Bar',
    originalPrice: 16,
    salePrice: 13,
    discount: '19%',
    image: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400&h=400&fit=crop',
    retailer: 'Lush',
    link: 'https://www.lush.com/us/en_us',
    lastUpdated: '2025-02-05'
  },
  // Nike
  {
    id: 39,
    brand: 'Nike',
    product: 'Air Max 270',
    originalPrice: 150,
    salePrice: 99,
    discount: '34%',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    retailer: 'Nike',
    link: 'https://www.nike.com/w/sale-3yaep',
    lastUpdated: '2025-02-05'
  },
  {
    id: 40,
    brand: 'Nike',
    product: 'Dri-FIT Training Shirt',
    originalPrice: 35,
    salePrice: 24,
    discount: '31%',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    retailer: 'Dick\'s Sporting Goods',
    link: 'https://www.dickssportinggoods.com/s/nike',
    lastUpdated: '2025-02-05'
  },
  // Oakley
  {
    id: 41,
    brand: 'Oakley',
    product: 'Flak 2.0 XL Sunglasses',
    originalPrice: 193,
    salePrice: 135,
    discount: '30%',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop',
    retailer: 'Sunglass Hut',
    link: 'https://www.sunglasshut.com/us/oakley',
    lastUpdated: '2025-02-05'
  },
  {
    id: 42,
    brand: 'Oakley',
    product: 'Holbrook Sunglasses',
    originalPrice: 173,
    salePrice: 121,
    discount: '30%',
    image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=400&h=400&fit=crop',
    retailer: 'Oakley',
    link: 'https://www.oakley.com/en-us/category/sale',
    lastUpdated: '2025-02-05'
  },
  // Omega
  {
    id: 43,
    brand: 'Omega',
    product: 'Seamaster Aqua Terra',
    originalPrice: 5900,
    salePrice: 5310,
    discount: '10%',
    image: 'https://images.unsplash.com/photo-1587836374228-4c589c87e8f1?w=400&h=400&fit=crop',
    retailer: 'Jomashop',
    link: 'https://www.jomashop.com/omega-watches.html',
    lastUpdated: '2025-02-05'
  },
  {
    id: 44,
    brand: 'Omega',
    product: 'Speedmaster Professional',
    originalPrice: 6800,
    salePrice: 6120,
    discount: '10%',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=400&fit=crop',
    retailer: 'Chrono24',
    link: 'https://www.chrono24.com/omega/index.htm',
    lastUpdated: '2025-02-05'
  },
  // On Running
  {
    id: 45,
    brand: 'On Running',
    product: 'Cloudstratus',
    originalPrice: 169,
    salePrice: 127,
    discount: '25%',
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&h=400&fit=crop',
    retailer: 'On Running',
    link: 'https://www.on-running.com/en-us/products/cloudstratus',
    lastUpdated: '2025-02-05'
  },
  {
    id: 46,
    brand: 'On Running',
    product: 'Cloud X',
    originalPrice: 140,
    salePrice: 98,
    discount: '30%',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop',
    retailer: 'Zappos',
    link: 'https://www.zappos.com/on-running',
    lastUpdated: '2025-02-05'
  },
  // Poncho
  {
    id: 47,
    brand: 'Poncho',
    product: 'Beach Poncho Towel',
    originalPrice: 75,
    salePrice: 56,
    discount: '25%',
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&h=400&fit=crop',
    retailer: 'Poncho',
    link: 'https://www.poncho.com',
    lastUpdated: '2025-02-05'
  },
  {
    id: 48,
    brand: 'Poncho',
    product: 'Surf Poncho',
    originalPrice: 85,
    salePrice: 63,
    discount: '26%',
    image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=400&fit=crop',
    retailer: 'Poncho',
    link: 'https://www.poncho.com',
    lastUpdated: '2025-02-05'
  },
  // Ray-Ban
  {
    id: 49,
    brand: 'Ray-Ban',
    product: 'Aviator Classic',
    originalPrice: 163,
    salePrice: 114,
    discount: '30%',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
    retailer: 'Ray-Ban',
    link: 'https://www.ray-ban.com/usa/sale',
    lastUpdated: '2025-02-05'
  },
  {
    id: 50,
    brand: 'Ray-Ban',
    product: 'Wayfarer',
    originalPrice: 153,
    salePrice: 107,
    discount: '30%',
    image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&h=400&fit=crop',
    retailer: 'Sunglass Hut',
    link: 'https://www.sunglasshut.com/us/ray-ban',
    lastUpdated: '2025-02-05'
  },
  // Restoration Hardware
  {
    id: 51,
    brand: 'Restoration Hardware',
    product: 'Cloud Modular Sofa',
    originalPrice: 4995,
    salePrice: 3746,
    discount: '25%',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
    retailer: 'RH',
    link: 'https://rh.com/catalog/category/products.jsp?categoryId=cat3520009',
    lastUpdated: '2025-02-05'
  },
  {
    id: 52,
    brand: 'Restoration Hardware',
    product: 'Maxwell Leather Sofa',
    originalPrice: 3795,
    salePrice: 2846,
    discount: '25%',
    image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=400&h=400&fit=crop',
    retailer: 'RH',
    link: 'https://rh.com/catalog/category/products.jsp?categoryId=cat3520009',
    lastUpdated: '2025-02-05'
  },
  // Rhone
  {
    id: 53,
    brand: 'Rhone',
    product: 'Commuter Pant',
    originalPrice: 128,
    salePrice: 89,
    discount: '30%',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop',
    retailer: 'Rhone',
    link: 'https://www.rhone.com/collections/sale',
    lastUpdated: '2025-02-05'
  },
  {
    id: 54,
    brand: 'Rhone',
    product: 'Delta Pique Polo',
    originalPrice: 88,
    salePrice: 61,
    discount: '31%',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop',
    retailer: 'Rhone',
    link: 'https://www.rhone.com/collections/sale',
    lastUpdated: '2025-02-05'
  },
  // Rolex
  {
    id: 55,
    brand: 'Rolex',
    product: 'Submariner Date',
    originalPrice: 10250,
    salePrice: 9225,
    discount: '10%',
    image: 'https://images.unsplash.com/photo-1587836374228-4c589c87e8f1?w=400&h=400&fit=crop',
    retailer: 'Chrono24',
    link: 'https://www.chrono24.com/rolex/submariner--mod45.htm',
    lastUpdated: '2025-02-05'
  },
  {
    id: 56,
    brand: 'Rolex',
    product: 'Datejust 41',
    originalPrice: 9150,
    salePrice: 8235,
    discount: '10%',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=400&fit=crop',
    retailer: 'Jomashop',
    link: 'https://www.jomashop.com/rolex-watches.html',
    lastUpdated: '2025-02-05'
  },
  // Samsung
  {
    id: 57,
    brand: 'Samsung',
    product: 'Galaxy S24 Ultra',
    originalPrice: 1299,
    salePrice: 1039,
    discount: '20%',
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop',
    retailer: 'Samsung',
    link: 'https://www.samsung.com/us/smartphones/galaxy-s24/',
    lastUpdated: '2025-02-05'
  },
  {
    id: 58,
    brand: 'Samsung',
    product: '65" Frame TV',
    originalPrice: 1999,
    salePrice: 1599,
    discount: '20%',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop',
    retailer: 'Best Buy',
    link: 'https://www.bestbuy.com/site/samsung-tvs/samsung-the-frame/pcmcat1516820995721.c',
    lastUpdated: '2025-02-05'
  },
  // Sony
  {
    id: 59,
    brand: 'Sony',
    product: 'WH-1000XM5 Headphones',
    originalPrice: 399,
    salePrice: 319,
    discount: '20%',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=400&fit=crop',
    retailer: 'Best Buy',
    link: 'https://www.bestbuy.com/site/sony-wh-1000xm5-wireless-noise-canceling-over-the-ear-headphones-black/6505727.p',
    lastUpdated: '2025-02-05'
  },
  {
    id: 60,
    brand: 'Sony',
    product: 'PlayStation 5',
    originalPrice: 499,
    salePrice: 449,
    discount: '10%',
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop',
    retailer: 'Amazon',
    link: 'https://www.amazon.com/s?k=playstation+5',
    lastUpdated: '2025-02-05'
  },
  // Sun Bum
  {
    id: 61,
    brand: 'Sun Bum',
    product: 'Original SPF 50 Sunscreen',
    originalPrice: 18,
    salePrice: 14,
    discount: '22%',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop',
    retailer: 'Target',
    link: 'https://www.target.com/s?searchTerm=sun+bum',
    lastUpdated: '2025-02-05'
  },
  {
    id: 62,
    brand: 'Sun Bum',
    product: 'Face Stick SPF 45',
    originalPrice: 12,
    salePrice: 9,
    discount: '25%',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop',
    retailer: 'Amazon',
    link: 'https://www.amazon.com/s?k=sun+bum',
    lastUpdated: '2025-02-05'
  },
  // Tag Heuer
  {
    id: 63,
    brand: 'Tag Heuer',
    product: 'Carrera Calibre 5',
    originalPrice: 3250,
    salePrice: 2925,
    discount: '10%',
    image: 'https://images.unsplash.com/photo-1587836374228-4c589c87e8f1?w=400&h=400&fit=crop',
    retailer: 'Jomashop',
    link: 'https://www.jomashop.com/tag-heuer-watches.html',
    lastUpdated: '2025-02-05'
  },
  {
    id: 64,
    brand: 'Tag Heuer',
    product: 'Aquaracer Professional 300',
    originalPrice: 3100,
    salePrice: 2790,
    discount: '10%',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=400&fit=crop',
    retailer: 'Chrono24',
    link: 'https://www.chrono24.com/tagheuer/index.htm',
    lastUpdated: '2025-02-05'
  },
  // The North Face
  {
    id: 65,
    brand: 'The North Face',
    product: 'Thermoball Eco Jacket',
    originalPrice: 199,
    salePrice: 139,
    discount: '30%',
    image: 'https://images.unsplash.com/photo-1544923408-75c5cef46f14?w=400&h=400&fit=crop',
    retailer: 'The North Face',
    link: 'https://www.thenorthface.com/en-us/sale',
    lastUpdated: '2025-02-05'
  },
  {
    id: 66,
    brand: 'The North Face',
    product: 'Borealis Backpack',
    originalPrice: 99,
    salePrice: 69,
    discount: '30%',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    retailer: 'Dick\'s Sporting Goods',
    link: 'https://www.dickssportinggoods.com/s/north+face',
    lastUpdated: '2025-02-05'
  },
  // TravisMatthew
  {
    id: 67,
    brand: 'TravisMatthew',
    product: 'The Zinna Performance Polo',
    originalPrice: 89,
    salePrice: 62,
    discount: '30%',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop',
    retailer: 'TravisMatthew',
    link: 'https://www.travismathew.com/sale/',
    lastUpdated: '2025-02-05'
  },
  {
    id: 68,
    brand: 'TravisMatthew',
    product: 'Beck Shorts',
    originalPrice: 79,
    salePrice: 55,
    discount: '30%',
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop',
    retailer: 'TravisMatthew',
    link: 'https://www.travismathew.com/sale/',
    lastUpdated: '2025-02-05'
  },
  // Tommy Bahama
  {
    id: 69,
    brand: 'Tommy Bahama',
    product: 'Catalina Twill Shirt',
    originalPrice: 128,
    salePrice: 89,
    discount: '30%',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop',
    retailer: 'Tommy Bahama',
    link: 'https://www.tommybahama.com/en/Sale',
    lastUpdated: '2025-02-05'
  },
  {
    id: 70,
    brand: 'Tommy Bahama',
    product: 'Baja Poolside Swim Trunk',
    originalPrice: 98,
    salePrice: 68,
    discount: '31%',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
    retailer: 'Nordstrom',
    link: 'https://www.nordstrom.com/brands/tommy-bahama--3862',
    lastUpdated: '2025-02-05'
  },
  // Tumi
  {
    id: 71,
    brand: 'Tumi',
    product: 'Alpha Bravo Backpack',
    originalPrice: 395,
    salePrice: 276,
    discount: '30%',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    retailer: 'Nordstrom',
    link: 'https://www.nordstrom.com/brands/tumi--2668',
    lastUpdated: '2025-02-05'
  },
  {
    id: 72,
    brand: 'Tumi',
    product: 'Continental Carry-On',
    originalPrice: 625,
    salePrice: 468,
    discount: '25%',
    image: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=400&h=400&fit=crop',
    retailer: 'Bloomingdales',
    link: 'https://www.bloomingdales.com/shop/tumi',
    lastUpdated: '2025-02-05'
  },
  // Ugg
  {
    id: 73,
    brand: 'Ugg',
    product: 'Classic Ultra Mini Boot',
    originalPrice: 170,
    salePrice: 119,
    discount: '30%',
    image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=400&h=400&fit=crop',
    retailer: 'Nordstrom',
    link: 'https://www.nordstrom.com/brands/ugg--2717',
    lastUpdated: '2025-02-05'
  },
  {
    id: 74,
    brand: 'Ugg',
    product: 'Tasman Slipper',
    originalPrice: 110,
    salePrice: 77,
    discount: '30%',
    image: 'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?w=400&h=400&fit=crop',
    retailer: 'Zappos',
    link: 'https://www.zappos.com/ugg',
    lastUpdated: '2025-02-05'
  },
  // Vera Wang
  {
    id: 75,
    brand: 'Vera Wang',
    product: 'Princess Eau de Toilette',
    originalPrice: 88,
    salePrice: 61,
    discount: '31%',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop',
    retailer: 'Macy\'s',
    link: 'https://www.macys.com/shop/makeup-and-perfume/vera-wang-fragrance',
    lastUpdated: '2025-02-05'
  },
  {
    id: 76,
    brand: 'Vera Wang',
    product: 'Wedding Dress Collection',
    originalPrice: 3500,
    salePrice: 2450,
    discount: '30%',
    image: 'https://images.unsplash.com/photo-1519657337289-077653f724ed?w=400&h=400&fit=crop',
    retailer: 'David\'s Bridal',
    link: 'https://www.davidsbridal.com/vera-wang-wedding-dresses',
    lastUpdated: '2025-02-05'
  },
  // Vineyard Vines
  {
    id: 77,
    brand: 'Vineyard Vines',
    product: 'Shep Shirt Quarter-Zip',
    originalPrice: 125,
    salePrice: 87,
    discount: '30%',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
    retailer: 'Vineyard Vines',
    link: 'https://www.vineyardvines.com/sale/',
    lastUpdated: '2025-02-05'
  },
  {
    id: 78,
    brand: 'Vineyard Vines',
    product: 'Breaker Pants',
    originalPrice: 98,
    salePrice: 68,
    discount: '31%',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop',
    retailer: 'Vineyard Vines',
    link: 'https://www.vineyardvines.com/sale/',
    lastUpdated: '2025-02-05'
  },
  // Vuori
  {
    id: 79,
    brand: 'Vuori',
    product: 'Strato Tech Tee',
    originalPrice: 64,
    salePrice: 44,
    discount: '31%',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    retailer: 'Vuori',
    link: 'https://vuoriclothing.com/collections/sale',
    lastUpdated: '2025-02-05'
  },
  {
    id: 80,
    brand: 'Vuori',
    product: 'Performance Jogger',
    originalPrice: 94,
    salePrice: 65,
    discount: '31%',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop',
    retailer: 'Nordstrom',
    link: 'https://www.nordstrom.com/brands/vuori--18103',
    lastUpdated: '2025-02-05'
  },
  // Yeti
  {
    id: 81,
    brand: 'Yeti',
    product: 'Tundra 45 Cooler',
    originalPrice: 325,
    salePrice: 259,
    discount: '20%',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=400&fit=crop',
    retailer: 'Amazon',
    link: 'https://www.amazon.com/s?k=yeti+tundra+45',
    lastUpdated: '2025-02-05'
  },
  {
    id: 82,
    brand: 'Yeti',
    product: 'Rambler 30oz Tumbler',
    originalPrice: 38,
    salePrice: 30,
    discount: '21%',
    image: 'https://images.unsplash.com/photo-1602143407946-726bfae97b0e?w=400&h=400&fit=crop',
    retailer: 'REI',
    link: 'https://www.rei.com/search?q=yeti+rambler',
    lastUpdated: '2025-02-05'
  },
  // Montblanc
  {
    id: 83,
    brand: 'Montblanc',
    product: 'Meisterstück Classique Pen',
    originalPrice: 540,
    salePrice: 432,
    discount: '20%',
    image: 'https://images.unsplash.com/photo-1592057761864-6fa8e98e9293?w=400&h=400&fit=crop',
    retailer: 'Montblanc',
    link: 'https://www.montblanc.com/en-us/writing-instruments.html',
    lastUpdated: '2025-02-05'
  },
  {
    id: 84,
    brand: 'Montblanc',
    product: 'Sartorial Leather Wallet',
    originalPrice: 390,
    salePrice: 312,
    discount: '20%',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop',
    retailer: 'Nordstrom',
    link: 'https://www.nordstrom.com/brands/montblanc--3053',
    lastUpdated: '2025-02-05'
  },
  // Madewell
  {
    id: 85,
    brand: 'Madewell',
    product: 'Perfect Vintage Jean',
    originalPrice: 138,
    salePrice: 96,
    discount: '30%',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
    retailer: 'Madewell',
    link: 'https://www.madewell.com/sale/',
    lastUpdated: '2025-02-05'
  },
  {
    id: 86,
    brand: 'Madewell',
    product: 'Ex-Boyfriend Shirt',
    originalPrice: 88,
    salePrice: 61,
    discount: '31%',
    image: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=400&h=400&fit=crop',
    retailer: 'Nordstrom',
    link: 'https://www.nordstrom.com/brands/madewell--6417',
    lastUpdated: '2025-02-05'
  },
  // J.Crew
  {
    id: 87,
    brand: 'J.Crew',
    product: '484 Slim-Fit Chino',
    originalPrice: 89,
    salePrice: 62,
    discount: '30%',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop',
    retailer: 'J.Crew',
    link: 'https://www.jcrew.com/r/sale',
    lastUpdated: '2025-02-05'
  },
  {
    id: 88,
    brand: 'J.Crew',
    product: 'Cotton-Cashmere Sweater',
    originalPrice: 128,
    salePrice: 89,
    discount: '30%',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
    retailer: 'J.Crew',
    link: 'https://www.jcrew.com/r/sale',
    lastUpdated: '2025-02-05'
  },
  // Spanx
  {
    id: 89,
    brand: 'Spanx',
    product: 'Faux Leather Leggings',
    originalPrice: 98,
    salePrice: 68,
    discount: '31%',
    image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&h=400&fit=crop',
    retailer: 'Nordstrom',
    link: 'https://www.nordstrom.com/brands/spanx--2617',
    lastUpdated: '2025-02-05'
  },
  {
    id: 90,
    brand: 'Spanx',
    product: 'AirEssentials High-Waisted Legging',
    originalPrice: 88,
    salePrice: 61,
    discount: '31%',
    image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&h=400&fit=crop',
    retailer: 'Spanx',
    link: 'https://spanx.com/collections/sale',
    lastUpdated: '2025-02-05'
  }
];

const SAMPLE_BRANDS = [
  { id: 1, name: 'Nike', category: 'Shoes' },
  { id: 2, name: 'Yeti', category: 'Coolers' },
  { id: 3, name: 'The North Face', category: 'Apparel' },
];

const RECOMMENDATIONS = [
  {
    id: 1,
    brand: 'Rolex',
    reason: 'Luxury timepiece enthusiast',
    product: 'Submariner Dive Watch',
    price: 9550,
    image: 'https://images.unsplash.com/photo-1587836374228-4c589c87e8f1?w=400&h=400&fit=crop',
    category: 'Watches'
  },
  {
    id: 2,
    brand: 'Burberry',
    reason: 'Luxury fashion lover',
    product: 'Classic Trench Coat',
    price: 1890,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop',
    category: 'Apparel'
  },
  {
    id: 3,
    brand: 'Apple',
    reason: 'Tech enthusiast',
    product: 'AirPods Max',
    price: 549,
    image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&h=400&fit=crop',
    category: 'Accessories'
  },
];

const BRAND_COLLECTIONS = [
  {
    id: 1,
    name: 'Luxury Essentials',
    description: 'Premium brands for the discerning shopper',
    brands: [
      { name: 'Burberry', category: 'Apparel' },
      { name: 'Tumi', category: 'Luggage' },
      { name: 'Rolex', category: 'Watches' },
      { name: 'Montblanc', category: 'Accessories' }
    ]
  },
  {
    id: 2,
    name: 'Athletic Performance',
    description: 'Top-tier brands for serious athletes',
    brands: [
      { name: 'Nike', category: 'Shoes' },
      { name: 'Adidas', category: 'Shoes' },
      { name: 'Alo', category: 'Apparel' },
      { name: 'Vuori', category: 'Apparel' },
      { name: 'On Running', category: 'Shoes' }
    ]
  },
  {
    id: 3,
    name: 'Outdoor Adventure',
    description: 'Gear for outdoor enthusiasts',
    brands: [
      { name: 'Yeti', category: 'Coolers' },
      { name: 'The North Face', category: 'Apparel' },
      { name: 'Columbia', category: 'Apparel' },
      { name: 'Costa', category: 'Accessories' }
    ]
  },
  {
    id: 4,
    name: 'Casual Comfort',
    description: 'Everyday brands for relaxed style',
    brands: [
      { name: 'Gap', category: 'Apparel' },
      { name: 'Abercrombie & Fitch', category: 'Apparel' },
      { name: 'Crocs', category: 'Shoes' },
      { name: 'Ugg', category: 'Shoes' },
      { name: 'Chubbies', category: 'Apparel' }
    ]
  },
  {
    id: 5,
    name: 'Tech & Innovation',
    description: 'Latest gadgets and electronics',
    brands: [
      { name: 'Apple', category: 'Accessories' },
      { name: 'Samsung', category: 'Accessories' },
      { name: 'Sony', category: 'Accessories' }
    ]
  },
  {
    id: 6,
    name: 'Southern Coastal',
    description: 'Preppy beach and resort style',
    brands: [
      { name: 'Vineyard Vines', category: 'Apparel' },
      { name: 'Tommy Bahama', category: 'Apparel' },
      { name: 'Chubbies', category: 'Apparel' },
      { name: 'Costa', category: 'Accessories' },
      { name: 'Yeti', category: 'Coolers' }
    ]
  }
];

const CATEGORIES = ['Apparel', 'Shoes', 'Luggage', 'Coolers', 'Accessories', 'Outdoor Gear', 'Watches'];

export default function BrandDealsApp() {
  // Load from localStorage or use defaults
  const [myBrands, setMyBrands] = useState(() => {
    const saved = localStorage.getItem('brandsnob_brands');
    return saved ? JSON.parse(saved) : SAMPLE_BRANDS;
  });
  
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('brandsnob_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [sizeProfile, setSizeProfile] = useState(() => {
    const saved = localStorage.getItem('brandsnob_sizeProfile');
    return saved ? JSON.parse(saved) : {
      shirt: '',
      pants: '',
      shoes: '',
      jacket: ''
    };
  });

  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandCategory, setNewBrandCategory] = useState('Apparel');
  const [activeTab, setActiveTab] = useState('deals');
  const [showAddBrand, setShowAddBrand] = useState(false);
  const [dealFilter, setDealFilter] = useState('all');
  const [dealSort, setDealSort] = useState('discount');
  const [showSizeProfile, setShowSizeProfile] = useState(false);
  const [showShareWishlist, setShowShareWishlist] = useState(false);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('brandsnob_brands', JSON.stringify(myBrands));
  }, [myBrands]);

  useEffect(() => {
    localStorage.setItem('brandsnob_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('brandsnob_sizeProfile', JSON.stringify(sizeProfile));
  }, [sizeProfile]);

  const addBrand = () => {
    if (newBrandName.trim()) {
      const newBrand = {
        id: Date.now(),
        name: newBrandName.trim(),
        category: newBrandCategory
      };
      setMyBrands([...myBrands, newBrand]);
      setNewBrandName('');
      setShowAddBrand(false);
    }
  };

  const removeBrand = (id) => {
    setMyBrands(myBrands.filter(b => b.id !== id));
  };

  const toggleWishlist = (deal) => {
    if (wishlist.some(item => item.id === deal.id)) {
      setWishlist(wishlist.filter(item => item.id !== deal.id));
    } else {
      setWishlist([...wishlist, deal]);
    }
  };

  const isInWishlist = (dealId) => {
    return wishlist.some(item => item.id === dealId);
  };

  const loadCollection = (collection) => {
    const newBrands = collection.brands.map(brand => ({
      id: Date.now() + Math.random(),
      name: brand.name,
      category: brand.category
    }));
    setMyBrands([...myBrands, ...newBrands]);
    setActiveTab('brands');
  };

  const updateSizeProfile = (field, value) => {
    setSizeProfile({ ...sizeProfile, [field]: value });
  };

  const exportBrands = () => {
    const data = JSON.stringify({
      brands: myBrands,
      wishlist: wishlist,
      sizeProfile: sizeProfile,
      exportDate: new Date().toISOString()
    }, null, 2);
    
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `brandsnob-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importBrands = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.brands) setMyBrands(data.brands);
          if (data.wishlist) setWishlist(data.wishlist);
          if (data.sizeProfile) setSizeProfile(data.sizeProfile);
          alert('Data imported successfully!');
        } catch (error) {
          alert('Error importing data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  let filteredDeals = REAL_DEALS.filter(deal => 
    myBrands.some(brand => brand.name.toLowerCase() === deal.brand.toLowerCase())
  );

  if (dealFilter !== 'all') {
    filteredDeals = filteredDeals.filter(deal => {
      const brand = myBrands.find(b => b.name.toLowerCase() === deal.brand.toLowerCase());
      return brand && brand.category === dealFilter;
    });
  }

  filteredDeals = [...filteredDeals].sort((a, b) => {
    switch(dealSort) {
      case 'discount':
        return parseInt(b.discount) - parseInt(a.discount);
      case 'price-low':
        return a.salePrice - b.salePrice;
      case 'price-high':
        return b.salePrice - a.salePrice;
      case 'savings':
        return (b.originalPrice - b.salePrice) - (a.originalPrice - a.salePrice);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Logo */}
              <div className="relative">
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="6" y="6" width="32" height="32" stroke="#1F2937" strokeWidth="2.5" fill="none" />
                  <path d="M 22 6 L 22 38" stroke="#1F2937" strokeWidth="2.5" />
                  <path d="M 6 22 L 38 22" stroke="#1F2937" strokeWidth="2.5" />
                  <circle cx="22" cy="22" r="6" stroke="#1F2937" strokeWidth="2.5" fill="white" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Brandsnobs</h1>
                <p className="text-xs text-gray-500">v1.5 • {REAL_DEALS.length} curated deals</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                {myBrands.length} brands tracked
              </div>
              <div className="flex gap-2">
                <button
                  onClick={exportBrands}
                  className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Export your data"
                >
                  <Download className="w-5 h-5" />
                </button>
                <label className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer" title="Import data">
                  <Upload className="w-5 h-5" />
                  <input type="file" accept=".json" onChange={importBrands} className="hidden" />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="flex gap-2 bg-white rounded-lg p-1 shadow-sm overflow-x-auto">
          <button
            onClick={() => setActiveTab('deals')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-all whitespace-nowrap ${
              activeTab === 'deals' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Tag className="w-4 h-4 inline mr-2" />
            Deals
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-all whitespace-nowrap ${
              activeTab === 'wishlist' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ShoppingBag className="w-4 h-4 inline mr-2" />
            Wishlist ({wishlist.length})
          </button>
          <button
            onClick={() => setActiveTab('brands')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-all whitespace-nowrap ${
              activeTab === 'brands' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ShoppingBag className="w-4 h-4 inline mr-2" />
            My Brands
          </button>
          <button
            onClick={() => setActiveTab('collections')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-all whitespace-nowrap ${
              activeTab === 'collections' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-2" />
            Collections
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-all whitespace-nowrap ${
              activeTab === 'recommendations' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-2" />
            Discover
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Deals Tab */}
        {activeTab === 'deals' && (
          <div>
            <div className="mb-6 flex justify-between items-start flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Current Deals</h2>
                <p className="text-gray-600">Real deals from your favorite brands • Click to shop!</p>
              </div>
              <button
                onClick={() => setShowSizeProfile(!showSizeProfile)}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                Size Profile
              </button>
            </div>

            {/* Size Profile Panel */}
            {showSizeProfile && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="font-semibold text-lg mb-4">My Size Profile</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Shirt Size</label>
                    <select
                      value={sizeProfile.shirt}
                      onChange={(e) => updateSizeProfile('shirt', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select</option>
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pants Size</label>
                    <input
                      type="text"
                      value={sizeProfile.pants}
                      onChange={(e) => updateSizeProfile('pants', e.target.value)}
                      placeholder="e.g., 32x32"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Shoe Size</label>
                    <input
                      type="text"
                      value={sizeProfile.shoes}
                      onChange={(e) => updateSizeProfile('shoes', e.target.value)}
                      placeholder="e.g., 10.5"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Jacket Size</label>
                    <select
                      value={sizeProfile.jacket}
                      onChange={(e) => updateSizeProfile('jacket', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select</option>
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                    </select>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-3">✓ Saved automatically</p>
              </div>
            )}

            {/* Filters and Sort */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
                  <select
                    value={dealFilter}
                    onChange={(e) => setDealFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={dealSort}
                    onChange={(e) => setDealSort(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="discount">Biggest Discount %</option>
                    <option value="savings">Most Savings $</option>
                    <option value="price-low">Lowest Price</option>
                    <option value="price-high">Highest Price</option>
                  </select>
                </div>
              </div>
            </div>
            
            {filteredDeals.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No deals found</h3>
                <p className="text-gray-500 mb-4">Add some brands to start seeing deals!</p>
                <button
                  onClick={() => setActiveTab('brands')}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Add Brands
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDeals.map(deal => (
                  <div key={deal.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="relative">
                      <img src={deal.image} alt={deal.product} className="w-full h-48 object-cover" />
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {deal.discount} OFF
                      </div>
                      <button
                        onClick={() => toggleWishlist(deal)}
                        className={`absolute top-2 left-2 p-2 rounded-full transition-colors ${
                          isInWishlist(deal.id) ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <span className="text-lg">{isInWishlist(deal.id) ? '❤️' : '🤍'}</span>
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="text-sm text-indigo-600 font-semibold mb-1">{deal.brand}</div>
                      <h3 className="font-bold text-lg text-gray-800 mb-2">{deal.product}</h3>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-2xl font-bold text-gray-800">${deal.salePrice}</span>
                        <span className="text-sm text-gray-500 line-through">${deal.originalPrice}</span>
                      </div>
                      <div className="text-sm text-green-600 font-medium mb-3">
                        Save ${deal.originalPrice - deal.salePrice}
                      </div>
                      <div className="text-sm text-gray-600 mb-3">at {deal.retailer}</div>
                      <a
                        href={deal.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 no-underline"
                      >
                        Shop Now
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Wishlist Tab */}
        {activeTab === 'wishlist' && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">My Wishlist</h2>
                <p className="text-gray-600">Items you're tracking • Saved automatically</p>
              </div>
              {wishlist.length > 0 && (
                <button
                  onClick={() => setShowShareWishlist(!showShareWishlist)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Share Wishlist
                </button>
              )}
            </div>

            {showShareWishlist && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="font-semibold text-lg mb-4">Share Your Wishlist</h3>
                <p className="text-gray-600 mb-4">Use the Export button in the header to download your wishlist and share with friends!</p>
                <button
                  onClick={() => setShowShareWishlist(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            )}

            {wishlist.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <span className="text-6xl mb-4 block">🤍</span>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Your wishlist is empty</h3>
                <p className="text-gray-500 mb-4">Click the heart icon on deals to save them here</p>
                <button
                  onClick={() => setActiveTab('deals')}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Browse Deals
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map(deal => (
                  <div key={deal.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="relative">
                      <img src={deal.image} alt={deal.product} className="w-full h-48 object-cover" />
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {deal.discount} OFF
                      </div>
                      <button
                        onClick={() => toggleWishlist(deal)}
                        className="absolute top-2 left-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <span className="text-lg">❤️</span>
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="text-sm text-indigo-600 font-semibold mb-1">{deal.brand}</div>
                      <h3 className="font-bold text-lg text-gray-800 mb-2">{deal.product}</h3>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-2xl font-bold text-gray-800">${deal.salePrice}</span>
                        <span className="text-sm text-gray-500 line-through">${deal.originalPrice}</span>
                      </div>
                      <div className="text-sm text-green-600 font-medium mb-3">
                        Save ${deal.originalPrice - deal.salePrice}
                      </div>
                      <div className="text-sm text-gray-600 mb-3">at {deal.retailer}</div>
                      <a
                        href={deal.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 no-underline"
                      >
                        Shop Now
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* My Brands Tab */}
        {activeTab === 'brands' && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">My Brands</h2>
                <p className="text-gray-600">Manage your favorite brands • Saved automatically</p>
              </div>
              <button
                onClick={() => setShowAddBrand(!showAddBrand)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Brand
              </button>
            </div>

            {showAddBrand && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="font-semibold text-lg mb-4">Add New Brand</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand Name</label>
                    <input
                      type="text"
                      value={newBrandName}
                      onChange={(e) => setNewBrandName(e.target.value)}
                      placeholder="e.g., Nike, Samsonite, RTIC"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && addBrand()}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={newBrandCategory}
                      onChange={(e) => setNewBrandCategory(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={addBrand}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Add Brand
                  </button>
                  <button
                    onClick={() => setShowAddBrand(false)}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {myBrands.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No brands added yet</h3>
                <p className="text-gray-500">Click "Add Brand" to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {CATEGORIES.map(category => {
                  const brandsInCategory = myBrands.filter(b => b.category === category);
                  if (brandsInCategory.length === 0) return null;
                  
                  return (
                    <div key={category} className="bg-white rounded-lg shadow-md p-6">
                      <h3 className="font-semibold text-lg text-gray-800 mb-4">{category}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {brandsInCategory.map(brand => (
                          <div
                            key={brand.id}
                            className="flex items-center justify-between bg-indigo-50 px-4 py-3 rounded-lg"
                          >
                            <span className="font-medium text-gray-800">{brand.name}</span>
                            <button
                              onClick={() => removeBrand(brand.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Brand Collections Tab */}
        {activeTab === 'collections' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Brand Collections</h2>
              <p className="text-gray-600">Curated brand lists for different lifestyles</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {BRAND_COLLECTIONS.map(collection => (
                <div key={collection.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{collection.name}</h3>
                    <p className="text-indigo-100">{collection.description}</p>
                  </div>
                  <div className="p-6">
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-700 mb-3">Included Brands:</h4>
                      <div className="space-y-2">
                        {collection.brands.map((brand, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                            <span className="font-medium text-gray-800">{brand.name}</span>
                            <span className="text-sm text-gray-500">{brand.category}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => loadCollection(collection)}
                      className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                    >
                      Add All to My Brands
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Discover New Brands</h2>
              <p className="text-gray-600">Based on your preferences for premium outdoor and travel gear</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {RECOMMENDATIONS.map(rec => (
                <div key={rec.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative">
                    <img src={rec.image} alt={rec.product} className="w-full h-48 object-cover" />
                    <div className="absolute top-2 left-2 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Recommended
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-sm text-indigo-600 font-semibold mb-1">{rec.brand}</div>
                    <div className="text-xs text-gray-500 mb-2">Because you like: {rec.reason}</div>
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{rec.product}</h3>
                    <div className="text-2xl font-bold text-gray-800 mb-3">${rec.price.toLocaleString()}</div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setMyBrands([...myBrands, {
                            id: Date.now(),
                            name: rec.brand,
                            category: rec.category
                          }]);
                          setActiveTab('brands');
                        }}
                        className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                      >
                        Add to My Brands
                      </button>
                      <button className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm">
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
