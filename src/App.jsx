import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, X, TrendingUp, Tag, ExternalLink, Download, Upload } from 'lucide-react';

// REAL CURATED DEALS - Updated regularly
const REAL_DEALS = [
  // Yeti Deals
  {
    id: 1,
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
    id: 2,
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
  {
    id: 3,
    brand: 'Yeti',
    product: 'Hopper Flip 12 Soft Cooler',
    originalPrice: 250,
    salePrice: 199,
    discount: '20%',
    image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&h=400&fit=crop',
    retailer: 'Dick\'s Sporting Goods',
    link: 'https://www.dickssportinggoods.com/s/yeti+hopper',
    lastUpdated: '2025-02-05'
  },
  // Patagonia Deals
  {
    id: 4,
    brand: 'Patagonia',
    product: 'Better Sweater Fleece Jacket',
    originalPrice: 139,
    salePrice: 97,
    discount: '30%',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
    retailer: 'Patagonia.com',
    link: 'https://www.patagonia.com/shop/web-specials',
    lastUpdated: '2025-02-05'
  },
  {
    id: 5,
    brand: 'Patagonia',
    product: 'Nano Puff Jacket',
    originalPrice: 249,
    salePrice: 174,
    discount: '30%',
    image: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=400&h=400&fit=crop',
    retailer: 'Backcountry',
    link: 'https://www.backcountry.com/patagonia-nano-puff-jacket',
    lastUpdated: '2025-02-05'
  },
  {
    id: 6,
    brand: 'Patagonia',
    product: 'Down Sweater Hoody',
    originalPrice: 279,
    salePrice: 195,
    discount: '30%',
    image: 'https://images.unsplash.com/photo-1614251055880-28a31e2addb6?w=400&h=400&fit=crop',
    retailer: 'REI',
    link: 'https://www.rei.com/b/patagonia/c/mens-clothing',
    lastUpdated: '2025-02-05'
  },
  // North Face Deals
  {
    id: 7,
    brand: 'North Face',
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
    id: 8,
    brand: 'North Face',
    product: 'Borealis Backpack',
    originalPrice: 99,
    salePrice: 69,
    discount: '30%',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    retailer: 'Dick\'s Sporting Goods',
    link: 'https://www.dickssportinggoods.com/s/north+face+backpack',
    lastUpdated: '2025-02-05'
  },
  {
    id: 9,
    brand: 'North Face',
    product: 'Recon Backpack',
    originalPrice: 119,
    salePrice: 95,
    discount: '20%',
    image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=400&h=400&fit=crop',
    retailer: 'Amazon',
    link: 'https://www.amazon.com/s?k=north+face+recon+backpack',
    lastUpdated: '2025-02-05'
  },
  // Nike Deals
  {
    id: 10,
    brand: 'Nike',
    product: 'Air Max 270',
    originalPrice: 150,
    salePrice: 99,
    discount: '34%',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    retailer: 'Nike.com',
    link: 'https://www.nike.com/w/sale-3yaep',
    lastUpdated: '2025-02-05'
  },
  {
    id: 11,
    brand: 'Nike',
    product: 'React Infinity Run',
    originalPrice: 160,
    salePrice: 112,
    discount: '30%',
    image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400&h=400&fit=crop',
    retailer: 'Finish Line',
    link: 'https://www.finishline.com/store/men/nike',
    lastUpdated: '2025-02-05'
  },
  {
    id: 12,
    brand: 'Nike',
    product: 'Dri-FIT Training Shirt',
    originalPrice: 35,
    salePrice: 24,
    discount: '31%',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    retailer: 'Dick\'s Sporting Goods',
    link: 'https://www.dickssportinggoods.com/s/nike+dri+fit',
    lastUpdated: '2025-02-05'
  },
  // Arc'teryx Deals
  {
    id: 13,
    brand: 'Arc\'teryx',
    product: 'Atom LT Hoody',
    originalPrice: 299,
    salePrice: 224,
    discount: '25%',
    image: 'https://images.unsplash.com/photo-1606932832374-acd3b48ede08?w=400&h=400&fit=crop',
    retailer: 'Backcountry',
    link: 'https://www.backcountry.com/arcteryx-atom-lt-hoody',
    lastUpdated: '2025-02-05'
  },
  {
    id: 14,
    brand: 'Arc\'teryx',
    product: 'Beta AR Jacket',
    originalPrice: 575,
    salePrice: 431,
    discount: '25%',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
    retailer: 'REI',
    link: 'https://www.rei.com/b/arcteryx',
    lastUpdated: '2025-02-05'
  },
  // Lululemon Deals
  {
    id: 15,
    brand: 'Lululemon',
    product: 'Align High-Rise Pant 25"',
    originalPrice: 98,
    salePrice: 69,
    discount: '30%',
    image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&h=400&fit=crop',
    retailer: 'Lululemon',
    link: 'https://shop.lululemon.com/c/women-we-made-too-much/_/N-8s6',
    lastUpdated: '2025-02-05'
  },
  {
    id: 16,
    brand: 'Lululemon',
    product: 'Metal Vent Tech Short Sleeve',
    originalPrice: 68,
    salePrice: 49,
    discount: '28%',
    image: 'https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?w=400&h=400&fit=crop',
    retailer: 'Lululemon',
    link: 'https://shop.lululemon.com/c/men-we-made-too-much/_/N-8a7',
    lastUpdated: '2025-02-05'
  },
  // Tumi Deals
  {
    id: 17,
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
    id: 18,
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
  // Samsonite Deals
  {
    id: 19,
    brand: 'Samsonite',
    product: 'Omni PC Hardside Spinner',
    originalPrice: 180,
    salePrice: 108,
    discount: '40%',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop',
    retailer: 'Amazon',
    link: 'https://www.amazon.com/s?k=samsonite+omni',
    lastUpdated: '2025-02-05'
  },
  {
    id: 20,
    brand: 'Samsonite',
    product: 'Centric Hardside Expandable',
    originalPrice: 150,
    salePrice: 97,
    discount: '35%',
    image: 'https://images.unsplash.com/photo-1546135954-c7e30d1e2769?w=400&h=400&fit=crop',
    retailer: 'Target',
    link: 'https://www.target.com/s?searchTerm=samsonite',
    lastUpdated: '2025-02-05'
  },
  // On Running Deals
  {
    id: 21,
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
    id: 22,
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
  // Hoka Deals
  {
    id: 23,
    brand: 'Hoka',
    product: 'Clifton 9',
    originalPrice: 145,
    salePrice: 108,
    discount: '26%',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop',
    retailer: 'Hoka.com',
    link: 'https://www.hoka.com/en/us/sale/',
    lastUpdated: '2025-02-05'
  },
  {
    id: 24,
    brand: 'Hoka',
    product: 'Bondi 8',
    originalPrice: 165,
    salePrice: 132,
    discount: '20%',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=400&h=400&fit=crop',
    retailer: 'Road Runner Sports',
    link: 'https://www.roadrunnersports.com/hoka',
    lastUpdated: '2025-02-05'
  },
  // Allbirds Deals
  {
    id: 25,
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
    id: 26,
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
  // RTIC Deals
  {
    id: 27,
    brand: 'RTIC',
    product: '45 QT Ultra-Light Cooler',
    originalPrice: 200,
    salePrice: 160,
    discount: '20%',
    image: 'https://images.unsplash.com/photo-1530359728-fa4eb28247f8?w=400&h=400&fit=crop',
    retailer: 'RTIC',
    link: 'https://www.rticoutdoors.com/45-QT-Ultra-Light',
    lastUpdated: '2025-02-05'
  },
  {
    id: 28,
    brand: 'RTIC',
    product: '30 oz Tumbler',
    originalPrice: 30,
    salePrice: 22,
    discount: '27%',
    image: 'https://images.unsplash.com/photo-1585828793331-c04ac01c2e2a?w=400&h=400&fit=crop',
    retailer: 'RTIC',
    link: 'https://www.rticoutdoors.com/30-oz-Tumbler',
    lastUpdated: '2025-02-05'
  },
  // Oakley Deals
  {
    id: 29,
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
    id: 30,
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
  // Ray-Ban Deals
  {
    id: 31,
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
    id: 32,
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
  // Brooks Brothers Deals
  {
    id: 33,
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
    id: 34,
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
  // Cole Haan Deals
  {
    id: 35,
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
    id: 36,
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
  // Uniqlo Deals
  {
    id: 37,
    brand: 'Uniqlo',
    product: 'Ultra Light Down Jacket',
    originalPrice: 70,
    salePrice: 49,
    discount: '30%',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop',
    retailer: 'Uniqlo',
    link: 'https://www.uniqlo.com/us/en/sale',
    lastUpdated: '2025-02-05'
  },
  {
    id: 38,
    brand: 'Uniqlo',
    product: 'Heattech Turtleneck',
    originalPrice: 30,
    salePrice: 19,
    discount: '37%',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop',
    retailer: 'Uniqlo',
    link: 'https://www.uniqlo.com/us/en/sale',
    lastUpdated: '2025-02-05'
  },
  // Away Deals
  {
    id: 39,
    brand: 'Away',
    product: 'The Carry-On',
    originalPrice: 275,
    salePrice: 220,
    discount: '20%',
    image: 'https://images.unsplash.com/photo-1548613053-22087dd8edb8?w=400&h=400&fit=crop',
    retailer: 'Away',
    link: 'https://www.awaytravel.com/travel-bags',
    lastUpdated: '2025-02-05'
  },
  {
    id: 40,
    brand: 'Away',
    product: 'The Bigger Carry-On',
    originalPrice: 295,
    salePrice: 236,
    discount: '20%',
    image: 'https://images.unsplash.com/photo-1591299519460-e55e6e4acd6e?w=400&h=400&fit=crop',
    retailer: 'Away',
    link: 'https://www.awaytravel.com/travel-bags',
    lastUpdated: '2025-02-05'
  },
  // Rimowa Deals
  {
    id: 41,
    brand: 'Rimowa',
    product: 'Original Cabin S',
    originalPrice: 1050,
    salePrice: 892,
    discount: '15%',
    image: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=400&h=400&fit=crop',
    retailer: 'Nordstrom',
    link: 'https://www.nordstrom.com/brands/rimowa--3534',
    lastUpdated: '2025-02-05'
  },
  {
    id: 42,
    brand: 'Rimowa',
    product: 'Essential Check-In L',
    originalPrice: 750,
    salePrice: 637,
    discount: '15%',
    image: 'https://images.unsplash.com/photo-1591293785975-c4c23c9d2e97?w=400&h=400&fit=crop',
    retailer: 'Bloomingdales',
    link: 'https://www.bloomingdales.com/shop/rimowa',
    lastUpdated: '2025-02-05'
  },
  // Therabody Deals
  {
    id: 43,
    brand: 'Therabody',
    product: 'Theragun Prime',
    originalPrice: 299,
    salePrice: 224,
    discount: '25%',
    image: 'https://images.unsplash.com/photo-1606889464198-fcb18894cf50?w=400&h=400&fit=crop',
    retailer: 'Therabody',
    link: 'https://www.therabody.com/us/en-us/sale.html',
    lastUpdated: '2025-02-05'
  },
  {
    id: 44,
    brand: 'Therabody',
    product: 'RecoveryAir Jet Boots',
    originalPrice: 399,
    salePrice: 319,
    discount: '20%',
    image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&h=400&fit=crop',
    retailer: 'Best Buy',
    link: 'https://www.bestbuy.com/site/searchpage.jsp?st=therabody',
    lastUpdated: '2025-02-05'
  },
  // Montblanc Deals
  {
    id: 45,
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
    id: 46,
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
  // Bellroy Deals
  {
    id: 47,
    brand: 'Bellroy',
    product: 'Slim Sleeve Wallet',
    originalPrice: 89,
    salePrice: 71,
    discount: '20%',
    image: 'https://images.unsplash.com/photo-1624823183493-ed5832f48f18?w=400&h=400&fit=crop',
    retailer: 'Bellroy',
    link: 'https://bellroy.com/collections/wallets',
    lastUpdated: '2025-02-05'
  },
  {
    id: 48,
    brand: 'Bellroy',
    product: 'Tokyo Totepack',
    originalPrice: 179,
    salePrice: 143,
    discount: '20%',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop',
    retailer: 'Bellroy',
    link: 'https://bellroy.com/collections/bags',
    lastUpdated: '2025-02-05'
  },
  // Ted Baker Deals
  {
    id: 49,
    brand: 'Ted Baker',
    product: 'Slim Fit Suit Jacket',
    originalPrice: 595,
    salePrice: 357,
    discount: '40%',
    image: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=400&h=400&fit=crop',
    retailer: 'Nordstrom',
    link: 'https://www.nordstrom.com/brands/ted-baker-london--3779',
    lastUpdated: '2025-02-05'
  },
  {
    id: 50,
    brand: 'Ted Baker',
    product: 'Oxford Dress Shirt',
    originalPrice: 135,
    salePrice: 81,
    discount: '40%',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop',
    retailer: 'Bloomingdales',
    link: 'https://www.bloomingdales.com/shop/ted-baker',
    lastUpdated: '2025-02-05'
  }
];

const SAMPLE_BRANDS = [
  { id: 1, name: 'Yeti', category: 'Coolers' },
  { id: 2, name: 'Patagonia', category: 'Apparel' },
  { id: 3, name: 'North Face', category: 'Apparel' },
];

const RECOMMENDATIONS = [
  {
    id: 1,
    brand: 'Rolex',
    reason: 'Luxury outdoor enthusiast',
    product: 'Submariner Dive Watch',
    price: 9550,
    image: 'https://images.unsplash.com/photo-1587836374228-4c589c87e8f1?w=400&h=400&fit=crop',
    category: 'Watches'
  },
  {
    id: 2,
    brand: 'Arc\'teryx',
    reason: 'Premium outdoor gear',
    product: 'Alpha SV Jacket',
    price: 825,
    image: 'https://images.unsplash.com/photo-1606932832374-acd3b48ede08?w=400&h=400&fit=crop',
    category: 'Apparel'
  },
  {
    id: 3,
    brand: 'Rimowa',
    reason: 'Premium travel gear',
    product: 'Original Cabin Luggage',
    price: 1050,
    image: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=400&h=400&fit=crop',
    category: 'Luggage'
  },
];

const BRAND_COLLECTIONS = [
  {
    id: 1,
    name: 'Luxury Outdoor Enthusiast',
    description: 'Premium brands for the discerning adventurer',
    brands: [
      { name: 'Yeti', category: 'Coolers' },
      { name: 'Patagonia', category: 'Apparel' },
      { name: 'Arc\'teryx', category: 'Apparel' },
      { name: 'Hoka', category: 'Shoes' }
    ]
  },
  {
    id: 2,
    name: 'Minimalist Traveler',
    description: 'Sleek, functional brands for modern nomads',
    brands: [
      { name: 'Rimowa', category: 'Luggage' },
      { name: 'Away', category: 'Luggage' },
      { name: 'Uniqlo', category: 'Apparel' },
      { name: 'Allbirds', category: 'Shoes' },
      { name: 'Bellroy', category: 'Accessories' }
    ]
  },
  {
    id: 3,
    name: 'Athletic Elite',
    description: 'Top-tier performance brands for serious athletes',
    brands: [
      { name: 'Lululemon', category: 'Apparel' },
      { name: 'Nike', category: 'Shoes' },
      { name: 'On Running', category: 'Shoes' },
      { name: 'Therabody', category: 'Accessories' },
      { name: 'Oakley', category: 'Accessories' }
    ]
  },
  {
    id: 4,
    name: 'Urban Professional',
    description: 'Sophisticated brands for the modern professional',
    brands: [
      { name: 'Tumi', category: 'Luggage' },
      { name: 'Brooks Brothers', category: 'Apparel' },
      { name: 'Cole Haan', category: 'Shoes' },
      { name: 'Montblanc', category: 'Accessories' },
      { name: 'Ted Baker', category: 'Apparel' }
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
                <h1 className="text-3xl font-bold text-gray-800">BrandSnob</h1>
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
