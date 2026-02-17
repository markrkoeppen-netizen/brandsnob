import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, X, TrendingUp, Tag, ExternalLink, Download, Upload, LogIn, LogOut, User, Cloud, CloudOff, RefreshCw, Heart, Check, Search } from 'lucide-react';
import { auth, googleProvider, db } from './firebase';
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';

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
      { name: 'Michael Kors', category: 'Fashion' },
      { name: 'Tory Burch', category: 'Fashion' },
      { name: 'Kate Spade', category: 'Accessories' },
      { name: 'Marc Jacobs', category: 'Fashion' },
      { name: 'Donna Karan', category: 'Fashion' },
      { name: 'Vera Wang', category: 'Fashion' },
      { name: 'Oscar de la Renta', category: 'Fashion' },
      { name: 'Tom Ford', category: 'Fashion' }
    ]
  },
  {
    id: 5,
    name: 'Casual & Lifestyle',
    description: 'Everyday luxury and comfort',
    brands: [
      { name: 'Polo Ralph Lauren', category: 'Fashion' },
      { name: 'Tommy Bahama', category: 'Fashion' },
      { name: 'Vineyard Vines', category: 'Fashion' },
      { name: 'Lacoste', category: 'Fashion' },
      { name: 'Abercrombie & Fitch', category: 'Fashion' },
      { name: 'Madewell', category: 'Fashion' },
      { name: 'Kith', category: 'Fashion' },
      { name: 'Brooks Brothers', category: 'Fashion' },
      { name: 'Chubbies', category: 'Fashion' },
      { name: 'TravisMatthew', category: 'Fashion' },
      { name: 'Rhone', category: 'Fashion' }
    ]
  },
  {
    id: 6,
    name: 'Footwear & Comfort',
    description: 'Comfort meets style',
    brands: [
      { name: 'UGG', category: 'Footwear' },
      { name: 'BIRKENSTOCK', category: 'Footwear' },
      { name: 'Crocs', category: 'Footwear' },
      { name: 'Allbirds', category: 'Footwear' },
      { name: 'Bombas', category: 'Accessories' }
    ]
  },
  {
    id: 7,
    name: 'Eyewear & Accessories',
    description: 'Premium sunglasses and accessories',
    brands: [
      { name: 'Ray-Ban', category: 'Accessories' },
      { name: 'Oakley', category: 'Accessories' },
      { name: 'Costa', category: 'Accessories' },
      { name: 'Kendra Scott', category: 'Jewelry' }
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
    id: 10,
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
  'Abercrombie & Fitch', 'Adidas', 'Allbirds', 'Alo', 'Athleta', 'BIRKENSTOCK',
  'Bombas', 'Brooks Brothers', 'Burberry', 'Burlebo', 'Chloé', 'Christian Louboutin',
  'Chubbies', 'Coach', 'Cole Haan', 'Columbia', 'Costa', 'Crocs', 'Cult Gaia',
  'Dacor', 'Dolce & Gabbana', 'Donna Karan', 'Estée Lauder', 'Fendi', 'Feragamo',
  'Gucci', 'Hermès', 'Jimmy Choo', 'Kate Spade', 'Kendra Scott', 'Kith', 'Lacoste',
  'Louis Vuitton', 'Lucchese', 'Lululemon', 'Lush', 'Madewell', 'Marc Jacobs',
  'Michael Kors', 'Nike', 'Oakley', 'On Running', 'Oscar de la Renta', 'Polo Ralph Lauren',
  'Poncho Outdoors', 'Prada', 'Ray-Ban', 'Rhone', 'Saint Laurent', 'Stuart Weitzman',
  'The North Face', 'The Row', 'Thom Browne', 'Tom Ford', 'Tommy Bahama',
  'Tory Burch', 'TravisMatthew', 'Tumi', 'UGG', 'Under Armour', 'Vera Wang',
  'Vineyard Vines', 'Vuori', 'Yeti', 'YoungLA'
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
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">Shopping Preferences</h3>
          <p className="text-sm text-neutral-500">Select categories to personalize your deals</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {GENDER_OPTIONS.map((option) => {
          const isSelected = selectedGenders.includes(option.id);
          
          return (
            <button
              key={option.id}
              onClick={() => toggleGender(option.id)}
              className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${isSelected ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-200 bg-white hover:border-neutral-300'}`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-neutral-900 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              
              <div className="text-3xl mb-2">{option.icon}</div>
              <div className={`text-sm font-medium ${isSelected ? 'text-neutral-900' : 'text-neutral-600'}`}>
                {option.label}
              </div>
            </button>
          );
        })}
      </div>

      {selectedGenders.length === 0 && (
        <div className="mt-4 text-center text-sm text-neutral-400">
          Select at least one category to see personalized deals
        </div>
      )}
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
              Checkout All ({totalItems} item{totalItems !== 1 ? 's' : ''})
            </button>
            <p className="text-xs text-neutral-500 text-center mt-3">
              Opens each retailer in a new tab with items ready to checkout
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

  // Brand Recommendation
  const [showRecommendModal, setShowRecommendModal] = useState(false);
  const [recommendBrand, setRecommendBrand] = useState('');
  const [recommendEmail, setRecommendEmail] = useState('');
  const [recommendSubmitting, setRecommendSubmitting] = useState(false);
  const [recommendSuccess, setRecommendSuccess] = useState(false);

  // Shipping Profile
  const [shippingProfile, setShippingProfile] = useState(() => {
    const saved = localStorage.getItem('shippingProfile');
    return saved ? JSON.parse(saved) : {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip: ''
    };
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadUserData(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const savedBrands = localStorage.getItem('myBrands');
    if (savedBrands) {
      setMyBrands(JSON.parse(savedBrands));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('myBrands', JSON.stringify(myBrands));
    if (user) {
      saveToCloud();
    }
  }, [myBrands, user]);

  useEffect(() => {
    localStorage.setItem('shoppingBag', JSON.stringify(shoppingBag));
  }, [shoppingBag]);

  useEffect(() => {
    localStorage.setItem('shippingProfile', JSON.stringify(shippingProfile));
  }, [shippingProfile]);

  useEffect(() => {
    const savedGenders = localStorage.getItem('selectedGenders');
    if (savedGenders) {
      setSelectedGenders(JSON.parse(savedGenders));
    }
  }, []);

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
    if (!user) return;
    try {
      setSyncStatus('syncing');
      await setDoc(doc(db, 'users', user.uid), {
        brands: myBrands,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      setSyncStatus('synced');
      setTimeout(() => setSyncStatus('idle'), 2000);
    } catch (error) {
      console.error('Error syncing:', error);
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
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Sign in error:', error);
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
      // Using EmailJS or similar service - you'll need to set this up
      // For now, we'll use a simple fetch to a serverless function
      await fetch('https://formsubmit.co/ajax/admin@brandsnobs.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          brand: recommendBrand,
          email: recommendEmail || 'Not provided',
          userEmail: user?.email || 'Anonymous',
          date: new Date().toISOString()
        })
      });
      
      setRecommendSuccess(true);
      setTimeout(() => {
        setShowRecommendModal(false);
        setRecommendBrand('');
        setRecommendEmail('');
        setRecommendSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Error submitting recommendation:', error);
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
    
    // Sorting
    const sorted = [...result];
    if (dealSort === 'discount') {
      sorted.sort((a, b) => parseInt(b.discount) - parseInt(a.discount));
    } else if (dealSort === 'price-low') {
      sorted.sort((a, b) => a.salePrice - b.salePrice);
    } else if (dealSort === 'price-high') {
      sorted.sort((a, b) => b.salePrice - a.salePrice);
    } else if (dealSort === 'brand') {
      sorted.sort((a, b) => a.brand.localeCompare(b.brand));
    }
    
    return sorted;
  }, [deals, searchQuery, selectedGenders, dealFilter, dealSort]);

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
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <ShoppingBag className="w-8 h-8 text-neutral-900" />
                <div className="text-left">
                  <h1 className="font-display text-2xl font-bold text-neutral-900">Brandsnobs</h1>
                  <p className="text-xs text-neutral-500 tracking-wide">CURATED BRAND DEALS</p>
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
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-neutral-900">{user.displayName}</p>
                    <p className="text-xs text-neutral-500">{user.email}</p>
                  </div>
                  {user.photoURL && <img src={user.photoURL} alt={user.displayName} className="w-10 h-10 rounded-full" />}
                  <button onClick={signOut} className="bg-neutral-100 text-neutral-900 px-4 py-2 rounded-lg hover:bg-neutral-200 transition-colors flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <button onClick={signIn} className="bg-neutral-900 text-white px-6 py-2 rounded-lg hover:bg-neutral-800 transition-colors flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Sign In with Google
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8">
            {['deals', 'brands', 'collections', 'recommendations', 'profile'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 transition-colors font-medium capitalize ${activeTab === tab ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-500 hover:text-neutral-700'}`}
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
                  {/* Search Bar */}
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
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-2.5 text-neutral-400"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Filter & Sort */}
                  <div className="flex gap-2 md:gap-3">
                    <select
                      value={dealFilter}
                      onChange={(e) => setDealFilter(e.target.value)}
                      className="px-3 py-2 border border-neutral-300 rounded-lg text-sm flex-1 md:flex-none"
                    >
                      <option value="all">All Deals</option>
                      <option value=">30%">30%+ Off</option>
                      <option value=">50%">50%+ Off</option>
                    </select>
                    
                    <select
                      value={dealSort}
                      onChange={(e) => setDealSort(e.target.value)}
                      className="px-3 py-2 border border-neutral-300 rounded-lg text-sm flex-1 md:flex-none"
                    >
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

            {lastUpdated && (
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-4 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>{getTimeAgo(lastUpdated)}</span>
                  <span className="text-neutral-400">•</span>
                  <span className="text-neutral-500">Deals refresh every 6 hours</span>
                </div>
                <button onClick={refreshDeals} disabled={refreshing} className="flex items-center gap-2 text-neutral-900 hover:text-neutral-700 font-medium disabled:opacity-50">
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
            )}

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

            {!dealsLoading && myBrands.length === 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-12 text-center">
                <ShoppingBag className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold text-neutral-700 mb-2">No brands yet</h3>
                <p className="text-neutral-500 mb-4">Add some brands to start seeing deals!</p>
                <button onClick={() => setActiveTab('brands')} className="bg-neutral-900 text-white px-6 py-3 rounded-lg hover:bg-neutral-800 transition-colors inline-flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add Brands
                </button>
              </div>
            )}

            {!dealsLoading && !dealsError && filteredDeals.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                {filteredDeals.map(deal => <LuxuryDealCard key={deal.id} deal={deal} onAddToBag={addToBag} />)}
              </div>
            )}

            {!dealsLoading && !dealsError && myBrands.length > 0 && filteredDeals.length === 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-12 text-center">
                <Tag className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold text-neutral-700 mb-2">No deals found</h3>
                <p className="text-neutral-500 mb-4">We couldn't find any current deals for your selected preferences.</p>
                <p className="text-sm text-neutral-400">Try adjusting your gender preferences or check back soon!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'brands' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-neutral-900">My Brands</h2>
                <p className="text-neutral-600">Track deals from your favorite brands</p>
              </div>
              <div className="flex gap-2">
                {user && (
                  <>
                    <button onClick={saveToCloud} disabled={syncStatus === 'syncing'} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50">
                      <Cloud className="w-5 h-5" />
                      Save
                    </button>
                    <button onClick={restoreFromCloud} disabled={syncStatus === 'syncing'} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50">
                      <CloudOff className="w-5 h-5" />
                      Restore
                    </button>
                  </>
                )}
                <button onClick={() => setShowAddBrand(!showAddBrand)} className="bg-neutral-900 text-white px-4 py-2 rounded-lg hover:bg-neutral-800 transition-colors flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add Brand
                </button>
                <button onClick={() => setShowRecommendModal(true)} className="bg-neutral-200 text-neutral-700 px-4 py-2 rounded-lg hover:bg-neutral-300 transition-colors flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Recommend
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

        {activeTab === 'collections' && (
          <div>
            <div className="mb-6">
              <h2 className="font-display text-2xl font-bold text-neutral-900 mb-2">My Collections</h2>
              <p className="text-neutral-600">Deals organized by your custom collections</p>
            </div>

            {userCollections.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-12 text-center">
                <Tag className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold text-neutral-700 mb-2">No collections yet</h3>
                <p className="text-neutral-500 mb-6">Go to Brands tab, add a brand and create your first collection!</p>
                <button
                  onClick={() => setActiveTab('brands')}
                  className="bg-neutral-900 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Go to Brands
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {userCollections.map(collection => {
                  const collectionBrandNames = myBrands
                    .filter(b => b.collection === collection)
                    .map(b => b.name);
                  const collectionDeals = deals.filter(d =>
                    collectionBrandNames.includes(d.brand)
                  );

                  return (
                    <div key={collection}>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-display text-xl font-bold text-neutral-900">{collection}</h3>
                          <p className="text-sm text-neutral-500">
                            {collectionBrandNames.length} brand{collectionBrandNames.length !== 1 ? 's' : ''} · {collectionDeals.length} deal{collectionDeals.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>

                      {collectionDeals.length === 0 ? (
                        <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6 text-center">
                          <p className="text-neutral-500 text-sm">No deals found yet for this collection.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                          {collectionDeals.map(deal => (
                            <LuxuryDealCard key={deal.id} deal={deal} onAddToBag={addToBag} />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
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
