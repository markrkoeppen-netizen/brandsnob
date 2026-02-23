import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, X, TrendingUp, Tag, ExternalLink, Download, Upload, LogIn, LogOut, User, Cloud, CloudOff, RefreshCw, Heart, Check, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { auth, googleProvider, db } from './firebase';
import { signInWithPopup, signInWithRedirect, getRedirectResult, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import emailjs from '@emailjs/browser';

// Initialize EmailJS with your public key
emailjs.init('QPiBFFlW7aGv6W0UP');

const CATEGORIES = [
  'Fashion', 'Footwear', 'Accessories', 'Tech', 'Home', 'Outdoor', 
  'Watches', 'Cosmetics', 'Jewelry', 'Travel'
];

const GENDER_OPTIONS = [
  { id: 'women', label: "Women's", icon: '👗' },
  { id: 'men', label: "Men's", icon: '👔' },
  { id: 'girls', label: "Girls'", icon: '🎀' },
  { id: 'boys', label: "Boys'", icon: '⚽' },
  { id: 'unisex', label: 'Unisex', icon: '✨' }
];

const BRAND_COLLECTIONS = [
  {
    id: 1,
    name: 'Luxury Fashion Icons',
    description: 'The most prestigious names in high fashion',
    brands: [
      { name: 'Gucci', category: 'Fashion' },
      { name: 'Prada', category: 'Fashion' },
      { name: 'Louis Vuitton', category: 'Fashion' },
      { name: 'Hermès', category: 'Fashion' },
      { name: 'Goyard', category: 'Accessories' },
      { name: 'Fendi', category: 'Fashion' },
      { name: 'Saint Laurent', category: 'Fashion' },
      { name: 'Chloé', category: 'Fashion' },
      { name: 'The Row', category: 'Fashion' },
      { name: 'Burberry', category: 'Fashion' },
      { name: 'Dolce & Gabbana', category: 'Fashion' }
    ]
  },
  {
    id: 2,
    name: 'Designer Shoes & Accessories',
    description: 'Premium footwear and luxury accessories',
    brands: [
      { name: 'Christian Louboutin', category: 'Footwear' },
      { name: 'Jimmy Choo', category: 'Footwear' },
      { name: 'Stuart Weitzman', category: 'Footwear' },
      { name: 'Cole Haan', category: 'Footwear' },
      { name: 'Feragamo', category: 'Footwear' },
      { name: 'Lucchese', category: 'Footwear' },
      { name: 'Tumi', category: 'Accessories' },
      { name: 'Coach', category: 'Accessories' }
    ]
  },
  {
    id: 3,
    name: 'Athletic & Athleisure',
    description: 'Performance meets style',
    brands: [
      { name: 'Nike', category: 'Footwear' },
      { name: 'Adidas', category: 'Footwear' },
      { name: 'Lululemon', category: 'Fashion' },
      { name: 'Alo', category: 'Fashion' },
      { name: 'Vuori', category: 'Fashion' },
      { name: 'On Running', category: 'Footwear' },
      { name: 'Athleta', category: 'Fashion' },
      { name: 'Under Armour', category: 'Fashion' },
      { name: 'YoungLA', category: 'Fashion' }
    ]
  },
  {
    id: 4,
    name: 'Contemporary American',
    description: 'Modern American designers and lifestyle brands',
    brands: [
      { name: 'Donna Karan', category: 'Fashion' },
      { name: 'Free People', category: 'Fashion' },
      { name: 'Kate Spade', category: 'Accessories' },
      { name: 'Marc Jacobs', category: 'Fashion' },
      { name: 'Michael Kors', category: 'Fashion' },
      { name: 'Oscar de la Renta', category: 'Fashion' },
      { name: 'Spanx', category: 'Fashion' },
      { name: 'Tom Ford', category: 'Fashion' },
      { name: 'Tory Burch', category: 'Fashion' },
      { name: 'Trendia', category: 'Fashion' },
      { name: 'Vera Wang', category: 'Fashion' }
    ]
  },
  {
    id: 5,
    name: 'Casual & Lifestyle',
    description: 'Everyday luxury and comfort',
    brands: [
      { name: 'Abercrombie & Fitch', category: 'Fashion' },
      { name: 'American Giant', category: 'Fashion' },
      { name: 'Brooks Brothers', category: 'Fashion' },
      { name: 'Carhartt', category: 'Fashion' },
      { name: 'Chubbies', category: 'Fashion' },
      { name: 'Everlane', category: 'Fashion' },
      { name: 'Kith', category: 'Fashion' },
      { name: 'Lacoste', category: 'Fashion' },
      { name: 'Levi Strauss', category: 'Fashion' },
      { name: 'Madewell', category: 'Fashion' },
      { name: 'Peter Millar', category: 'Fashion' },
      { name: 'Polo Ralph Lauren', category: 'Fashion' },
      { name: 'Rhone', category: 'Fashion' },
      { name: 'Tommy Bahama', category: 'Fashion' },
      { name: 'TravisMatthew', category: 'Fashion' },
      { name: 'Vineyard Vines', category: 'Fashion' },
      { name: 'Wrangler', category: 'Fashion' }
    ]
  },
  {
    id: 6,
    name: 'Footwear & Comfort',
    description: 'Comfort meets style',
    brands: [
      { name: 'Allbirds', category: 'Footwear' },
      { name: 'BIRKENSTOCK', category: 'Footwear' },
      { name: 'Bombas', category: 'Accessories' },
      { name: 'Crocs', category: 'Footwear' },
      { name: 'Havaianas', category: 'Footwear' },
      { name: 'OluKai', category: 'Footwear' },
      { name: 'OOFOS', category: 'Footwear' },
      { name: 'Reef', category: 'Footwear' },
      { name: 'Sanuk', category: 'Footwear' },
      { name: 'Teva', category: 'Footwear' },
      { name: 'UGG', category: 'Footwear' }
    ]
  },
  {
    id: 7,
    name: 'Accessories & Jewelry',
    description: 'Premium sunglasses, jewelry, and accessories',
    brands: [
      { name: 'Costa', category: 'Accessories' },
      { name: 'Gorjana', category: 'Jewelry' },
      { name: 'Kendra Scott', category: 'Jewelry' },
      { name: 'Oakley', category: 'Accessories' },
      { name: 'Ray-Ban', category: 'Accessories' }
    ]
  },
  {
    id: 8,
    name: 'Outdoor & Technical',
    description: 'Performance gear for adventure',
    brands: [
      { name: 'The North Face', category: 'Outdoor' },
      { name: 'Columbia', category: 'Outdoor' },
      { name: 'Yeti', category: 'Outdoor' }
    ]
  },
  {
    id: 9,
    name: 'Western & Country',
    description: 'Western wear and country lifestyle',
    brands: [
      { name: 'Ariat', category: 'Footwear' },
      { name: 'Cinch', category: 'Fashion' },
      { name: 'Cruel Girl', category: 'Fashion' },
      { name: 'Justin Boots', category: 'Footwear' },
      { name: 'Panhandle Slim', category: 'Fashion' },
      { name: 'Stetson', category: 'Accessories' },
      { name: 'Tony Lama', category: 'Footwear' }
    ]
  },
  {
    id: 10,
    name: 'Avant-Garde & Modern',
    description: 'Cutting-edge contemporary fashion',
    brands: [
      { name: 'Thom Browne', category: 'Fashion' },
      { name: 'Cult Gaia', category: 'Accessories' },
      { name: 'Burlebo', category: 'Fashion' },
      { name: 'Poncho Outdoors', category: 'Fashion' }
    ]
  },
  {
    id: 11,
    name: 'Beauty & Home',
    description: 'Luxury beauty and home essentials',
    brands: [
      { name: 'Estée Lauder', category: 'Cosmetics' },
      { name: 'Lush', category: 'Cosmetics' },
      { name: 'Dacor', category: 'Home' }
    ]
  }
];

const RECOMMENDATIONS = [
  {
    id: 1,
    brand: 'Gucci',
    reason: 'Luxury fashion lover',
    product: 'GG Marmont Handbag',
    price: 2350,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop',
    category: 'Fashion'
  },
  {
    id: 2,
    brand: 'Christian Louboutin',
    reason: 'Designer shoe collector',
    product: 'Pigalle Follies Pumps',
    price: 775,
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop',
    category: 'Footwear'
  },
  {
    id: 3,
    brand: 'Lululemon',
    reason: 'Athleisure enthusiast',
    product: 'Align High-Rise Leggings',
    price: 98,
    image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&h=400&fit=crop',
    category: 'Fashion'
  },
  {
    id: 4,
    brand: 'Tory Burch',
    reason: 'Contemporary style lover',
    product: 'Miller Sandals',
    price: 228,
    image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&h=400&fit=crop',
    category: 'Footwear'
  },
  {
    id: 5,
    brand: 'The North Face',
    reason: 'Outdoor adventurer',
    product: 'Nuptse Puffer Jacket',
    price: 329,
    image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400&h=400&fit=crop',
    category: 'Outdoor'
  }
];

// All available brands for autocomplete
const ALL_AVAILABLE_BRANDS = [
  'Abercrombie & Fitch', 'Adidas', 'Allbirds', 'Alo', 'Ariat', 'Athleta', 'BIRKENSTOCK',
  'Bombas', 'Brooks Brothers', 'Burberry', 'Burlebo', 'Carhartt', 'Chloé', 'Christian Louboutin',
  'Chubbies', 'Cinch', 'Coach', 'Cole Haan', 'Columbia', 'Costa', 'Crocs', 'Cruel Girl', 'Cult Gaia',
  'Dacor', 'Dolce & Gabbana', 'Donna Karan', 'Estée Lauder', 'Fendi', 'Feragamo',
  'Gucci', 'Havaianas', 'Hermès', 'Jimmy Choo', 'Justin Boots', 'Kate Spade', 'Kendra Scott', 'Kith', 'Lacoste',
  'Levi Strauss', 'Louis Vuitton', 'Lucchese', 'Lululemon', 'Lush', 'Madewell', 'Marc Jacobs',
  'Michael Kors', 'Nike', 'Oakley', 'OluKai', 'On Running', 'OOFOS', 'Oscar de la Renta', 'Panhandle Slim', 'Polo Ralph Lauren',
  'Poncho Outdoors', 'Prada', 'Ray-Ban', 'Reef', 'Rhone', 'Saint Laurent', 'Sanuk', 'Stetson', 'Stuart Weitzman',
  'Teva', 'The North Face', 'The Row', 'Thom Browne', 'Tom Ford', 'Tommy Bahama', 'Tony Lama',
  'Tory Burch', 'TravisMatthew', 'Tumi', 'UGG', 'Under Armour', 'Vera Wang',
  'Vineyard Vines', 'Vuori', 'Wrangler', 'Yeti', 'YoungLA'
];

function LuxuryDealCard({ deal, onAddToBag }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [addedToBag, setAddedToBag] = useState(false);

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  const handleAddToBag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToBag(deal);
    setAddedToBag(true);
    setTimeout(() => setAddedToBag(false), 2000); // Reset after 2s
  };

  const discountPercent = parseInt(deal.discount);
  const savings = deal.originalPrice - deal.salePrice;

  return (
    <a
      href={deal.link}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group block bg-white rounded-xl md:rounded-2xl overflow-hidden border border-neutral-200 hover:border-neutral-300 transition-all duration-300 hover:shadow-luxury"
    >
      <div className="relative aspect-square overflow-hidden bg-neutral-50">
        <img
          src={deal.image}
          alt={deal.product}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {discountPercent >= 30 && (
          <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-neutral-900 text-white px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-semibold tracking-wide">
            {deal.discount} OFF
          </div>
        )}

        {deal.sizeMatchScore && deal.sizeMatchScore > 0 && (
          <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 bg-green-600 text-white px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-semibold tracking-wide flex items-center gap-1">
            <Check className="w-3 h-3 md:w-4 md:h-4" />
            Your Size
          </div>
        )}

        <button
          onClick={handleFavorite}
          className={`absolute top-2 right-2 md:top-4 md:right-4 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:bg-white hover:scale-110 ${isFavorited ? 'text-rose-500' : 'text-neutral-400'}`}
        >
          <Heart className="w-4 h-4 md:w-5 md:h-5" fill={isFavorited ? 'currentColor' : 'none'} />
        </button>

        <div className={`absolute inset-0 bg-neutral-900/80 backdrop-blur-sm items-center justify-center transition-opacity duration-300 hidden md:flex ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="bg-white px-6 py-3 rounded-full flex items-center gap-2 text-neutral-900 font-medium">
            <span>View Deal</span>
            <ExternalLink className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="p-3 md:p-5">
        <div className="flex items-center justify-between mb-1 md:mb-2">
          <span className="text-xs font-medium tracking-widest uppercase text-neutral-500">
            {deal.brand}
          </span>
          <span className="text-xs text-neutral-400 hidden md:block">
            {deal.retailer}
          </span>
        </div>

        <h3 className="font-display text-sm md:text-lg font-medium text-neutral-900 mb-2 md:mb-3 line-clamp-2 leading-snug min-h-[2.5rem] md:min-h-[3.5rem]">
          {deal.product}
        </h3>

        <div className="flex items-end justify-between mb-2 md:mb-3">
          <div>
            <div className="flex items-baseline gap-1 md:gap-2">
              <span className="font-display text-lg md:text-2xl font-semibold text-neutral-900">
                ${deal.salePrice}
              </span>
              {deal.originalPrice > deal.salePrice && (
                <span className="text-xs md:text-sm text-neutral-400 line-through">
                  ${deal.originalPrice}
                </span>
              )}
            </div>
            {savings > 0 && (
              <p className="text-xs text-neutral-500 mt-0.5 md:mt-1 hidden md:block">
                Save ${savings.toFixed(2)}
              </p>
            )}
          </div>

          {discountPercent < 30 && discountPercent > 0 && (
            <div className="bg-neutral-100 text-neutral-700 px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg text-xs font-semibold">
              {deal.discount}
            </div>
          )}
        </div>

        {/* Add to Bag Button */}
        <button
          onClick={handleAddToBag}
          className={`mt-3 w-full py-2 rounded-lg font-medium text-sm transition-all ${
            addedToBag 
              ? 'bg-green-600 text-white' 
              : 'bg-neutral-900 text-white hover:bg-neutral-800'
          }`}
        >
          {addedToBag ? (
            <span className="flex items-center justify-center gap-2">
              <Check className="w-4 h-4" />
              Added to Bag
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Add to Bag
            </span>
          )}
        </button>
      </div>
    </a>
  );
}

function GenderPreference({ selectedGenders, onGenderChange }) {
  const toggleGender = (genderId) => {
    const newSelection = selectedGenders.includes(genderId)
      ? selectedGenders.filter(g => g !== genderId)
      : [...selectedGenders, genderId];
    onGenderChange(newSelection);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-3 md:p-5 mb-4 md:mb-6">
      <div className="flex items-center gap-2 mb-3">
        <User className="w-4 h-4 text-neutral-500" />
        <span className="text-sm font-medium text-neutral-700">Shopping For</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {GENDER_OPTIONS.map((option) => {
          const isSelected = selectedGenders.includes(option.id);
          return (
            <button
              key={option.id}
              onClick={() => toggleGender(option.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition-all ${
                isSelected
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-neutral-300 bg-white text-neutral-600 hover:border-neutral-400'
              }`}
            >
              <span className="text-base">{option.icon}</span>
              <span>{option.label}</span>
              {isSelected && <Check className="w-3 h-3" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Shopping Bag Modal
function ShoppingBagModal({ bag, onClose, onRemove, onCheckout, onClear, shippingProfile }) {
  const totalItems = bag.length;
  const totalValue = bag.reduce((sum, item) => sum + item.salePrice, 0);
  const totalSavings = bag.reduce((sum, item) => sum + (item.originalPrice - item.salePrice), 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-neutral-900">Shopping Bag</h2>
            <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-sm text-neutral-600">
            {totalItems} item{totalItems !== 1 ? 's' : ''} • ${totalValue.toFixed(2)} total
          </p>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6">
          {bag.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500">Your bag is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bag.map(item => (
                <div key={item.id} className="flex gap-4 bg-neutral-50 rounded-xl p-4">
                  <img 
                    src={item.image} 
                    alt={item.product}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-neutral-500 mb-1">{item.brand}</p>
                    <h3 className="font-medium text-neutral-900 line-clamp-2 text-sm mb-2">
                      {item.product}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-neutral-900">${item.salePrice}</span>
                      {item.originalPrice > item.salePrice && (
                        <>
                          <span className="text-xs text-neutral-400 line-through">${item.originalPrice}</span>
                          <span className="text-xs text-green-600 font-medium">{item.discount} off</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">{item.retailer}</p>
                  </div>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Shipping Helper */}
        {bag.length > 0 && shippingProfile.firstName && (
          <div className="p-6 bg-neutral-50 border-t border-neutral-200">
            <p className="text-sm font-medium text-neutral-700 mb-2">📦 Your Shipping Info (copy for checkout):</p>
            <div className="bg-white rounded-lg p-3 text-xs text-neutral-600 font-mono">
              {shippingProfile.firstName} {shippingProfile.lastName}<br />
              {shippingProfile.address}<br />
              {shippingProfile.city}, {shippingProfile.state} {shippingProfile.zip}<br />
              {shippingProfile.email} • {shippingProfile.phone}
            </div>
          </div>
        )}

        {/* Footer */}
        {bag.length > 0 && (
          <div className="p-6 border-t border-neutral-200">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800 font-medium mb-2">💡 Quick Checkout Tips:</p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Each item will open in a new tab</li>
                <li>• Click "Add to Cart" on each product page</li>
                <li>• Complete checkout on each retailer's site</li>
                <li>• Your shipping info is copied above for easy pasting!</li>
              </ul>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-neutral-600">Total Value</p>
                <p className="text-2xl font-bold text-neutral-900">${totalValue.toFixed(2)}</p>
                {totalSavings > 0 && (
                  <p className="text-sm text-green-600">Save ${totalSavings.toFixed(2)}</p>
                )}
              </div>
              <button
                onClick={onClear}
                className="text-sm text-neutral-500 hover:text-neutral-700"
              >
                Clear All
              </button>
            </div>
            <button
              onClick={onCheckout}
              className="w-full bg-neutral-900 text-white py-3 rounded-lg hover:bg-neutral-800 transition-colors font-medium"
            >
              Open All Items ({totalItems} item{totalItems !== 1 ? 's' : ''})
            </button>
            <p className="text-xs text-neutral-500 text-center mt-3">
              Items grouped by retailer to minimize tabs
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Recommend Brand Modal
function RecommendBrandModal({ onClose, onSubmit, brandName, setBrandName, email, setEmail, submitting, success }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-neutral-900">Recommend a Brand</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="text-lg font-semibold text-neutral-900 mb-2">Thank you!</h4>
            <p className="text-neutral-600">We'll review your brand recommendation.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-neutral-600 mb-6">
              Don't see your favorite brand? Let us know and we'll consider adding it!
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Brand Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g., Patagonia"
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Your Email (optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  We'll notify you if we add this brand
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onSubmit}
                disabled={!brandName.trim() || submitting}
                className="flex-1 bg-neutral-900 text-white py-2 rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-neutral-200 text-neutral-700 py-2 rounded-lg hover:bg-neutral-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [myBrands, setMyBrands] = useState([]);
  const [showAddBrand, setShowAddBrand] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandCollection, setNewBrandCollection] = useState('');
  const [newCollectionName, setNewCollectionName] = useState('');
  const [showNewCollection, setShowNewCollection] = useState(false);
  const [brandSuggestions, setBrandSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeTab, setActiveTab] = useState('deals');
  const [user, setUser] = useState(null);
  const [syncStatus, setSyncStatus] = useState('idle');
  const [deals, setDeals] = useState([]);
  const [dealsLoading, setDealsLoading] = useState(true);
  const [dealsError, setDealsError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedGenders, setSelectedGenders] = useState([]);

  // NEW: Search, Sort, Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [dealSort, setDealSort] = useState('discount');
  const [dealFilter, setDealFilter] = useState('all');

  // Shopping Bag
  const [shoppingBag, setShoppingBag] = useState(() => {
    const saved = localStorage.getItem('shoppingBag');
    return saved ? JSON.parse(saved) : [];
  });
  const [showBagModal, setShowBagModal] = useState(false);

  // Collections collapse state
  const [collapsedCollections, setCollapsedCollections] = useState([]);

  const toggleCollectionCollapse = (collectionName) => {
    setCollapsedCollections(prev =>
      prev.includes(collectionName)
        ? prev.filter(c => c !== collectionName)
        : [...prev, collectionName]
    );
  };

  // Brand Recommendation
  const [showRecommendModal, setShowRecommendModal] = useState(false);
  const [recommendBrand, setRecommendBrand] = useState('');
  const [recommendEmail, setRecommendEmail] = useState('');
  const [recommendSubmitting, setRecommendSubmitting] = useState(false);
  const [recommendSuccess, setRecommendSuccess] = useState(false);

  // Email Link Sign-In
  const [showEmailSignIn, setShowEmailSignIn] = useState(false);
  const [emailForSignIn, setEmailForSignIn] = useState('');
  const [emailLinkSent, setEmailLinkSent] = useState(false);
  const [emailSignInError, setEmailSignInError] = useState('');
  const [sendingEmailLink, setSendingEmailLink] = useState(false);

  // Shipping Profile with Size Preferences
  const [shippingProfile, setShippingProfile] = useState(() => {
    const saved = localStorage.getItem('shippingProfile');
    const defaultProfile = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      // Size preferences
      shirtSize: '',
      pantsWaist: '',
      pantsInseam: '',
      shoeSize: '',
      dressSize: ''
    };
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge with defaults to ensure all fields exist
        return { ...defaultProfile, ...parsed };
      } catch (error) {
        console.error('Error parsing shipping profile:', error);
        return defaultProfile;
      }
    }
    return defaultProfile;
  });

  // Load localStorage data immediately on mount (before auth resolves)
  useEffect(() => {
    const savedBrands = localStorage.getItem('myBrands');
    const savedBag = localStorage.getItem('shoppingBag');
    const savedProfile = localStorage.getItem('shippingProfile');
    const savedGenders = localStorage.getItem('selectedGenders');
    
    if (savedBrands) setMyBrands(JSON.parse(savedBrands));
    if (savedBag) setShoppingBag(JSON.parse(savedBag));
    if (savedProfile) setShippingProfile(JSON.parse(savedProfile));
    if (savedGenders) setSelectedGenders(JSON.parse(savedGenders));
  }, []);

  // Handle redirect result (for mobile sign-in)
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          console.log('✅ Redirect sign-in successful:', result.user.email);
        }
      } catch (error) {
        console.error('❌ Redirect sign-in error:', error);
        if (error.code !== 'auth/popup-closed-by-user') {
          alert('Sign in failed. Please try again.');
        }
      }
    };
    handleRedirectResult();
  }, []);

  // Handle email link sign-in completion
  useEffect(() => {
    const completeEmailLinkSignIn = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        console.log('📧 Email link detected, completing sign-in...');
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
          email = window.prompt('Please provide your email for confirmation');
        }
        
        if (email) {
          try {
            const result = await signInWithEmailLink(auth, email, window.location.href);
            console.log('✅ Email link sign-in successful:', result.user.email);
            window.localStorage.removeItem('emailForSignIn');
            window.history.replaceState({}, document.title, window.location.pathname);
          } catch (error) {
            console.error('❌ Email link sign-in error:', error);
            alert('Sign in failed. The link may have expired. Please request a new one.');
          }
        }
      }
    };
    completeEmailLinkSignIn();
  }, []);

  // Handle auth state and Firebase sync
  useEffect(() => {
    console.log('🔄 Setting up auth state listener...');
    
    // First, check current auth state immediately
    const currentAuth = auth.currentUser;
    console.log('Initial auth check:', currentAuth ? currentAuth.email : 'No user');
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('🔐 Auth state changed:', currentUser ? currentUser.email : 'No user');
      console.log('User ID:', currentUser?.uid);
      console.log('Auth currentUser:', auth.currentUser?.email || 'null');
      
      // Check if we actually have a valid token
      if (currentUser) {
        try {
          const token = await currentUser.getIdToken();
          console.log('✅ Valid auth token exists:', token.substring(0, 20) + '...');
        } catch (error) {
          console.error('❌ Failed to get auth token:', error);
          console.error('Auth is broken - forcing sign out');
          setUser(null);
          return;
        }
      }
      
      setUser(currentUser);
      if (currentUser) {
        // User signed in - intelligently merge localStorage with Firebase
        try {
          console.log('📥 Attempting to load data from Firebase...');
          console.log('User ID for query:', currentUser.uid);
          
          const userDocRef = doc(db, 'users', currentUser.uid);
          console.log('Document path:', 'users/' + currentUser.uid);
          
          const userDoc = await getDoc(userDocRef);
          console.log('Document exists?', userDoc.exists());
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            console.log('📦 RAW Firebase data:', data);
            console.log('✅ Firebase data found:', {
              brands: data.brands?.length || 0,
              genderPrefs: data.genderPreferences?.length || 0,
              bagItems: data.shoppingBag?.length || 0
            });
            
            // Smart merge: Prefer Firebase if it has data, otherwise use localStorage
            const localBrands = JSON.parse(localStorage.getItem('myBrands') || '[]');
            const firebaseBrands = data.brands || [];
            
            console.log('📊 Comparison:', {
              localStorage: localBrands.length,
              firebase: firebaseBrands.length
            });
            
            // Priority: Firebase with data > localStorage with data > empty
            if (firebaseBrands.length > 0) {
              if (localBrands.length > firebaseBrands.length) {
                console.log('📤 localStorage has MORE brands, keeping localStorage:', localBrands.length);
                setMyBrands(localBrands);
                // Will trigger saveToCloud to update Firebase
              } else {
                console.log('📦 Loading from Firebase:', firebaseBrands.length, 'brands');
                console.log('Brands:', firebaseBrands.map(b => b.name).join(', '));
                setMyBrands(firebaseBrands);
              }
            } else if (localBrands.length > 0) {
              console.log('📤 Firebase empty, using localStorage:', localBrands.length);
              setMyBrands(localBrands);
              // Will trigger saveToCloud
            } else {
              console.log('⚠️ No brands in either location');
            }
            
            if (data.genderPreferences && data.genderPreferences.length > 0) {
              setSelectedGenders(data.genderPreferences);
            }
            if (data.shoppingBag && data.shoppingBag.length > 0) {
              setShoppingBag(data.shoppingBag);
            }
            if (data.shippingProfile) {
              setShippingProfile(data.shippingProfile);
            }
          } else {
            console.log('❌ No Firebase document found!');
            console.log('Document ID searched:', currentUser.uid);
            // First time sign in - upload current localStorage data to Firebase
            const localBrands = JSON.parse(localStorage.getItem('myBrands') || '[]');
            if (localBrands.length > 0) {
              console.log('📤 Uploading localStorage data to Firebase:', localBrands.length);
              setMyBrands(localBrands);
              // Will trigger saveToCloud via useEffect
            }
          }
        } catch (error) {
          console.error('❌ Error loading user data:', error);
          console.error('Error details:', error.message);
          console.error('Error code:', error.code);
          console.error('Full error:', error);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log('🔄 myBrands changed:', myBrands.length, 'brands');
    localStorage.setItem('myBrands', JSON.stringify(myBrands));
    if (user) {
      console.log('✅ User exists, calling saveToCloud...');
      saveToCloud();
    } else {
      console.log('⚠️ No user, skipping cloud save');
    }
  }, [myBrands, user]);

  useEffect(() => {
    localStorage.setItem('shoppingBag', JSON.stringify(shoppingBag));
    if (user) {
      saveToCloud();
    }
  }, [shoppingBag]);

  useEffect(() => {
    localStorage.setItem('shippingProfile', JSON.stringify(shippingProfile));
    if (user) {
      saveToCloud();
    }
  }, [shippingProfile]);

  useEffect(() => {
    localStorage.setItem('selectedGenders', JSON.stringify(selectedGenders));
    if (user) {
      saveGenderPreferences();
    }
  }, [selectedGenders, user]);

  useEffect(() => {
    if (myBrands.length > 0) {
      fetchDealsFromFirestore();
    } else {
      setDeals([]);
      setDealsLoading(false);
    }
  }, [myBrands]);

  const fetchDealsFromFirestore = async () => {
    if (myBrands.length === 0) {
      setDeals([]);
      setDealsLoading(false);
      return;
    }

    try {
      setDealsLoading(true);
      setDealsError(null);

      const brandNames = myBrands.map(b => b.name);
      const dealsRef = collection(db, 'deals');
      const batchSize = 30;
      let allDeals = [];

      for (let i = 0; i < brandNames.length; i += batchSize) {
        const batch = brandNames.slice(i, i + batchSize);
        const q = query(dealsRef, where('brand', 'in', batch), orderBy('fetchedAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const batchDeals = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        allDeals = [...allDeals, ...batchDeals];
      }

      const uniqueDeals = Array.from(new Map(allDeals.map(deal => [deal.id, deal])).values());
      const sortedDeals = uniqueDeals.sort((a, b) => parseInt(b.discount) - parseInt(a.discount));

      setDeals(sortedDeals);
      if (sortedDeals.length > 0 && sortedDeals[0].lastUpdated) {
        setLastUpdated(sortedDeals[0].lastUpdated);
      }
      setDealsLoading(false);
    } catch (error) {
      console.error('Error fetching deals:', error);
      setDealsError('Failed to load deals. Please try again.');
      setDealsLoading(false);
    }
  };

  const refreshDeals = async () => {
    setRefreshing(true);
    await fetchDealsFromFirestore();
    setRefreshing(false);
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return '';
    const now = new Date();
    const updated = new Date(timestamp);
    const diffMs = now - updated;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffHours < 1) {
      return `Updated ${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `Updated ${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `Updated ${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
  };

  const loadUserData = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data.brands) setMyBrands(data.brands);
        if (data.genderPreferences) setSelectedGenders(data.genderPreferences);
        if (data.shoppingBag) setShoppingBag(data.shoppingBag);
        if (data.shippingProfile) setShippingProfile(data.shippingProfile);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const saveGenderPreferences = async () => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.uid), {
        genderPreferences: selectedGenders,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      console.error('Error saving gender preferences:', error);
    }
  };

  const saveToCloud = async () => {
    if (!user) {
      console.log('❌ saveToCloud: No user signed in');
      return;
    }
    
    // Don't save if ALL data is empty (prevents wiping Firebase on first sign-in)
    if (myBrands.length === 0 && shoppingBag.length === 0 && selectedGenders.length === 0) {
      console.log('⚠️ saveToCloud: Skipping - no data to save');
      return;
    }
    
    try {
      console.log('💾 saveToCloud: Starting sync...', { 
        userId: user.uid, 
        brandsCount: myBrands.length 
      });
      setSyncStatus('syncing');
      await setDoc(doc(db, 'users', user.uid), {
        brands: myBrands,
        genderPreferences: selectedGenders,
        shoppingBag: shoppingBag,
        shippingProfile: shippingProfile,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      console.log('✅ saveToCloud: Sync successful!');
      setSyncStatus('synced');
      setTimeout(() => setSyncStatus('idle'), 2000);
    } catch (error) {
      console.error('❌ saveToCloud error:', error);
      setSyncStatus('error');
    }
  };

  const restoreFromCloud = async () => {
    if (!user) return;
    try {
      setSyncStatus('syncing');
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setMyBrands(userDoc.data().brands || []);
        setSyncStatus('synced');
        setTimeout(() => setSyncStatus('idle'), 2000);
      }
    } catch (error) {
      console.error('Error restoring:', error);
      setSyncStatus('error');
    }
  };

  const signIn = async () => {
    // Show email sign-in modal instead of direct Google OAuth
    setShowEmailSignIn(true);
  };

  const signInWithGoogle = async () => {
    try {
      console.log('🔐 Starting Google sign-in process...');
      
      // Try popup first (best UX on desktop)
      try {
        console.log('📱 Attempting popup sign-in...');
        await signInWithPopup(auth, googleProvider);
        console.log('✅ Popup sign-in successful!');
        setShowEmailSignIn(false);
        return;
      } catch (popupError) {
        console.log('⚠️ Popup method failed:', popupError.code);
        
        // If popup was blocked, cancelled, or failed - use redirect
        if (
          popupError.code === 'auth/popup-blocked' ||
          popupError.code === 'auth/popup-closed-by-user' ||
          popupError.code === 'auth/cancelled-popup-request' ||
          popupError.code === 'auth/operation-not-supported-in-this-environment'
        ) {
          console.log('🔄 Switching to redirect sign-in...');
          await signInWithRedirect(auth, googleProvider);
          return;
        }
        
        // For other errors, still try redirect as fallback
        console.log('🔄 Trying redirect as fallback...');
        await signInWithRedirect(auth, googleProvider);
      }
    } catch (error) {
      console.error('❌ Sign-in error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      let userMessage = 'Sign in failed. ';
      
      if (error.code === 'auth/unauthorized-domain') {
        userMessage = '⚠️ Domain not authorized. Please contact support with error code: unauthorized-domain';
      } else if (error.code === 'auth/network-request-failed') {
        userMessage = '⚠️ Network error. Please check your internet connection and try again.';
      } else if (error.code === 'auth/too-many-requests') {
        userMessage = '⚠️ Too many attempts. Please wait a few minutes and try again.';
      } else {
        userMessage += `Please try again or contact support. Error: ${error.code}`;
      }
      
      alert(userMessage);
    }
  };

  const sendEmailSignInLink = async () => {
    if (!emailForSignIn || !emailForSignIn.includes('@')) {
      setEmailSignInError('Please enter a valid email address');
      return;
    }

    setSendingEmailLink(true);
    setEmailSignInError('');

    try {
      const actionCodeSettings = {
        url: 'https://www.brandsnobs.com',
        handleCodeInApp: true,
        iOS: {
          bundleId: 'com.brandsnobs.app'
        },
        android: {
          packageName: 'com.brandsnobs.app',
          installApp: false,
          minimumVersion: '1'
        },
        dynamicLinkDomain: undefined
      };

      console.log('📧 Sending sign-in link to:', emailForSignIn);
      console.log('Action code settings:', actionCodeSettings);

      await sendSignInLinkToEmail(auth, emailForSignIn, actionCodeSettings);
      
      // Save email to complete sign-in after link click
      window.localStorage.setItem('emailForSignIn', emailForSignIn);
      
      setEmailLinkSent(true);
      console.log('✅ Sign-in link sent successfully to:', emailForSignIn);
    } catch (error) {
      console.error('❌ Error sending email link:', error);
      
      if (error.code === 'auth/invalid-email') {
        setEmailSignInError('Invalid email address');
      } else if (error.code === 'auth/too-many-requests') {
        setEmailSignInError('Too many requests. Please try again later.');
      } else {
        setEmailSignInError('Failed to send link. Please try again.');
      }
    } finally {
      setSendingEmailLink(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const addBrand = () => {
    if (!newBrandName.trim()) return;
    
    const collection = showNewCollection 
      ? newCollectionName.trim() 
      : newBrandCollection;
    
    if (!collection) return;
    
    setMyBrands([...myBrands, {
      id: Date.now(),
      name: newBrandName.trim(),
      collection: collection
    }]);
    setNewBrandName('');
    setNewBrandCollection('');
    setNewCollectionName('');
    setShowNewCollection(false);
    setShowAddBrand(false);
    setShowSuggestions(false);
  };

  // Get unique user collections
  const userCollections = [...new Set(myBrands.map(b => b.collection).filter(Boolean))];

  const handleBrandInputChange = (value) => {
    setNewBrandName(value);
    
    if (value.trim().length > 0) {
      const filtered = ALL_AVAILABLE_BRANDS.filter(brand =>
        brand.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setBrandSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setBrandSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectBrandSuggestion = (brand) => {
    setNewBrandName(brand);
    setShowSuggestions(false);
    setBrandSuggestions([]);
  };

  const addToBag = (deal) => {
    // Check if already in bag
    if (shoppingBag.find(item => item.id === deal.id)) {
      return; // Already in bag
    }
    setShoppingBag([...shoppingBag, deal]);
  };

  const removeFromBag = (dealId) => {
    setShoppingBag(shoppingBag.filter(item => item.id !== dealId));
  };

  const clearBag = () => {
    setShoppingBag([]);
  };

  const checkoutAll = () => {
    if (shoppingBag.length === 0) return;
    
    // Group items by retailer to minimize tabs
    const byRetailer = {};
    shoppingBag.forEach(item => {
      if (!byRetailer[item.retailer]) {
        byRetailer[item.retailer] = [];
      }
      byRetailer[item.retailer].push(item);
    });

    // Show instruction modal
    alert(`Opening ${Object.keys(byRetailer).length} retailer tabs...\n\nOn each site:\n1. Click "Add to Cart"\n2. Proceed to checkout\n3. Use your saved shipping info`);

    // Open each retailer's items (stagger to avoid popup blocker)
    Object.values(byRetailer).forEach((items, index) => {
      setTimeout(() => {
        // Open first item's link for each retailer
        window.open(items[0].link, '_blank');
      }, index * 300);
    });

    setShowBagModal(false);
  };

  const submitBrandRecommendation = async () => {
    if (!recommendBrand.trim()) return;
    
    setRecommendSubmitting(true);
    
    try {
      // Save recommendation to Firestore
      const recommendationRef = collection(db, 'brand_recommendations');
      await setDoc(doc(recommendationRef), {
        brandName: recommendBrand.trim(),
        submitterEmail: recommendEmail.trim() || 'Not provided',
        userEmail: user?.email || 'Anonymous',
        submittedAt: new Date().toISOString(),
        status: 'pending'
      });
      
      console.log('✅ Recommendation saved to Firestore');
      
      // Send email notification via EmailJS
      const emailParams = {
        brand_name: recommendBrand.trim(),
        user_email: user?.email || 'Anonymous',
        submitter_email: recommendEmail.trim() || 'Not provided',
        submitted_at: new Date().toLocaleString('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short'
        })
      };
      
      await emailjs.send(
        'service_9b98jq6',      // Your Service ID
        'template_7sri3sr',     // Your Template ID
        emailParams
      );
      
      console.log('✅ Email sent successfully to admin@brandsnobs.com');
      setRecommendSuccess(true);
      setTimeout(() => {
        setShowRecommendModal(false);
        setRecommendBrand('');
        setRecommendEmail('');
        setRecommendSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('❌ Error submitting recommendation:', error);
      alert('Failed to submit recommendation. Please try again.');
    } finally {
      setRecommendSubmitting(false);
    }
  };

  const removeBrand = (id) => {
    setMyBrands(myBrands.filter(b => b.id !== id));
  };

  const loadCollection = (collection) => {
    const newBrands = collection.brands.filter(
      collBrand => !myBrands.some(myBrand => myBrand.name === collBrand.name)
    ).map(brand => ({
      id: Date.now() + Math.random(),
      name: brand.name,
      collection: collection.name
    }));
    setMyBrands([...myBrands, ...newBrands]);
    setActiveTab('brands');
  };

  const filteredDeals = React.useMemo(() => {
    let result = deals;
    
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(deal => 
        deal.product.toLowerCase().includes(query) ||
        deal.brand.toLowerCase().includes(query)
      );
    }
    
    // Gender filter
    if (selectedGenders.length > 0) {
      result = result.filter(deal => {
        if (deal.gender) {
          return selectedGenders.includes(deal.gender) || deal.gender === 'unisex';
        }
        return true;
      });
    }
    
    // Discount filter
    if (dealFilter === '>30%') {
      result = result.filter(deal => parseInt(deal.discount) >= 30);
    } else if (dealFilter === '>50%') {
      result = result.filter(deal => parseInt(deal.discount) >= 50);
    }
    
    // Size-based prioritization (boost matching sizes to top, don't filter out)
    const hasSizePreferences = shippingProfile?.shirtSize || shippingProfile?.shoeSize || 
                                shippingProfile?.pantsWaist || shippingProfile?.pantsInseam || 
                                shippingProfile?.dressSize;
    
    if (hasSizePreferences) {
      result = result.map(deal => {
        const productLower = (deal.product || '').toLowerCase();
        let sizeMatchScore = 0;
        
        // Check for size matches in product title
        if (shippingProfile.shirtSize && productLower.includes(`size ${shippingProfile.shirtSize.toLowerCase()}`)) sizeMatchScore += 3;
        if (shippingProfile.shirtSize && new RegExp(`\\b${shippingProfile.shirtSize.toLowerCase()}\\b`).test(productLower)) sizeMatchScore += 2;
        
        if (shippingProfile.shoeSize && productLower.includes(`size ${shippingProfile.shoeSize}`)) sizeMatchScore += 3;
        if (shippingProfile.shoeSize && new RegExp(`\\b${shippingProfile.shoeSize}\\b`).test(productLower)) sizeMatchScore += 2;
        
        if (shippingProfile.pantsWaist && productLower.includes(`${shippingProfile.pantsWaist}w`)) sizeMatchScore += 3;
        if (shippingProfile.pantsWaist && productLower.includes(`waist ${shippingProfile.pantsWaist}`)) sizeMatchScore += 2;
        
        if (shippingProfile.pantsInseam && productLower.includes(`${shippingProfile.pantsInseam}l`)) sizeMatchScore += 3;
        if (shippingProfile.pantsInseam && productLower.includes(`inseam ${shippingProfile.pantsInseam}`)) sizeMatchScore += 2;
        
        if (shippingProfile.dressSize && productLower.includes(`size ${shippingProfile.dressSize}`)) sizeMatchScore += 3;
        
        return { ...deal, sizeMatchScore };
      });
    }
    
    // Sorting
    const sorted = [...result];
    if (dealSort === 'discount') {
      sorted.sort((a, b) => {
        // Prioritize size matches, then sort by discount
        if (a.sizeMatchScore !== b.sizeMatchScore) return (b.sizeMatchScore || 0) - (a.sizeMatchScore || 0);
        return parseInt(b.discount) - parseInt(a.discount);
      });
    } else if (dealSort === 'price-low') {
      sorted.sort((a, b) => {
        if (a.sizeMatchScore !== b.sizeMatchScore) return (b.sizeMatchScore || 0) - (a.sizeMatchScore || 0);
        return a.salePrice - b.salePrice;
      });
    } else if (dealSort === 'price-high') {
      sorted.sort((a, b) => {
        if (a.sizeMatchScore !== b.sizeMatchScore) return (b.sizeMatchScore || 0) - (a.sizeMatchScore || 0);
        return b.salePrice - a.salePrice;
      });
    } else if (dealSort === 'brand') {
      sorted.sort((a, b) => {
        if (a.sizeMatchScore !== b.sizeMatchScore) return (b.sizeMatchScore || 0) - (a.sizeMatchScore || 0);
        return a.brand.localeCompare(b.brand);
      });
    }
    
    return sorted;
  }, [deals, searchQuery, selectedGenders, dealFilter, dealSort, shippingProfile]);

  const stats = {
    totalBrands: myBrands.length,
    totalDeals: filteredDeals.length,
    totalSavings: filteredDeals.reduce((sum, deal) => sum + (deal.originalPrice - deal.salePrice), 0),
    avgDiscount: filteredDeals.length > 0
      ? Math.round(filteredDeals.reduce((sum, deal) => sum + parseInt(deal.discount), 0) / filteredDeals.length)
      : 0
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50 shadow-sm">
        <div className="pt-safe">
          <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <ShoppingBag className="w-8 h-8 text-neutral-900" />
                <div className="text-left">
                  <h1 className="font-display text-2xl font-bold text-neutral-900">BrandSnobs</h1>
                  <p className="text-xs text-neutral-500 tracking-wide">YOU LIKE WHAT YOU LIKE</p>
                </div>
              </button>
            </div>
            <div className="flex items-center gap-3">
              {/* Shopping Bag Button */}
              <button 
                onClick={() => setShowBagModal(true)}
                className="relative p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <ShoppingBag className="w-6 h-6 text-neutral-700" />
                {shoppingBag.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-neutral-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {shoppingBag.length}
                  </span>
                )}
              </button>

              {syncStatus === 'syncing' && (
                <div className="flex items-center gap-2 text-blue-600">
                  <Cloud className="w-5 h-5 animate-pulse" />
                  <span className="text-sm">Syncing...</span>
                </div>
              )}
              {syncStatus === 'synced' && (
                <div className="flex items-center gap-2 text-green-600">
                  <Cloud className="w-5 h-5" />
                  <span className="text-sm">Synced</span>
                </div>
              )}
              {user ? (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    <div className="text-right hidden md:block">
                      <p className="text-sm font-medium text-neutral-900">{user.displayName}</p>
                      <p className="text-xs text-neutral-500">{user.email}</p>
                    </div>
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-transparent hover:border-neutral-300 transition-colors" />
                    ) : (
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-semibold text-sm border-2 border-transparent hover:border-neutral-300 transition-colors">
                        {user.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>
                  <button onClick={signOut} className="bg-neutral-100 text-neutral-900 p-2 md:px-4 md:py-2 rounded-lg hover:bg-neutral-200 transition-colors flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    <span className="hidden md:inline">Sign Out</span>
                  </button>
                </div>
              ) : (
                <button onClick={signIn} className="bg-neutral-900 text-white px-3 md:px-6 py-2 rounded-lg hover:bg-neutral-800 transition-colors flex items-center gap-2 text-sm">
                  <LogIn className="w-4 h-4" />
                  <span className="hidden md:inline">Sign In with Google</span>
                  <span className="md:hidden">Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
        </div>
      </header>

      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-2 md:px-4">
          <div className="flex overflow-x-auto scrollbar-hide">
            {['deals', 'brands', 'recommendations', 'profile'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-shrink-0 py-3 md:py-4 px-3 md:px-4 border-b-2 transition-colors font-medium text-xs md:text-sm capitalize whitespace-nowrap ${activeTab === tab ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-500 hover:text-neutral-700'}`}
              >
                {tab}
                {tab === 'deals' && filteredDeals.length > 0 && ` (${filteredDeals.length})`}
                {tab === 'brands' && myBrands.length > 0 && ` (${myBrands.length})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'deals' && (
          <div>
            {myBrands.length > 0 && <GenderPreference selectedGenders={selectedGenders} onGenderChange={setSelectedGenders} />}

            {/* Search, Sort, Filter Controls */}
            {myBrands.length > 0 && (
              <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-neutral-200 p-3 md:p-4 mb-4 md:mb-6">
                <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 w-4 h-4 md:w-5 md:h-5 text-neutral-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products or brands..."
                        className="w-full pl-9 md:pl-10 pr-3 py-2 border border-neutral-300 rounded-lg text-sm md:text-base"
                      />
                      {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-neutral-400">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 md:gap-3">
                    <select value={dealFilter} onChange={(e) => setDealFilter(e.target.value)} className="px-3 py-2 border border-neutral-300 rounded-lg text-sm flex-1 md:flex-none">
                      <option value="all">All Deals</option>
                      <option value=">30%">30%+ Off</option>
                      <option value=">50%">50%+ Off</option>
                    </select>
                    <select value={dealSort} onChange={(e) => setDealSort(e.target.value)} className="px-3 py-2 border border-neutral-300 rounded-lg text-sm flex-1 md:flex-none">
                      <option value="discount">Best Deals</option>
                      <option value="price-low">Price: Low</option>
                      <option value="price-high">Price: High</option>
                      <option value="brand">Brand A-Z</option>
                    </select>
                  </div>
                </div>
                {searchQuery && (
                  <div className="mt-3 text-sm text-neutral-600">
                    Found {filteredDeals.length} result{filteredDeals.length !== 1 ? 's' : ''} for "{searchQuery}"
                  </div>
                )}
              </div>
            )}

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
                <div className="text-sm text-neutral-500 mb-1">Brands Tracked</div>
                <div className="font-display text-3xl font-bold text-neutral-900">{stats.totalBrands}</div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
                <div className="text-sm text-neutral-500 mb-1">Active Deals</div>
                <div className="font-display text-3xl font-bold text-neutral-900">{stats.totalDeals}</div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
                <div className="text-sm text-neutral-500 mb-1">Total Savings</div>
                <div className="font-display text-3xl font-bold text-neutral-900">${stats.totalSavings.toLocaleString()}</div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
                <div className="text-sm text-neutral-500 mb-1">Avg Discount</div>
                <div className="font-display text-3xl font-bold text-neutral-900">{stats.avgDiscount}%</div>
              </div>
            </div>

            {dealsLoading && (
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-12 text-center">
                <RefreshCw className="w-12 h-12 text-neutral-600 mx-auto mb-4 animate-spin" />
                <h3 className="font-display text-xl font-semibold text-neutral-700 mb-2">Loading deals...</h3>
                <p className="text-neutral-500">Fetching the latest deals from your brands</p>
              </div>
            )}

            {dealsError && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
                <h3 className="font-semibold text-red-800 mb-2">Error Loading Deals</h3>
                <p className="text-red-600 mb-4">{dealsError}</p>
                <button onClick={refreshDeals} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">Try Again</button>
              </div>
            )}

            {/* No brands state */}
            {!dealsLoading && myBrands.length === 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-12 text-center">
                <ShoppingBag className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold text-neutral-700 mb-2">No brands yet</h3>
                <p className="text-neutral-500 mb-4">Add brands to collections to start seeing deals!</p>
                <button onClick={() => setActiveTab('brands')} className="bg-neutral-900 text-white px-6 py-3 rounded-lg hover:bg-neutral-800 transition-colors inline-flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add Brands
                </button>
              </div>
            )}

            {/* Deals grouped by collection */}
            {!dealsLoading && !dealsError && myBrands.length > 0 && (
              <div>
                {/* If searching/filtering, show flat list with header */}
                {(searchQuery || dealFilter !== 'all') ? (
                  <div>
                    <p className="text-sm text-neutral-500 mb-4">{filteredDeals.length} deal{filteredDeals.length !== 1 ? 's' : ''} found</p>
                    {filteredDeals.length === 0 ? (
                      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-12 text-center">
                        <Tag className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                        <h3 className="font-display text-xl font-semibold text-neutral-700 mb-2">No deals found</h3>
                        <p className="text-neutral-500">Try adjusting your search or filters</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                        {filteredDeals.map(deal => <LuxuryDealCard key={deal.id} deal={deal} onAddToBag={addToBag} />)}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Grouped by collection */
                  <div className="space-y-4">
                    {userCollections.length > 0 ? (
                      userCollections.map(collection => {
                        const collectionBrandNames = myBrands
                          .filter(b => b.collection === collection)
                          .map(b => b.name);
                        const collectionDeals = filteredDeals.filter(d =>
                          collectionBrandNames.includes(d.brand)
                        );
                        const isCollapsed = collapsedCollections.includes(collection);

                        return (
                          <div key={collection} className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
                            <button
                              onClick={() => toggleCollectionCollapse(collection)}
                              className="w-full flex items-center justify-between p-6 hover:bg-neutral-50 transition-colors"
                            >
                              <div className="text-left">
                                <h3 className="font-display text-xl font-bold text-neutral-900">{collection}</h3>
                                <p className="text-sm text-neutral-500 mt-0.5">
                                  {collectionBrandNames.length} brand{collectionBrandNames.length !== 1 ? 's' : ''} · {collectionDeals.length} deal{collectionDeals.length !== 1 ? 's' : ''}
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-sm text-neutral-500 hidden md:block">
                                  {isCollapsed ? 'Show deals' : 'Hide deals'}
                                </span>
                                {isCollapsed
                                  ? <ChevronDown className="w-5 h-5 text-neutral-500" />
                                  : <ChevronUp className="w-5 h-5 text-neutral-500" />
                                }
                              </div>
                            </button>
                            {!isCollapsed && (
                              <div className="px-6 pb-6">
                                {collectionDeals.length === 0 ? (
                                  <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6 text-center">
                                    <p className="text-neutral-500 text-sm">No deals found for this collection right now.</p>
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                                    {collectionDeals.map(deal => <LuxuryDealCard key={deal.id} deal={deal} onAddToBag={addToBag} />)}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      /* Brands with no collection - show flat */
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                        {filteredDeals.map(deal => <LuxuryDealCard key={deal.id} deal={deal} onAddToBag={addToBag} />)}
                      </div>
                    )}

                    {/* Uncollected brands deals */}
                    {myBrands.filter(b => !b.collection).length > 0 && (() => {
                      const uncollectedNames = myBrands.filter(b => !b.collection).map(b => b.name);
                      const uncollectedDeals = filteredDeals.filter(d => uncollectedNames.includes(d.brand));
                      if (uncollectedDeals.length === 0) return null;
                      const isCollapsed = collapsedCollections.includes('__uncollected__');
                      return (
                        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
                          <button
                            onClick={() => toggleCollectionCollapse('__uncollected__')}
                            className="w-full flex items-center justify-between p-6 hover:bg-neutral-50 transition-colors"
                          >
                            <div className="text-left">
                              <h3 className="font-display text-xl font-bold text-neutral-900">Other Brands</h3>
                              <p className="text-sm text-neutral-500 mt-0.5">{uncollectedDeals.length} deal{uncollectedDeals.length !== 1 ? 's' : ''}</p>
                            </div>
                            {isCollapsed ? <ChevronDown className="w-5 h-5 text-neutral-500" /> : <ChevronUp className="w-5 h-5 text-neutral-500" />}
                          </button>
                          {!isCollapsed && (
                            <div className="px-6 pb-6">
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                                {uncollectedDeals.map(deal => <LuxuryDealCard key={deal.id} deal={deal} onAddToBag={addToBag} />)}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'brands' && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-neutral-900">My Brands</h2>
                <p className="text-neutral-600 text-sm md:text-base">Track deals from your favorite brands</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {user && (
                  <>
                    <button onClick={saveToCloud} disabled={syncStatus === 'syncing'} className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1.5 disabled:opacity-50 text-sm">
                      <Cloud className="w-4 h-4" />
                      <span className="hidden md:inline">Save</span>
                    </button>
                    <button onClick={restoreFromCloud} disabled={syncStatus === 'syncing'} className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5 disabled:opacity-50 text-sm">
                      <CloudOff className="w-4 h-4" />
                      <span className="hidden md:inline">Restore</span>
                    </button>
                  </>
                )}
                <button onClick={() => setShowAddBrand(!showAddBrand)} className="bg-neutral-900 text-white px-3 py-2 rounded-lg hover:bg-neutral-800 transition-colors flex items-center gap-1.5 text-sm">
                  <Plus className="w-4 h-4" />
                  Add Brand
                </button>
                <button onClick={() => setShowRecommendModal(true)} className="bg-neutral-200 text-neutral-700 px-3 py-2 rounded-lg hover:bg-neutral-300 transition-colors flex items-center gap-1.5 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span className="hidden md:inline">Recommend</span>
                  <span className="md:hidden">Suggest</span>
                </button>
              </div>
            </div>

            {!user && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
                <p className="text-blue-800"><strong>💡 Pro tip:</strong> Sign in to sync your brands across all your devices!</p>
              </div>
            )}

            {showAddBrand && (
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 mb-6">
                <h3 className="font-semibold text-lg mb-4">Add New Brand</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Brand Name</label>
                    <input
                      type="text"
                      value={newBrandName}
                      onChange={(e) => handleBrandInputChange(e.target.value)}
                      placeholder="Start typing to see suggestions..."
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && addBrand()}
                      onFocus={() => newBrandName && setShowSuggestions(brandSuggestions.length > 0)}
                    />
                    {showSuggestions && brandSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-neutral-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {brandSuggestions.map((brand, index) => (
                          <button
                            key={index}
                            onClick={() => selectBrandSuggestion(brand)}
                            className="w-full text-left px-4 py-2 hover:bg-neutral-100 transition-colors border-b border-neutral-100 last:border-b-0"
                          >
                            <div className="font-medium text-neutral-900">{brand}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Collection</label>
                    {!showNewCollection ? (
                      <div className="space-y-2">
                        <select
                          value={newBrandCollection}
                          onChange={(e) => setNewBrandCollection(e.target.value)}
                          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                        >
                          <option value="">Select a collection...</option>
                          {userCollections.map(col => (
                            <option key={col} value={col}>{col}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => setShowNewCollection(true)}
                          className="text-sm text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
                        >
                          <Plus className="w-4 h-4" />
                          Create new collection
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={newCollectionName}
                          onChange={(e) => setNewCollectionName(e.target.value)}
                          placeholder="e.g., Athletic Gear, Luxury Bags..."
                          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                          autoFocus
                        />
                        {userCollections.length > 0 && (
                          <button
                            onClick={() => setShowNewCollection(false)}
                            className="text-sm text-neutral-600 hover:text-neutral-900"
                          >
                            ← Choose existing collection
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={addBrand}
                    disabled={!newBrandName.trim() || (!newBrandCollection && !newCollectionName.trim())}
                    className="bg-neutral-900 text-white px-6 py-2 rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Brand
                  </button>
                  <button
                    onClick={() => { setShowAddBrand(false); setShowNewCollection(false); }}
                    className="bg-neutral-200 text-neutral-700 px-6 py-2 rounded-lg hover:bg-neutral-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {myBrands.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-12 text-center">
                <ShoppingBag className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold text-neutral-700 mb-2">No brands added yet</h3>
                <p className="text-neutral-500">Click "Add Brand" and create your first collection to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userCollections.map(collection => {
                  const brandsInCollection = myBrands.filter(b => b.collection === collection);
                  if (brandsInCollection.length === 0) return null;
                  return (
                    <div key={collection} className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg text-neutral-800">{collection}</h3>
                        <span className="text-sm text-neutral-500">{brandsInCollection.length} brand{brandsInCollection.length !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {brandsInCollection.map(brand => (
                          <div key={brand.id} className="flex items-center justify-between bg-neutral-50 px-4 py-3 rounded-xl border border-neutral-200">
                            <span className="font-medium text-neutral-800">{brand.name}</span>
                            <button onClick={() => removeBrand(brand.id)} className="text-red-500 hover:text-red-700 transition-colors">
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                {/* Brands with no collection assigned */}
                {myBrands.filter(b => !b.collection).length > 0 && (
                  <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
                    <h3 className="font-semibold text-lg text-neutral-800 mb-4">Uncategorized</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {myBrands.filter(b => !b.collection).map(brand => (
                        <div key={brand.id} className="flex items-center justify-between bg-neutral-50 px-4 py-3 rounded-xl border border-neutral-200">
                          <span className="font-medium text-neutral-800">{brand.name}</span>
                          <button onClick={() => removeBrand(brand.id)} className="text-red-500 hover:text-red-700 transition-colors">
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div>
            <div className="mb-6">
              <h2 className="font-display text-2xl font-bold text-neutral-900 mb-2">Recommended Brands</h2>
              <p className="text-neutral-600">Discover curated brand collections for every style</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {BRAND_COLLECTIONS.map(collection => (
                <div key={collection.id} className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-neutral-900 to-neutral-700 p-6 text-white">
                    <h3 className="font-display text-2xl font-bold mb-2">{collection.name}</h3>
                    <p className="text-neutral-200">{collection.description}</p>
                  </div>
                  <div className="p-6">
                    <div className="mb-4">
                      <h4 className="font-semibold text-neutral-700 mb-3">Included Brands:</h4>
                      <div className="space-y-2">
                        {collection.brands.map((brand, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-neutral-50 px-3 py-2 rounded-lg">
                            <span className="font-medium text-neutral-800">{brand.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => loadCollection(collection)}
                      className="w-full bg-neutral-900 text-white py-3 rounded-lg hover:bg-neutral-800 transition-colors font-semibold"
                    >
                      Add All to My Brands
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'profile' && (
          <div>
            <div className="mb-6">
              <h2 className="font-display text-2xl font-bold text-neutral-900 mb-2">My Profile</h2>
              <p className="text-neutral-600">Save your shipping info for faster checkout</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 max-w-2xl">
              <h3 className="font-semibold text-lg mb-4">Shipping Information</h3>
              <p className="text-sm text-neutral-600 mb-6">
                This info will be displayed when you checkout, making it easy to copy and paste into each retailer's site.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">First Name</label>
                  <input
                    type="text"
                    value={shippingProfile.firstName}
                    onChange={(e) => setShippingProfile({...shippingProfile, firstName: e.target.value})}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                    placeholder="John"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={shippingProfile.lastName}
                    onChange={(e) => setShippingProfile({...shippingProfile, lastName: e.target.value})}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                    placeholder="Doe"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={shippingProfile.email}
                    onChange={(e) => setShippingProfile({...shippingProfile, email: e.target.value})}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                    placeholder="john.doe@example.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={shippingProfile.phone}
                    onChange={(e) => setShippingProfile({...shippingProfile, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Address</label>
                  <input
                    type="text"
                    value={shippingProfile.address}
                    onChange={(e) => setShippingProfile({...shippingProfile, address: e.target.value})}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                    placeholder="123 Main Street"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">City</label>
                  <input
                    type="text"
                    value={shippingProfile.city}
                    onChange={(e) => setShippingProfile({...shippingProfile, city: e.target.value})}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                    placeholder="Spring"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">State</label>
                  <input
                    type="text"
                    value={shippingProfile.state}
                    onChange={(e) => setShippingProfile({...shippingProfile, state: e.target.value})}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                    placeholder="TX"
                    maxLength="2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">ZIP Code</label>
                  <input
                    type="text"
                    value={shippingProfile.zip}
                    onChange={(e) => setShippingProfile({...shippingProfile, zip: e.target.value})}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                    placeholder="77389"
                  />
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>💡 Tip:</strong> Your shipping info is saved locally and will appear in a convenient copy-paste box when you checkout!
                </p>
              </div>
            </div>

            {/* Size Preferences */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 max-w-2xl mt-6">
              <h3 className="font-semibold text-lg mb-2">Size Preferences</h3>
              <p className="text-sm text-neutral-600 mb-6">
                Help us show you the most relevant deals by saving your sizes
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Shirt Size</label>
                  <select
                    value={shippingProfile.shirtSize}
                    onChange={(e) => setShippingProfile({...shippingProfile, shirtSize: e.target.value})}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                  >
                    <option value="">Select size...</option>
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                    <option value="XXXL">XXXL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Shoe Size (US)</label>
                  <select
                    value={shippingProfile.shoeSize}
                    onChange={(e) => setShippingProfile({...shippingProfile, shoeSize: e.target.value})}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                  >
                    <option value="">Select size...</option>
                    {Array.from({length: 20}, (_, i) => i + 5).map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Pants Waist (inches)</label>
                  <select
                    value={shippingProfile.pantsWaist}
                    onChange={(e) => setShippingProfile({...shippingProfile, pantsWaist: e.target.value})}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                  >
                    <option value="">Select waist...</option>
                    {Array.from({length: 24}, (_, i) => (i + 24)).map(size => (
                      <option key={size} value={size}>{size}"</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Pants Inseam (inches)</label>
                  <select
                    value={shippingProfile.pantsInseam}
                    onChange={(e) => setShippingProfile({...shippingProfile, pantsInseam: e.target.value})}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                  >
                    <option value="">Select inseam...</option>
                    {Array.from({length: 11}, (_, i) => (i + 28)).map(size => (
                      <option key={size} value={size}>{size}"</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Dress Size</label>
                  <select
                    value={shippingProfile.dressSize}
                    onChange={(e) => setShippingProfile({...shippingProfile, dressSize: e.target.value})}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                  >
                    <option value="">Select size...</option>
                    <option value="00">00</option>
                    <option value="0">0</option>
                    <option value="2">2</option>
                    <option value="4">4</option>
                    <option value="6">6</option>
                    <option value="8">8</option>
                    <option value="10">10</option>
                    <option value="12">12</option>
                    <option value="14">14</option>
                    <option value="16">16</option>
                    <option value="18">18</option>
                    <option value="20">20</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>✨ Smart Filtering:</strong> We'll prioritize showing you deals that match your sizes
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Shopping Bag Modal */}
      {showBagModal && (
        <ShoppingBagModal
          bag={shoppingBag}
          onClose={() => setShowBagModal(false)}
          onRemove={removeFromBag}
          onCheckout={checkoutAll}
          onClear={clearBag}
          shippingProfile={shippingProfile}
        />
      )}

      {/* Recommend Brand Modal */}
      {showEmailSignIn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
            {!emailLinkSent ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-neutral-900">Sign In to BrandSnobs</h2>
                  <button onClick={() => {
                    setShowEmailSignIn(false);
                    setEmailForSignIn('');
                    setEmailSignInError('');
                  }} className="text-neutral-400 hover:text-neutral-600">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <p className="text-neutral-600 mb-6">
                  Enter your email to receive a secure sign-in link. No password needed!
                </p>

                <input
                  type="email"
                  placeholder="your@email.com"
                  value={emailForSignIn}
                  onChange={(e) => {
                    setEmailForSignIn(e.target.value);
                    setEmailSignInError('');
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && sendEmailSignInLink()}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 mb-4"
                  disabled={sendingEmailLink}
                />

                {emailSignInError && (
                  <p className="text-red-600 text-sm mb-4">{emailSignInError}</p>
                )}

                <button
                  onClick={sendEmailSignInLink}
                  disabled={sendingEmailLink}
                  className="w-full bg-neutral-900 text-white py-3 rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium mb-3"
                >
                  {sendingEmailLink ? 'Sending...' : 'Send Sign-In Link'}
                </button>

                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-neutral-200"></div>
                  <span className="text-sm text-neutral-500">or</span>
                  <div className="flex-1 h-px bg-neutral-200"></div>
                </div>

                <button
                  onClick={signInWithGoogle}
                  className="w-full bg-white border border-neutral-300 text-neutral-900 py-3 rounded-lg hover:bg-neutral-50 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>

                <p className="text-xs text-neutral-500 text-center mt-4">
                  By signing in, you agree to sync your brands and collections across devices.
                </p>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-neutral-900">Check Your Email! 📧</h2>
                  <button onClick={() => {
                    setShowEmailSignIn(false);
                    setEmailLinkSent(false);
                    setEmailForSignIn('');
                  }} className="text-neutral-400 hover:text-neutral-600">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-green-800 font-medium mb-2">Sign-in link sent!</p>
                  <p className="text-green-700 text-sm">We sent a sign-in link to:</p>
                  <p className="text-green-900 font-semibold">{emailForSignIn}</p>
                </div>

                <p className="text-neutral-600 mb-4">
                  Click the link in your email to complete sign-in. The link is valid for 24 hours.
                </p>

                <p className="text-sm text-neutral-500 mb-4">
                  💡 Tip: You can click the link on any device - your brands will sync automatically!
                </p>

                <button
                  onClick={() => {
                    setEmailLinkSent(false);
                    setEmailSignInError('');
                  }}
                  className="text-neutral-600 hover:text-neutral-900 text-sm font-medium"
                >
                  ← Didn't get it? Try again
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {showRecommendModal && (
        <RecommendBrandModal
          onClose={() => setShowRecommendModal(false)}
          onSubmit={submitBrandRecommendation}
          brandName={recommendBrand}
          setBrandName={setRecommendBrand}
          email={recommendEmail}
          setEmail={setRecommendEmail}
          submitting={recommendSubmitting}
          success={recommendSuccess}
        />
      )}
    </div>
  );
}
