import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, X, TrendingUp, Tag, ExternalLink } from 'lucide-react';

// Mock data for demonstration
const SAMPLE_BRANDS = [
  { id: 1, name: 'Yeti', category: 'Coolers' },
  { id: 2, name: 'Patagonia', category: 'Apparel' },
  { id: 3, name: 'North Face', category: 'Apparel' },
];

const MOCK_DEALS = [
  {
    id: 1,
    brand: 'Yeti',
    product: 'Tundra 45 Cooler',
    originalPrice: 325,
    salePrice: 259,
    discount: '20%',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=400&fit=crop',
    retailer: 'Amazon'
  },
  {
    id: 2,
    brand: 'Yeti',
    product: 'Rambler 30oz Tumbler',
    originalPrice: 38,
    salePrice: 30,
    discount: '21%',
    image: 'https://images.unsplash.com/photo-1602143407946-726bfae97b0e?w=400&h=400&fit=crop',
    retailer: 'REI'
  },
  {
    id: 3,
    brand: 'Patagonia',
    product: 'Better Sweater Fleece Jacket',
    originalPrice: 139,
    salePrice: 97,
    discount: '30%',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
    retailer: 'Patagonia.com'
  },
  {
    id: 4,
    brand: 'Patagonia',
    product: 'Nano Puff Jacket',
    originalPrice: 249,
    salePrice: 174,
    discount: '30%',
    image: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=400&h=400&fit=crop',
    retailer: 'Backcountry'
  },
  {
    id: 5,
    brand: 'North Face',
    product: 'Thermoball Eco Jacket',
    originalPrice: 199,
    salePrice: 139,
    discount: '30%',
    image: 'https://images.unsplash.com/photo-1544923408-75c5cef46f14?w=400&h=400&fit=crop',
    retailer: 'The North Face'
  },
  {
    id: 6,
    brand: 'North Face',
    product: 'Borealis Backpack',
    originalPrice: 99,
    salePrice: 69,
    discount: '30%',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    retailer: 'Dick\'s Sporting Goods'
  },
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
      { name: 'Rolex', category: 'Watches' },
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
  const [myBrands, setMyBrands] = useState(SAMPLE_BRANDS);
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandCategory, setNewBrandCategory] = useState('Apparel');
  const [activeTab, setActiveTab] = useState('deals');
  const [showAddBrand, setShowAddBrand] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [dealFilter, setDealFilter] = useState('all');
  const [dealSort, setDealSort] = useState('discount');
  const [showSizeProfile, setShowSizeProfile] = useState(false);
  const [sizeProfile, setSizeProfile] = useState({
    shirt: '',
    pants: '',
    shoes: '',
    jacket: ''
  });
  const [showShareWishlist, setShowShareWishlist] = useState(false);

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

  let filteredDeals = MOCK_DEALS.filter(deal => 
    myBrands.some(brand => brand.name.toLowerCase() === deal.brand.toLowerCase())
  );

  // Apply category filter
  if (dealFilter !== 'all') {
    filteredDeals = filteredDeals.filter(deal => {
      const brand = myBrands.find(b => b.name.toLowerCase() === deal.brand.toLowerCase());
      return brand && brand.category === dealFilter;
    });
  }

  // Apply sorting
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
              {/* Classic Minimalist Luxury Logo */}
              <div className="relative">
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Elegant interlocking geometric shape */}
                  <rect x="6" y="6" width="32" height="32" stroke="#1F2937" strokeWidth="2.5" fill="none" />
                  <path d="M 22 6 L 22 38" stroke="#1F2937" strokeWidth="2.5" />
                  <path d="M 6 22 L 38 22" stroke="#1F2937" strokeWidth="2.5" />
                  <circle cx="22" cy="22" r="6" stroke="#1F2937" strokeWidth="2.5" fill="white" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-800">BrandSnob</h1>
            </div>
            <div className="text-sm text-gray-600">
              {myBrands.length} brands tracked
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
              activeTab === 'deals'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Tag className="w-4 h-4 inline mr-2" />
            Deals
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-all whitespace-nowrap ${
              activeTab === 'wishlist'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ShoppingBag className="w-4 h-4 inline mr-2" />
            Wishlist ({wishlist.length})
          </button>
          <button
            onClick={() => setActiveTab('brands')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-all whitespace-nowrap ${
              activeTab === 'brands'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ShoppingBag className="w-4 h-4 inline mr-2" />
            My Brands
          </button>
          <button
            onClick={() => setActiveTab('collections')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-all whitespace-nowrap ${
              activeTab === 'collections'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-2" />
            Collections
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-all whitespace-nowrap ${
              activeTab === 'recommendations'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
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
            <div className="mb-6 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Current Deals</h2>
                <p className="text-gray-600">Best deals from your favorite brands</p>
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
                <p className="text-sm text-gray-500 mt-3">Your sizes are saved to help you shop faster</p>
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
                          isInWishlist(deal.id) 
                            ? 'bg-red-500 text-white' 
                            : 'bg-white text-gray-600 hover:bg-gray-100'
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
                      <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                        View Deal
                        <ExternalLink className="w-4 h-4" />
                      </button>
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
                <p className="text-gray-600">Items you're tracking</p>
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
                <p className="text-gray-600 mb-4">Copy this link to share your wishlist with friends:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={`https://brandsnob.app/wishlist/${Date.now()}`}
                    readOnly
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`https://brandsnob.app/wishlist/${Date.now()}`);
                      alert('Link copied to clipboard!');
                    }}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-3">Anyone with this link can view your wishlist items</p>
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
                      <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                        View Deal
                        <ExternalLink className="w-4 h-4" />
                      </button>
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
                <p className="text-gray-600">Manage your favorite brands</p>
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
