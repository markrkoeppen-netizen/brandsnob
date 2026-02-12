import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, X, TrendingUp, Tag, ExternalLink, Download, Upload, LogIn, LogOut, User, Cloud, CloudOff, RefreshCw, Heart, Check } from 'lucide-react';
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
    name: 'Luxury Essentials',
    description: 'Premium brands for the discerning shopper',
    brands: [
      { name: 'Burberry', category: 'Fashion' },
      { name: 'Tumi', category: 'Travel' },
      { name: 'Rolex', category: 'Watches' },
      { name: 'Montblanc', category: 'Accessories' }
    ]
  },
  {
    id: 2,
    name: 'Athletic Performance',
    description: 'Top-tier brands for serious athletes',
    brands: [
      { name: 'Nike', category: 'Footwear' },
      { name: 'Adidas', category: 'Footwear' },
      { name: 'Alo', category: 'Fashion' },
      { name: 'Vuori', category: 'Fashion' },
      { name: 'On Running', category: 'Footwear' }
    ]
  },
  {
    id: 3,
    name: 'Outdoor Adventure',
    description: 'Gear for outdoor enthusiasts',
    brands: [
      { name: 'Yeti', category: 'Outdoor' },
      { name: 'The North Face', category: 'Fashion' },
      { name: 'Columbia', category: 'Fashion' },
      { name: 'Costa', category: 'Accessories' }
    ]
  },
  {
    id: 4,
    name: 'Casual Comfort',
    description: 'Everyday brands for relaxed style',
    brands: [
      { name: 'Gap', category: 'Fashion' },
      { name: 'Abercrombie & Fitch', category: 'Fashion' },
      { name: 'Crocs', category: 'Footwear' },
      { name: 'UGG', category: 'Footwear' },
      { name: 'Chubbies', category: 'Fashion' }
    ]
  },
  {
    id: 5,
    name: 'Tech & Innovation',
    description: 'Latest gadgets and electronics',
    brands: [
      { name: 'Apple', category: 'Tech' },
      { name: 'Samsung', category: 'Tech' },
      { name: 'Sony', category: 'Tech' }
    ]
  },
  {
    id: 6,
    name: 'Southern Coastal',
    description: 'Preppy beach and resort style',
    brands: [
      { name: 'Vineyard Vines', category: 'Fashion' },
      { name: 'Tommy Bahama', category: 'Fashion' },
      { name: 'Chubbies', category: 'Fashion' },
      { name: 'Costa', category: 'Accessories' },
      { name: 'Yeti', category: 'Outdoor' }
    ]
  }
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
    category: 'Fashion'
  },
  {
    id: 3,
    brand: 'Apple',
    reason: 'Tech enthusiast',
    product: 'AirPods Max',
    price: 549,
    image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&h=400&fit=crop',
    category: 'Tech'
  }
];

function LuxuryDealCard({ deal }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
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
      className="group block bg-white rounded-2xl overflow-hidden border border-neutral-200 hover:border-neutral-300 transition-all duration-300 hover:shadow-luxury"
    >
      <div className="relative aspect-square overflow-hidden bg-neutral-50">
        <img
          src={deal.image}
          alt={deal.product}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {discountPercent >= 30 && (
          <div className="absolute top-4 left-4 bg-neutral-900 text-white px-3 py-1.5 rounded-full text-sm font-semibold tracking-wide">
            {deal.discount} OFF
          </div>
        )}

        <button
          onClick={handleFavorite}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:bg-white hover:scale-110 ${isFavorited ? 'text-rose-500' : 'text-neutral-400'}`}
        >
          <Heart className="w-5 h-5" fill={isFavorited ? 'currentColor' : 'none'} />
        </button>

        <div className={`absolute inset-0 bg-neutral-900/80 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="bg-white px-6 py-3 rounded-full flex items-center gap-2 text-neutral-900 font-medium">
            <span>View Deal</span>
            <ExternalLink className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium tracking-widest uppercase text-neutral-500">
            {deal.brand}
          </span>
          <span className="text-xs text-neutral-400">
            {deal.retailer}
          </span>
        </div>

        <h3 className="font-display text-lg font-medium text-neutral-900 mb-3 line-clamp-2 leading-snug min-h-[3.5rem]">
          {deal.product}
        </h3>

        <div className="flex items-end justify-between mb-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-semibold text-neutral-900">
                ${deal.salePrice}
              </span>
              {deal.originalPrice > deal.salePrice && (
                <span className="text-sm text-neutral-400 line-through">
                  ${deal.originalPrice}
                </span>
              )}
            </div>
            {savings > 0 && (
              <p className="text-xs text-neutral-500 mt-1">
                Save ${savings.toFixed(2)}
              </p>
            )}
          </div>

          {discountPercent < 30 && discountPercent > 0 && (
            <div className="bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-lg text-xs font-semibold">
              {deal.discount}
            </div>
          )}
        </div>
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

export default function App() {
  const [myBrands, setMyBrands] = useState([]);
  const [showAddBrand, setShowAddBrand] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandCategory, setNewBrandCategory] = useState('Fashion');
  const [activeTab, setActiveTab] = useState('deals');
  const [user, setUser] = useState(null);
  const [syncStatus, setSyncStatus] = useState('idle');
  const [deals, setDeals] = useState([]);
  const [dealsLoading, setDealsLoading] = useState(true);
  const [dealsError, setDealsError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedGenders, setSelectedGenders] = useState([]);

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
    if (newBrandName.trim()) {
      setMyBrands([...myBrands, {
        id: Date.now(),
        name: newBrandName.trim(),
        category: newBrandCategory
      }]);
      setNewBrandName('');
      setShowAddBrand(false);
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
      category: brand.category
    }));
    setMyBrands([...myBrands, ...newBrands]);
    setActiveTab('brands');
  };

  const filteredDeals = selectedGenders.length > 0
    ? deals.filter(deal => {
        if (deal.gender) {
          return selectedGenders.includes(deal.gender) || deal.gender === 'unisex';
        }
        return true;
      })
    : deals;

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
              <ShoppingBag className="w-8 h-8 text-neutral-900" />
              <div>
                <h1 className="font-display text-2xl font-bold text-neutral-900">Brandsnobs</h1>
                <p className="text-xs text-neutral-500 tracking-wide">CURATED BRAND DEALS</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
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
            {['deals', 'brands', 'collections', 'recommendations'].map(tab => (
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
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredDeals.map(deal => <LuxuryDealCard key={deal.id} deal={deal} />)}
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
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Brand Name</label>
                    <input
                      type="text"
                      value={newBrandName}
                      onChange={(e) => setNewBrandName(e.target.value)}
                      placeholder="e.g., Nike, Apple, Yeti"
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && addBrand()}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Category</label>
                    <select
                      value={newBrandCategory}
                      onChange={(e) => setNewBrandCategory(e.target.value)}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                    >
                      {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={addBrand} className="bg-neutral-900 text-white px-6 py-2 rounded-lg hover:bg-neutral-800 transition-colors">Add Brand</button>
                  <button onClick={() => setShowAddBrand(false)} className="bg-neutral-200 text-neutral-700 px-6 py-2 rounded-lg hover:bg-neutral-300 transition-colors">Cancel</button>
                </div>
              </div>
            )}

            {myBrands.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-12 text-center">
                <ShoppingBag className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold text-neutral-700 mb-2">No brands added yet</h3>
                <p className="text-neutral-500">Click "Add Brand" to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {CATEGORIES.map(category => {
                  const brandsInCategory = myBrands.filter(b => b.category === category);
                  if (brandsInCategory.length === 0) return null;
                  return (
                    <div key={category} className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
                      <h3 className="font-semibold text-lg text-neutral-800 mb-4">{category}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {brandsInCategory.map(brand => (
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
              </div>
            )}
          </div>
        )}

        {activeTab === 'collections' && (
          <div>
            <div className="mb-6">
              <h2 className="font-display text-2xl font-bold text-neutral-900 mb-2">Brand Collections</h2>
              <p className="text-neutral-600">Curated brand lists for different lifestyles</p>
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
                            <span className="text-sm text-neutral-500">{brand.category}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button onClick={() => loadCollection(collection)} className="w-full bg-neutral-900 text-white py-3 rounded-lg hover:bg-neutral-800 transition-colors font-semibold">
                      Add All to My Brands
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div>
            <div className="mb-6">
              <h2 className="font-display text-2xl font-bold text-neutral-900 mb-2">Discover New Brands</h2>
              <p className="text-neutral-600">Based on your preferences for premium products</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {RECOMMENDATIONS.map(rec => (
                <div key={rec.id} className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img src={rec.image} alt={rec.product} className="w-full h-48 object-cover" />
                    <div className="absolute top-2 left-2 bg-neutral-900 text-white px-3 py-1 rounded-full text-xs font-semibold">Recommended</div>
                  </div>
                  <div className="p-4">
                    <div className="text-sm text-neutral-900 font-semibold mb-1">{rec.brand}</div>
                    <div className="text-xs text-neutral-500 mb-2">Because you like: {rec.reason}</div>
                    <h3 className="font-display font-bold text-lg text-neutral-800 mb-2">{rec.product}</h3>
                    <div className="font-display text-2xl font-bold text-neutral-900 mb-3">${rec.price.toLocaleString()}</div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setMyBrands([...myBrands, { id: Date.now(), name: rec.brand, category: rec.category }]);
                          setActiveTab('brands');
                        }}
                        className="flex-1 bg-neutral-900 text-white py-2 rounded-lg hover:bg-neutral-800 transition-colors text-sm"
                      >
                        Add to My Brands
                      </button>
                      <button className="flex-1 bg-neutral-200 text-neutral-700 py-2 rounded-lg hover:bg-neutral-300 transition-colors text-sm">Learn More</button>
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
