import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, X, TrendingUp, Tag, ExternalLink, Download, Upload, LogIn, LogOut, User, Cloud, CloudOff, RefreshCw } from 'lucide-react';
import { auth, googleProvider, db } from './firebase.js';
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

// Categories for organizing brands
const CATEGORIES = [
  'Fashion', 'Footwear', 'Accessories', 'Tech', 'Home', 'Outdoor', 
  'Watches', 'Cosmetics', 'Jewelry', 'Travel'
];

export default function App() {
  // Existing state
  const [myBrands, setMyBrands] = useState([]);
  const [showAddBrand, setShowAddBrand] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandCategory, setNewBrandCategory] = useState('Fashion');
  const [activeTab, setActiveTab] = useState('deals');
  const [user, setUser] = useState(null);
  const [syncStatus, setSyncStatus] = useState('idle');
  
  // NEW: State for Firestore deals
  const [deals, setDeals] = useState([]);
  const [dealsLoading, setDealsLoading] = useState(true);
  const [dealsError, setDealsError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadUserData(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  // Load brands from localStorage
  useEffect(() => {
    const savedBrands = localStorage.getItem('myBrands');
    if (savedBrands) {
      setMyBrands(JSON.parse(savedBrands));
    }
  }, []);

  // Save brands to localStorage and cloud
  useEffect(() => {
    localStorage.setItem('myBrands', JSON.stringify(myBrands));
    if (user) {
      saveToCloud();
    }
  }, [myBrands, user]);

  // NEW: Fetch deals from Firestore when brands change
  useEffect(() => {
    if (myBrands.length > 0) {
      fetchDealsFromFirestore();
    } else {
      setDeals([]);
      setDealsLoading(false);
    }
  }, [myBrands]);

  // NEW: Fetch deals from Firestore
  const fetchDealsFromFirestore = async () => {
    if (myBrands.length === 0) {
      setDeals([]);
      setDealsLoading(false);
      return;
    }

    try {
      setDealsLoading(true);
      setDealsError(null);

      // Get brand names from myBrands
      const brandNames = myBrands.map(b => b.name);

      // Query Firestore for deals matching user's brands
      const dealsRef = collection(db, 'deals');
      
      // Firestore 'in' query supports max 10 items, so we need to batch
      const batchSize = 10;
      let allDeals = [];

      for (let i = 0; i < brandNames.length; i += batchSize) {
        const batch = brandNames.slice(i, i + batchSize);
        
        const q = query(
          dealsRef,
          where('brand', 'in', batch),
          orderBy('fetchedAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const batchDeals = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        allDeals = [...allDeals, ...batchDeals];
      }

      // Remove duplicates and sort by discount
      const uniqueDeals = Array.from(
        new Map(allDeals.map(deal => [deal.id, deal])).values()
      );

      const sortedDeals = uniqueDeals.sort((a, b) => 
        parseInt(b.discount) - parseInt(a.discount)
      );

      setDeals(sortedDeals);
      
      // Set last updated timestamp
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

  // NEW: Manual refresh deals
  const refreshDeals = async () => {
    setRefreshing(true);
    await fetchDealsFromFirestore();
    setRefreshing(false);
  };

  // NEW: Calculate time ago
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
        if (data.brands) {
          setMyBrands(data.brands);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
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

  // Calculate stats from Firestore deals
  const stats = {
    totalBrands: myBrands.length,
    totalDeals: deals.length,
    totalSavings: deals.reduce((sum, deal) => 
      sum + (deal.originalPrice - deal.salePrice), 0
    ),
    avgDiscount: deals.length > 0
      ? Math.round(deals.reduce((sum, deal) => 
          sum + parseInt(deal.discount), 0) / deals.length)
      : 0
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-indigo-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Brandsnobs</h1>
                <p className="text-sm text-indigo-200">Your Premium Brand Deals</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {syncStatus === 'syncing' && (
                <div className="flex items-center gap-2 text-indigo-200">
                  <Cloud className="w-5 h-5 animate-pulse" />
                  <span className="text-sm">Syncing...</span>
                </div>
              )}
              {syncStatus === 'synced' && (
                <div className="flex items-center gap-2 text-green-300">
                  <Cloud className="w-5 h-5" />
                  <span className="text-sm">Synced</span>
                </div>
              )}
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium">{user.displayName}</p>
                    <p className="text-xs text-indigo-200">{user.email}</p>
                  </div>
                  {user.photoURL && (
                    <img src={user.photoURL} alt={user.displayName} className="w-10 h-10 rounded-full" />
                  )}
                  <button
                    onClick={signOut}
                    className="bg-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-800 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={signIn}
                  className="bg-white text-indigo-600 px-6 py-2 rounded-lg hover:bg-indigo-50 transition-colors flex items-center gap-2 font-semibold"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In with Google
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('deals')}
              className={`py-4 px-2 border-b-2 transition-colors font-medium ${
                activeTab === 'deals'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Deals {deals.length > 0 && `(${deals.length})`}
            </button>
            <button
              onClick={() => setActiveTab('brands')}
              className={`py-4 px-2 border-b-2 transition-colors font-medium ${
                activeTab === 'brands'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              My Brands {myBrands.length > 0 && `(${myBrands.length})`}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Deals Tab */}
        {activeTab === 'deals' && (
          <div>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-sm text-gray-600 mb-1">Brands Tracked</div>
                <div className="text-3xl font-bold text-gray-800">{stats.totalBrands}</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-sm text-gray-600 mb-1">Active Deals</div>
                <div className="text-3xl font-bold text-gray-800">{stats.totalDeals}</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-sm text-gray-600 mb-1">Total Savings</div>
                <div className="text-3xl font-bold text-gray-800">
                  ${stats.totalSavings.toLocaleString()}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-sm text-gray-600 mb-1">Avg Discount</div>
                <div className="text-3xl font-bold text-gray-800">{stats.avgDiscount}%</div>
              </div>
            </div>

            {/* Last Updated + Refresh */}
            {lastUpdated && (
              <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>{getTimeAgo(lastUpdated)}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500">Deals refresh every 6 hours</span>
                </div>
                <button
                  onClick={refreshDeals}
                  disabled={refreshing}
                  className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
            )}

            {/* Loading State */}
            {dealsLoading && (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <RefreshCw className="w-12 h-12 text-indigo-600 mx-auto mb-4 animate-spin" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading deals...</h3>
                <p className="text-gray-500">Fetching the latest deals from your brands</p>
              </div>
            )}

            {/* Error State */}
            {dealsError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-red-800 mb-2">Error Loading Deals</h3>
                <p className="text-red-600 mb-4">{dealsError}</p>
                <button
                  onClick={refreshDeals}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* No Brands Added */}
            {!dealsLoading && myBrands.length === 0 && (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No brands added yet</h3>
                <p className="text-gray-500 mb-4">Add some brands to start seeing deals!</p>
                <button
                  onClick={() => setActiveTab('brands')}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Brands
                </button>
              </div>
            )}

            {/* Deals Grid */}
            {!dealsLoading && !dealsError && deals.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {deals.map(deal => (
                  <a
                    key={deal.id}
                    href={deal.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow group"
                  >
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={deal.image}
                        alt={deal.product}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {parseInt(deal.discount) >= 30 && (
                        <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                          {deal.discount} OFF
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="text-xs text-indigo-600 font-semibold mb-1">{deal.brand}</div>
                      <h3 className="font-bold text-sm text-gray-800 mb-2 line-clamp-2 h-10">
                        {deal.product}
                      </h3>
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-2xl font-bold text-gray-900">
                          ${deal.salePrice}
                        </span>
                        {deal.originalPrice > deal.salePrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ${deal.originalPrice}
                        </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{deal.retailer}</span>
                        {parseInt(deal.discount) < 30 && (
                          <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded font-semibold">
                            {deal.discount}
                          </span>
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}

            {/* No Deals Found */}
            {!dealsLoading && !dealsError && myBrands.length > 0 && deals.length === 0 && (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No deals found</h3>
                <p className="text-gray-500 mb-4">
                  We couldn't find any current deals for your brands. Check back soon!
                </p>
                <p className="text-sm text-gray-400">
                  Deals are updated every 6 hours automatically
                </p>
              </div>
            )}
          </div>
        )}

        {/* Brands Tab */}
        {activeTab === 'brands' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">My Brands</h2>
                <p className="text-gray-600">Track deals from your favorite brands</p>
              </div>
              <div className="flex gap-2">
                {user && (
                  <>
                    <button
                      onClick={saveToCloud}
                      disabled={syncStatus === 'syncing'}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                      title="Save to cloud"
                    >
                      <Cloud className="w-5 h-5" />
                      Save to Cloud
                    </button>
                    <button
                      onClick={restoreFromCloud}
                      disabled={syncStatus === 'syncing'}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                      title="Restore from cloud"
                    >
                      <CloudOff className="w-5 h-5" />
                      Restore from Cloud
                    </button>
                  </>
                )}
                <button
                  onClick={() => setShowAddBrand(!showAddBrand)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Brand
                </button>
              </div>
            </div>

            {!user && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800">
                  <strong>💡 Pro tip:</strong> Sign in to sync your brands across all your devices!
                </p>
              </div>
            )}

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
                      placeholder="e.g., Nike, Apple, Yeti"
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
      </div>
    </div>
  );
}
