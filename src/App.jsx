import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, X, TrendingUp, Tag, ExternalLink, Download, Upload, LogIn, LogOut, User, Cloud, CloudOff, RefreshCw, Heart, Check, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { db } from './firebase';
import { doc, setDoc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import emailjs from '@emailjs/browser';

// Initialize EmailJS
emailjs.init('Sd_bcL3te3ni6Yydo');


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
      { name: 'Gymshark', category: 'Fashion' }
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
      { name: 'Pelagic', category: 'Outdoor' }
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
  },
  {
    id: 12,
    name: 'Running & Performance',
    description: 'Top brands for serious runners and athletes',
    brands: [
      { name: 'Hoka', category: 'Footwear' },
      { name: 'New Balance', category: 'Footwear' },
      { name: 'Asics', category: 'Footwear' },
      { name: 'Salomon', category: 'Footwear' },
      { name: 'Reebok', category: 'Footwear' },
      { name: 'Puma', category: 'Footwear' }
    ]
  },
  {
    id: 13,
    name: 'Premium Outdoor',
    description: 'Technical gear for outdoor enthusiasts',
    brands: [
      { name: 'Patagonia', category: 'Outdoor' },
      { name: 'Arc\'teryx', category: 'Outdoor' },
      { name: 'REI Co-op', category: 'Outdoor' },
      { name: 'Mammut', category: 'Outdoor' },
      { name: 'Salomon', category: 'Outdoor' }
    ]
  },
  {
    id: 14,
    name: 'Contemporary Chic',
    description: 'Modern, sophisticated everyday style',
    brands: [
      { name: 'Theory', category: 'Fashion' },
      { name: 'Vince', category: 'Fashion' },
      { name: 'Rag & Bone', category: 'Fashion' },
      { name: 'J.Crew', category: 'Fashion' },
      { name: 'Banana Republic', category: 'Fashion' },
      { name: 'Reformation', category: 'Fashion' },
      { name: 'Aritzia', category: 'Fashion' }
    ]
  },
  {
    id: 15,
    name: 'Women\'s Fashion Forward',
    description: 'Trendy, Instagram-worthy brands',
    brands: [
      { name: 'Reformation', category: 'Fashion' },
      { name: 'Aritzia', category: 'Fashion' },
      { name: 'Anthropologie', category: 'Fashion' },
      { name: 'Outdoor Voices', category: 'Fashion' },
      { name: 'Sweaty Betty', category: 'Fashion' }
    ]
  },
  {
    id: 16,
    name: 'Men\'s Essentials',
    description: 'Modern menswear staples',
    brands: [
      { name: 'Bonobos', category: 'Fashion' },
      { name: 'Untuckit', category: 'Fashion' },
      { name: 'J.Crew', category: 'Fashion' },
      { name: 'Banana Republic', category: 'Fashion' },
      { name: 'Theory', category: 'Fashion' }
    ]
  },
  {
    id: 17,
    name: 'Sneaker Culture',
    description: 'Classic and contemporary sneaker brands',
    brands: [
      { name: 'Converse', category: 'Footwear' },
      { name: 'Vans', category: 'Footwear' },
      { name: 'New Balance', category: 'Footwear' },
      { name: 'Nike', category: 'Footwear' },
      { name: 'Adidas', category: 'Footwear' },
      { name: 'Puma', category: 'Footwear' }
    ]
  },
  {
    id: 18,
    name: 'Denim & Basics',
    description: 'Quality denim and wardrobe essentials',
    brands: [
      { name: 'Levi\'s', category: 'Fashion' },
      { name: 'AG Jeans', category: 'Fashion' },
      { name: 'Everlane', category: 'Fashion' },
      { name: 'Madewell', category: 'Fashion' }
    ]
  },
  {
    id: 19,
    name: 'Accessories & Eyewear',
    description: 'Finish your look with these essentials',
    brands: [
      { name: 'Warby Parker', category: 'Accessories' },
      { name: 'Tiffany & Co.', category: 'Accessories' },
      { name: 'Ray-Ban', category: 'Accessories' },
      { name: 'Oakley', category: 'Accessories' },
      { name: 'Costa', category: 'Accessories' }
    ]
  },
  {
    id: 20,
    name: 'Travel & Luggage',
    description: 'Premium bags and travel gear',
    brands: [
      { name: 'Away', category: 'Accessories' },
      { name: 'Samsonite', category: 'Accessories' },
      { name: 'Tumi', category: 'Accessories' }
    ]
  }
];

const ALL_AVAILABLE_BRANDS = [
  'Abercrombie & Fitch', 'Adidas', 'AG Jeans', 'Allbirds', 'Alo', 'American Giant', 'Anthropologie', 'Arc\'teryx', 'Ariat', 'Aritzia', 'Asics', 'Athleta', 'Away', 'Banana Republic', 'BIRKENSTOCK',
  'Bombas', 'Bonobos', 'Brooks Brothers', 'Burberry', 'Burlebo', 'Carhartt', 'Chloé', 'Christian Louboutin',
  'Chubbies', 'Cinch', 'Clarks', 'Coach', 'Cole Haan', 'Columbia', 'Converse', 'Costa', 'Crocs', 'Cruel Girl', 'Cult Gaia',
  'Dacor', 'Dolce & Gabbana', 'Donna Karan', 'Dr. Martens', 'Estée Lauder', 'Everlane', 'Fendi', 'Feragamo', 'Free People',
  'Gorjana', 'Goyard', 'Gucci', 'Gymshark', 'Havaianas', 'Hermès', 'Hoka', 'J.Crew', 'Jimmy Choo', 'Justin Boots', 'Kate Spade', 'Kendra Scott', 'Kith', 'Lacoste',
  'Levi\'s', 'Levi Strauss', 'Louis Vuitton', 'Lucchese', 'Lululemon', 'Lush', 'Madewell', 'Mammut', 'Marc Jacobs',
  'Michael Kors', 'New Balance', 'Nike', 'Oakley', 'OluKai', 'On Running', 'OOFOS', 'Oscar de la Renta', 'Outdoor Voices', 'Panhandle Slim', 'Patagonia', 'Pelagic', 'Peter Millar', 'Polo Ralph Lauren',
  'Poncho Outdoors', 'Prada', 'Puma', 'Rag & Bone', 'Ray-Ban', 'Reebok', 'Reef', 'Reformation', 'REI Co-op', 'Rhone', 'Saint Laurent', 'Salomon', 'Samsonite', 'Sanuk', 'Spanx', 'Stetson', 'Stuart Weitzman', 'Sweaty Betty',
  'Teva', 'The North Face', 'The Row', 'Theory', 'Thom Browne', 'Tiffany & Co.', 'Tom Ford', 'Tommy Bahama', 'Tony Lama',
  'Tory Burch', 'TravisMatthew', 'Trendia', 'Tumi', 'UGG', 'Under Armour', 'Untuckit', 'Vans', 'Vera Wang', 'Vince',
  'Vineyard Vines', 'Vuori', 'Warby Parker', 'Wrangler', 'Yeti', 'YoungLA'
];

function LuxuryDealCard({ deal, onAddToBag, onDealClick }) {
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
    setTimeout(() => setAddedToBag(false), 2000);
  };

  const handleClick = () => {
    if (onDealClick) {
      onDealClick(deal.link);
    }
  };

  const discountPercent = parseInt(deal.discount);
  const savings = deal.originalPrice - deal.salePrice;

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group block bg-white rounded-xl md:rounded-2xl overflow-hidden border border-neutral-200 hover:border-neutral-300 transition-all duration-300 hover:shadow-luxury cursor-pointer"
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
    </div>
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

function ShoppingBagModal({ bag, onClose, onRemove, onCheckout, onClear, shippingProfile }) {
  const totalItems = bag.length;
  const totalValue = bag.reduce((sum, item) => sum + item.salePrice, 0);
  const totalSavings = bag.reduce((sum, item) => sum + (item.originalPrice - item.salePrice), 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
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
            <div className="mt-4 pt-4 border-t border-neutral-200">
              <p className="text-xs text-neutral-500 text-center">
                💡 <span className="font-medium">Affiliate Disclosure:</span> BrandSnobs earns commissions on purchases made through our links. This helps keep our service free.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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
  const [searchQuery, setSearchQuery] = useState('');
  const [dealSort, setDealSort] = useState('discount');
  const [dealFilter, setDealFilter] = useState('all');
  const [shoppingBag, setShoppingBag] = useState(() => {
    const saved = localStorage.getItem('shoppingBag');
    return saved ? JSON.parse(saved) : [];
  });
  const [showBagModal, setShowBagModal] = useState(false);
  const [collapsedCollections, setCollapsedCollections] = useState([]);
  const [showRecommendModal, setShowRecommendModal] = useState(false);
  const [recommendBrand, setRecommendBrand] = useState('');
  const [recommendEmail, setRecommendEmail] = useState('');
  const [recommendSubmitting, setRecommendSubmitting] = useState(false);
  const [recommendSuccess, setRecommendSuccess] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfService, setShowTermsOfService] = useState(false);

  // Simple Email-as-Username Auth States
  const [showSignIn, setShowSignIn] = useState(false);
  const [email, setEmail] = useState('');
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState('');

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
      shirtSize: '',
      pantsWaist: '',
      pantsInseam: '',
      shoeSize: '',
      dressSize: ''
    };
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...defaultProfile, ...parsed };
      } catch (error) {
        console.error('Error parsing shipping profile:', error);
        return defaultProfile;
      }
    }
    return defaultProfile;
  });

  const toggleCollectionCollapse = (collectionName) => {
    setCollapsedCollections(prev =>
      prev.includes(collectionName)
        ? prev.filter(c => c !== collectionName)
        : [...prev, collectionName]
    );
  };

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

  // Simple email validation
  const isValidEmail = (email) => {
    return email && email.includes('@') && email.includes('.');
  };

  // Sign in with email (no verification)
  const signIn = async () => {
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setSigningIn(true);
    setError('');

    try {
      const userEmail = email.toLowerCase().trim();
      const userDocRef = doc(db, 'users', userEmail);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        // Load existing data
        const data = userDoc.data();
        setMyBrands(data.brands || []);
        setSelectedGenders(data.genderPreferences || []);
        setShoppingBag(data.shoppingBag || []);
        setShippingProfile(data.shippingProfile || {
          firstName: '', lastName: '', email: '', phone: '',
          address: '', city: '', state: '', zip: '',
          shirtSize: '', pantsWaist: '', pantsInseam: '', shoeSize: '', dressSize: ''
        });
        console.log('✅ Loaded existing profile:', userEmail);
      } else {
        // Create new profile
        await setDoc(userDocRef, {
          email: userEmail,
          brands: [],
          genderPreferences: [],
          shoppingBag: [],
          shippingProfile: {},
          createdAt: new Date().toISOString()
        });
        console.log('✅ Created new profile:', userEmail);
      }

      // Set user and save to localStorage
      setUser({ email: userEmail });
      localStorage.setItem('userEmail', userEmail);
      setShowSignIn(false);
      setEmail('');

    } catch (error) {
      console.error('Sign in error:', error);
      setError('Failed to sign in. Please try again.');
    } finally {
      setSigningIn(false);
    }
  };

  // Sign out
  const signOut = () => {
    setUser(null);
    localStorage.removeItem('userEmail');
    setMyBrands([]);
    setSelectedGenders([]);
    setShoppingBag([]);
    console.log('✅ Signed out');
  };

  // Auto sign-in on page load
  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      const autoSignIn = async () => {
        try {
          const userDocRef = doc(db, 'users', savedEmail);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            setMyBrands(data.brands || []);
            setSelectedGenders(data.genderPreferences || []);
            setShoppingBag(data.shoppingBag || []);
            setShippingProfile(data.shippingProfile || {
              firstName: '', lastName: '', email: '', phone: '',
              address: '', city: '', state: '', zip: '',
              shirtSize: '', pantsWaist: '', pantsInseam: '', shoeSize: '', dressSize: ''
            });
            setUser({ email: savedEmail });
            console.log('✅ Auto signed in:', savedEmail);
          }
        } catch (error) {
          console.error('Auto sign-in error:', error);
        }
      };
      autoSignIn();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('myBrands', JSON.stringify(myBrands));
    
    if (user) {
      const timeoutId = setTimeout(() => {
        saveToCloud();
      }, 2000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [myBrands, user]);

  useEffect(() => {
    localStorage.setItem('shoppingBag', JSON.stringify(shoppingBag));
    
    if (user) {
      const timeoutId = setTimeout(() => {
        saveToCloud();
      }, 2000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [shoppingBag, user]);

  useEffect(() => {
    localStorage.setItem('shippingProfile', JSON.stringify(shippingProfile));
    
    if (user) {
      const timeoutId = setTimeout(() => {
        saveToCloud();
      }, 2000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [shippingProfile, user]);

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

  const saveGenderPreferences = async () => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.email), {
        genderPreferences: selectedGenders,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      console.error('Error saving gender preferences:', error);
    }
  };

  const saveToCloud = async () => {
    if (!user) {
      return;
    }
    
    if (myBrands.length === 0 && shoppingBag.length === 0 && selectedGenders.length === 0) {
      return;
    }
    
    try {
      setSyncStatus('syncing');
      await setDoc(doc(db, 'users', user.email), {
        brands: myBrands,
        genderPreferences: selectedGenders,
        shoppingBag: shoppingBag,
        shippingProfile: shippingProfile,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      setSyncStatus('synced');
      setTimeout(() => setSyncStatus('idle'), 2000);
    } catch (error) {
      console.error('saveToCloud error:', error);
      setSyncStatus('error');
    }
  };

  const restoreFromCloud = async () => {
    if (!user) return;
    try {
      setSyncStatus('syncing');
      const userDoc = await getDoc(doc(db, 'users', user.email));
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

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const handleDealClick = (url) => {
    if (isMobile) {
      window.location.href = url;
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
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

  const userCollections = [...new Set(myBrands.map(b => b.collection).filter(Boolean))];

  const getBrandImage = (brandName) => {
    const brandDeals = deals.filter(deal => 
      deal.merchant?.toLowerCase() === brandName.toLowerCase() ||
      deal.brand?.toLowerCase() === brandName.toLowerCase()
    );
    return brandDeals.length > 0 ? brandDeals[0].image : null;
  };

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
    if (shoppingBag.find(item => item.id === deal.id)) {
      return;
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
    
    const byRetailer = {};
    shoppingBag.forEach(item => {
      const retailer = item.merchant || item.retailer || 'Unknown Store';
      if (!byRetailer[retailer]) {
        byRetailer[retailer] = {
          items: [],
          total: 0
        };
      }
      byRetailer[retailer].items.push(item);
      byRetailer[retailer].total += item.salePrice || 0;
    });

    const retailerCount = Object.keys(byRetailer).length;
    const totalAmount = shoppingBag.reduce((sum, item) => sum + (item.salePrice || 0), 0);

    const retailerSummary = Object.entries(byRetailer)
      .map(([retailer, data]) => 
        `  • ${retailer}: ${data.items.length} item${data.items.length > 1 ? 's' : ''} ($${data.total.toFixed(2)})`
      )
      .join('\n');

    const proceed = confirm(
      `🛍️ Ready to checkout?\n\n` +
      `You're buying from ${retailerCount} store${retailerCount > 1 ? 's' : ''}:\n\n` +
      retailerSummary + `\n\n` +
      `Total: $${totalAmount.toFixed(2)}\n\n` +
      `We'll open ${retailerCount} tab${retailerCount > 1 ? 's' : ''} to complete your purchase.\n\n` +
      `Click OK to continue.`
    );

    if (!proceed) return;

    Object.entries(byRetailer).forEach(([retailer, data], index) => {
      setTimeout(() => {
        handleDealClick(data.items[0].link);
      }, index * 500);
    });

    clearBag();
    setShowBagModal(false);
  };

  const submitBrandRecommendation = async () => {
    if (!recommendBrand.trim()) return;
    
    setRecommendSubmitting(true);
    
    try {
      // Save to Firestore
      const recommendationRef = collection(db, 'brand_recommendations');
      await setDoc(doc(recommendationRef), {
        brandName: recommendBrand.trim(),
        submitterEmail: recommendEmail.trim() || 'Not provided',
        userEmail: user?.email || 'Anonymous',
        submittedAt: new Date().toISOString(),
        status: 'pending'
      });
      
      console.log('✅ Recommendation saved to Firestore');
      
      // Send email via EmailJS
      try {
        await emailjs.send(
          'service_s5lxkpl',
          'template_brand_rec',
          {
            brand_name: recommendBrand.trim(),
            submitter_email: recommendEmail.trim() || 'Not provided',
            user_email: user?.email || 'Anonymous',
            to_email: 'admin@brandsnobs.com'
          },
          'Sd_bcL3te3ni6Yydo'
        );
        console.log('✅ Email sent to admin@brandsnobs.com');
      } catch (emailError) {
        console.error('⚠️ Email failed but Firestore saved:', emailError);
      }
      
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
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(deal => 
        deal.product.toLowerCase().includes(query) ||
        deal.brand.toLowerCase().includes(query)
      );
    }
    
    if (selectedGenders.length > 0) {
      result = result.filter(deal => {
        if (deal.gender) {
          return selectedGenders.includes(deal.gender) || deal.gender === 'unisex';
        }
        return true;
      });
    }
    
    if (dealFilter === '>30%') {
      result = result.filter(deal => parseInt(deal.discount) >= 30);
    } else if (dealFilter === '>50%') {
      result = result.filter(deal => parseInt(deal.discount) >= 50);
    }
    
    const hasSizePreferences = shippingProfile?.shirtSize || shippingProfile?.shoeSize || 
                                shippingProfile?.pantsWaist || shippingProfile?.pantsInseam || 
                                shippingProfile?.dressSize;
    
    if (hasSizePreferences) {
      result = result.map(deal => {
        const productLower = (deal.product || '').toLowerCase();
        let sizeMatchScore = 0;
        
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
    
    const sorted = [...result];
    if (dealSort === 'discount') {
      sorted.sort((a, b) => {
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

  const hotBrand = React.useMemo(() => {
    if (myBrands.length === 0 || filteredDeals.length === 0) return null;
    
    const brandStats = {};
    filteredDeals.forEach(deal => {
      const brand = deal.merchant || deal.brand;
      if (!brand) return;
      
      if (!brandStats[brand]) {
        brandStats[brand] = {
          name: brand,
          deals: [],
          totalDiscount: 0
        };
      }
      brandStats[brand].deals.push(deal);
      brandStats[brand].totalDiscount += parseInt(deal.discount || 0);
    });
    
    let bestBrand = null;
    let bestAvg = 0;
    
    Object.values(brandStats).forEach(brand => {
      const avgDiscount = brand.totalDiscount / brand.deals.length;
      if (avgDiscount > bestAvg) {
        bestAvg = avgDiscount;
        bestBrand = {
          name: brand.name,
          avgDiscount: Math.round(avgDiscount),
          dealCount: brand.deals.length
        };
      }
    });
    
    return bestBrand;
  }, [myBrands, filteredDeals]);

  const stats = {
    totalBrands: myBrands.length,
    totalDeals: filteredDeals.length,
    avgDiscount: filteredDeals.length > 0
      ? Math.round(filteredDeals.reduce((sum, deal) => sum + parseInt(deal.discount), 0) / filteredDeals.length)
      : 0,
    hotBrand: hotBrand
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
                      <p className="text-sm font-medium text-neutral-900">{user.email}</p>
                    </div>
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-semibold text-sm border-2 border-transparent hover:border-neutral-300 transition-colors">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                  </button>
                  <button onClick={signOut} className="bg-neutral-100 text-neutral-900 p-2 md:px-4 md:py-2 rounded-lg hover:bg-neutral-200 transition-colors flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    <span className="hidden md:inline">Sign Out</span>
                  </button>
                </div>
              ) : (
                <button onClick={() => setShowSignIn(true)} className="bg-neutral-900 text-white px-3 md:px-6 py-2 rounded-lg hover:bg-neutral-800 transition-colors flex items-center gap-2 text-sm">
                  <LogIn className="w-4 h-4" />
                  <span className="hidden md:inline">Sign In</span>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
                <div className="text-sm text-neutral-500 mb-1">Brands Tracked</div>
                <div className="font-display text-3xl font-bold text-neutral-900">{stats.totalBrands}</div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
                <div className="text-sm text-neutral-500 mb-1">Active Deals</div>
                <div className="font-display text-3xl font-bold text-neutral-900">{stats.totalDeals}</div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
                <div className="text-sm text-neutral-500 mb-1">🔥 Hot Brand</div>
                {stats.hotBrand ? (
                  <button
                    onClick={() => setSearchQuery(stats.hotBrand.name)}
                    className="w-full text-left hover:bg-neutral-50 rounded-lg p-2 -m-2 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {getBrandImage(stats.hotBrand.name) && (
                        <img 
                          src={getBrandImage(stats.hotBrand.name)} 
                          alt={stats.hotBrand.name}
                          className="w-12 h-12 object-contain rounded-lg bg-neutral-50 p-1 flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-display text-xl font-bold text-green-600 truncate">{stats.hotBrand.name}</div>
                        <div className="text-sm text-neutral-600">{stats.hotBrand.avgDiscount}% avg • {stats.hotBrand.dealCount} deals</div>
                      </div>
                    </div>
                  </button>
                ) : (
                  <div className="font-display text-xl font-bold text-neutral-400">Add brands</div>
                )}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">💡 Affiliate Disclosure:</span> BrandSnobs participates in affiliate programs and earns commissions on purchases made through links on this site. This helps keep BrandSnobs free for everyone.
              </p>
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

            {!dealsLoading && !dealsError && myBrands.length > 0 && (
              <div>
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
                        {filteredDeals.map(deal => <LuxuryDealCard key={deal.id} deal={deal} onAddToBag={addToBag} onDealClick={handleDealClick} />)}
                      </div>
                    )}
                  </div>
                ) : (
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
                                    {collectionDeals.map(deal => <LuxuryDealCard key={deal.id} deal={deal} onAddToBag={addToBag} onDealClick={handleDealClick} />)}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                        {filteredDeals.map(deal => <LuxuryDealCard key={deal.id} deal={deal} onAddToBag={addToBag} onDealClick={handleDealClick} />)}
                      </div>
                    )}

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
                                {uncollectedDeals.map(deal => <LuxuryDealCard key={deal.id} deal={deal} onAddToBag={addToBag} onDealClick={handleDealClick} />)}
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
                        {brandsInCollection.map(brand => {
                          const brandImage = getBrandImage(brand.name);
                          return (
                            <div key={brand.id} className="flex items-center gap-3 bg-neutral-50 px-4 py-3 rounded-xl border border-neutral-200 hover:shadow-sm transition-shadow">
                              {brandImage && (
                                <img 
                                  src={brandImage} 
                                  alt={brand.name}
                                  className="w-10 h-10 object-contain rounded-lg bg-white p-1"
                                />
                              )}
                              <span className="font-medium text-neutral-800 flex-1">{brand.name}</span>
                              <button onClick={() => removeBrand(brand.id)} className="text-red-500 hover:text-red-700 transition-colors">
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                {myBrands.filter(b => !b.collection).length > 0 && (
                  <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
                    <h3 className="font-semibold text-lg text-neutral-800 mb-4">Uncategorized</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {myBrands.filter(b => !b.collection).map(brand => {
                        const brandImage = getBrandImage(brand.name);
                        return (
                          <div key={brand.id} className="flex items-center gap-3 bg-neutral-50 px-4 py-3 rounded-xl border border-neutral-200 hover:shadow-sm transition-shadow">
                            {brandImage && (
                              <img 
                                src={brandImage} 
                                alt={brand.name}
                                className="w-10 h-10 object-contain rounded-lg bg-white p-1"
                              />
                            )}
                            <span className="font-medium text-neutral-800 flex-1">{brand.name}</span>
                            <button onClick={() => removeBrand(brand.id)} className="text-red-500 hover:text-red-700 transition-colors">
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        );
                      })}
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
                        {collection.brands.map((brand, idx) => {
                          const brandImage = getBrandImage(brand.name);
                          return (
                            <div key={idx} className="flex items-center gap-3 bg-neutral-50 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors">
                              {brandImage && (
                                <img 
                                  src={brandImage} 
                                  alt={brand.name}
                                  className="w-8 h-8 object-contain rounded bg-white p-1"
                                />
                              )}
                              <span className="font-medium text-neutral-800">{brand.name}</span>
                            </div>
                          );
                        })}
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

      {showSignIn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-neutral-900">Sign In to BrandSnobs</h2>
              <button onClick={() => {
                setShowSignIn(false);
                setEmail('');
                setError('');
              }} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-neutral-600 mb-6">
              Enter your email to access your brands on any device.
            </p>

            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              onKeyPress={(e) => e.key === 'Enter' && signIn()}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 mb-4"
              disabled={signingIn}
              autoFocus
            />

            {error && (
              <p className="text-red-600 text-sm mb-4">{error}</p>
            )}

            <button
              onClick={signIn}
              disabled={signingIn || !email}
              className="w-full bg-neutral-900 text-white py-3 rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium mb-3"
            >
              {signingIn ? 'Signing In...' : 'Continue'}
            </button>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                💡 <span className="font-semibold">No password needed!</span> Same email = same brands on all devices.
              </p>
            </div>
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

      <footer className="bg-white border-t border-neutral-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-6 text-sm text-neutral-600">
              <button onClick={() => setShowHowItWorks(true)} className="hover:text-neutral-900 transition-colors">How It Works</button>
              <button onClick={() => setShowPrivacyPolicy(true)} className="hover:text-neutral-900 transition-colors">Privacy Policy</button>
              <button onClick={() => setShowTermsOfService(true)} className="hover:text-neutral-900 transition-colors">Terms of Service</button>
            </div>
            <div className="bg-neutral-50 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-xs text-neutral-600">
                <span className="font-semibold">Affiliate Disclosure:</span> BrandSnobs participates in affiliate marketing programs including CJ Affiliate, ShareASale, and Impact. We earn commissions on purchases made through our links. This helps keep BrandSnobs free for everyone.
              </p>
            </div>
            <p className="text-sm text-neutral-500">
              © 2026 BrandSnobs. You Like What You Like.
            </p>
          </div>
        </div>
      </footer>

      {showHowItWorks && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-neutral-900">How It Works</h2>
              <button onClick={() => setShowHowItWorks(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="prose prose-neutral max-w-none">
              <h3>Find Deals on YOUR Favorite Brands</h3>
              
              <h4>1. Add Your Brands</h4>
              <p>Tell us which brands you love - we'll track deals just for you. Unlike other deal sites that show you everything, we only show deals on brands YOU care about.</p>
              
              <h4>2. Browse Curated Deals</h4>
              <p>See the latest sales, discounts, and promotions on your brands across ALL retailers. We search department stores, brand websites, outdoor retailers, and more!</p>
              
              <h4>3. Add to Bag</h4>
              <p>Found something you like? Add it to your BrandSnobs shopping bag. Group items by retailer to streamline checkout.</p>
              
              <h4>4. Checkout</h4>
              <p>Complete your purchase on the retailer's website.</p>
              <p><strong>Why not checkout on BrandSnobs?</strong></p>
              <ul>
                <li>Your payment info stays secure with trusted retailers</li>
                <li>You earn retailer rewards points</li>
                <li>Easy returns through the retailer</li>
                <li>Retailer handles shipping and customer service</li>
              </ul>
              <p>We're a deal discovery platform - we find the deals, retailers handle the transaction.</p>
              
              <h4>5. Sign In to Sync</h4>
              <p>Create an account to sync your brands and deals across all your devices. PC, phone, tablet - your brands follow you everywhere.</p>
              
              <h3>Why BrandSnobs?</h3>
              <p><strong>You Like What You Like</strong> - We don't use algorithms to "suggest" brands. You tell us exactly which brands you want, and we find the deals.</p>
              <p><strong>Save Time</strong> - No more checking 10 different websites. See all your brand deals in one place.</p>
              <p><strong>Never Miss a Sale</strong> - New deals added daily from retailers across the web.</p>
            </div>
          </div>
        </div>
      )}

      {showPrivacyPolicy && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-neutral-900">Privacy Policy</h2>
              <button onClick={() => setShowPrivacyPolicy(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="prose prose-neutral max-w-none text-sm">
              <p><strong>Effective Date:</strong> February 24, 2026</p>
              
              <h3>Information We Collect</h3>
              <p><strong>Information You Provide:</strong></p>
              <ul>
                <li>Email address (when you sign in)</li>
                <li>Brand preferences (brands you add to your list)</li>
                <li>Shopping bag items (deals you save)</li>
                <li>Size preferences (optional, for filtering deals)</li>
              </ul>
              
              <p><strong>Automatically Collected:</strong></p>
              <ul>
                <li>Device information (browser type, operating system)</li>
                <li>Usage data (pages viewed, deals clicked)</li>
                <li>Cookies (for authentication and preferences)</li>
              </ul>
              
              <h3>How We Use Your Information</h3>
              <p>We use your information to:</p>
              <ul>
                <li>Provide and improve our services</li>
                <li>Show you relevant deals on your favorite brands</li>
                <li>Sync your preferences across devices</li>
              </ul>
              
              <h3>Information Sharing</h3>
              <p>We do NOT sell your personal information. We may share with affiliate networks to track purchases and analytics providers (aggregated data only).</p>
              
              <h3>Affiliate Disclosure</h3>
              <p>BrandSnobs participates in affiliate marketing programs. When you purchase through our links, we may earn a commission. This helps us keep BrandSnobs free.</p>
              
              <h3>Your Rights</h3>
              <p>You have the right to access your data, delete your account, and update your preferences.</p>
              
              <p className="mt-6 text-neutral-500"><em>Last updated: February 24, 2026</em></p>
            </div>
          </div>
        </div>
      )}

      {showTermsOfService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-neutral-900">Terms of Service</h2>
              <button onClick={() => setShowTermsOfService(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="prose prose-neutral max-w-none text-sm">
              <p><strong>Effective Date:</strong> February 24, 2026</p>
              
              <h3>What BrandSnobs Does</h3>
              <p>BrandSnobs is a deal discovery platform. We show you deals on brands you care about, aggregate sales from multiple retailers, and provide links to retailers' websites.</p>
              
              <p><strong>We do NOT:</strong></p>
              <ul>
                <li>Process payments (purchases happen on retailer sites)</li>
                <li>Handle shipping or fulfillment</li>
                <li>Provide customer service for purchases</li>
                <li>Guarantee product availability or pricing</li>
              </ul>
              
              <h3>Acceptable Use</h3>
              <p>You agree NOT to scrape our data, interfere with the platform, violate any laws, or upload malicious code.</p>
              
              <h3>Affiliate Links & Commissions</h3>
              <p>BrandSnobs earns commissions on purchases made through our links. This helps us keep the service free. Clicking our links means you consent to affiliate tracking.</p>
              
              <h3>Third-Party Websites</h3>
              <p>When you click a deal, you're redirected to retailer websites. We're not responsible for retailer policies, pricing, availability, product quality, or customer service.</p>
              
              <h3>Disclaimers</h3>
              <p>BrandSnobs is provided "as is" without warranties. We don't guarantee continuous availability, error-free operation, or deal accuracy. Deals are subject to change without notice.</p>
              
              <h3>Limitation of Liability</h3>
              <p>BrandSnobs is not liable for purchases made through our links, retailer errors, product defects, shipping delays, or missed deals.</p>
              
              <p className="mt-6 text-neutral-500"><em>Last updated: February 24, 2026</em></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
