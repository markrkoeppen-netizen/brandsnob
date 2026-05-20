import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, X, TrendingUp, Tag, ExternalLink, Download, Upload, LogIn, LogOut, User, Cloud, CloudOff, RefreshCw, Heart, Check, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { db } from './firebase';
import { doc, setDoc, getDoc, collection, query, where, getDocs, orderBy, getCountFromServer } from 'firebase/firestore';
import emailjs from '@emailjs/browser';

// Initialize EmailJS
emailjs.init('QPiBFFlW7aGv6W0UP');

const CATEGORIES = [
  'Fashion', 'Footwear', 'Accessories', 'Tech', 'Home', 'Outdoor', 
  'Watches', 'Cosmetics', 'Jewelry', 'Travel'
];

const GENDER_OPTIONS = [
  { id: 'women', label: "Women's" },
  { id: 'men', label: "Men's" },
  { id: 'girls', label: "Girls'" },
  { id: 'boys', label: "Boys'" },
  { id: 'unisex', label: 'Unisex' }
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
      { name: 'YoungLA', category: 'Fashion' },
      { name: 'Gymshark', category: 'Fashion' }
    ]
  },
  {
    id: 4,
    name: 'Contemporary American',
    description: 'Modern American designers and lifestyle brands',
    brands: [
      { name: 'Calvin Klein', category: 'Fashion' },
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
      { name: 'Wrangler', category: 'Fashion' },
      { name: 'American Eagle', category: 'Fashion' },
      { name: 'Comfrt', category: 'Fashion' },
      { name: 'Hollister', category: 'Fashion' }
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
      { name: 'Yeti', category: 'Outdoor' },
      { name: 'Pelagic', category: 'Outdoor' },
      { name: 'RTIC Outdoors', category: 'Outdoor' }
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
      { name: 'Poncho Outdoors', category: 'Fashion' },
      { name: 'Fear of God Essentials', category: 'Fashion' },
      { name: 'Hellstar', category: 'Fashion' }
    ]
  },
  {
    id: 11,
    name: 'Beauty & Home',
    description: 'Luxury beauty and home essentials',
    brands: [
      { name: 'Estée Lauder', category: 'Cosmetics' },
      { name: 'Lush', category: 'Cosmetics' },
      { name: 'Bubble', category: 'Cosmetics' },
      { name: 'LANEIGE', category: 'Cosmetics' },
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
      { name: 'Aritzia', category: 'Fashion' },
      { name: 'Zara', category: 'Fashion' }
    ]
  },
  {
    id: 15,
    name: 'Women\'s Fashion Forward',
    description: 'Trendy, Instagram-worthy brands',
    brands: [
      { name: 'Aerie', category: 'Fashion' },
      { name: 'Reformation', category: 'Fashion' },
      { name: 'Aritzia', category: 'Fashion' },
      { name: 'Anthropologie', category: 'Fashion' },
      { name: 'Outdoor Voices', category: 'Fashion' },
      { name: 'Sweaty Betty', category: 'Fashion' },
      { name: 'Brandy Melville', category: 'Fashion' },
      { name: 'Victoria\'s Secret', category: 'Fashion' }
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
      { name: 'Mac Weldon', category: 'Fashion' },
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
      { name: 'Puma', category: 'Footwear' },
      { name: 'Supreme', category: 'Fashion' }
    ]
  },
  {
    id: 18,
    name: 'Denim & Basics',
    description: 'Quality denim and wardrobe essentials',
    brands: [
      { name: 'Levi\'s', category: 'Fashion' },
      { name: 'Lucky', category: 'Fashion' },
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
    name: 'Kids & Family',
    description: 'Children\'s apparel and family favorites',
    brands: [
      { name: 'Shade Critters', category: 'Fashion' }
    ]
  },
  {
    id: 21,
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
  'Abercrombie & Fitch', 'Adidas', 'Aerie', 'AG Jeans', 'Allbirds', 'Alo', 'American Giant', 'Anthropologie', 'Arc\'teryx', 'Ariat', 'Aritzia', 'Asics', 'Athleta', 'Away', 'Banana Republic', 'BIRKENSTOCK',
  'Bombas', 'Bonobos', 'Brooks Brothers', 'Bubble', 'Burberry', 'Burlebo', 'Calvin Klein', 'Carhartt', 'Chloé', 'Christian Louboutin',
  'Chubbies', 'Cinch', 'Clarks', 'Coach', 'Cole Haan', 'Columbia', 'Converse', 'Costa', 'Crocs', 'Cruel Girl', 'Cult Gaia',
  'Dacor', 'Dolce & Gabbana', 'Donna Karan', 'Dr. Martens', 'Estée Lauder', 'Everlane', 'Fendi', 'Feragamo', 'Free People',
  'Gorjana', 'Goyard', 'Gucci', 'Gymshark', 'Havaianas', 'Hermès', 'Hoka', 'J.Crew', 'Jimmy Choo', 'Justin Boots', 'Kate Spade', 'Kendra Scott', 'Kith', 'Lacoste', 'LANEIGE',
  'Levi\'s', 'Levi Strauss', 'Louis Vuitton', 'Lucchese', 'Lucky', 'Lululemon', 'Lush', 'Mac Weldon', 'Madewell', 'Mammut', 'Marc Jacobs',
  'Michael Kors', 'New Balance', 'Nike', 'Oakley', 'OluKai', 'On Running', 'OOFOS', 'Oscar de la Renta', 'Outdoor Voices', 'Panhandle Slim', 'Patagonia', 'Pelagic', 'Peter Millar', 'Polo Ralph Lauren',
  'Poncho Outdoors', 'Prada', 'Puma', 'Rag & Bone', 'Ray-Ban', 'Reebok', 'Reef', 'Reformation', 'REI Co-op', 'Rhone', 'Saint Laurent', 'Salomon', 'Samsonite', 'Sanuk', 'Shade Critters', 'Spanx', 'Stetson', 'Stuart Weitzman', 'Sweaty Betty',
  'Teva', 'The North Face', 'The Row', 'Theory', 'Thom Browne', 'Tiffany & Co.', 'Tom Ford', 'Tommy Bahama', 'Tony Lama',
  'Tory Burch', 'TravisMatthew', 'Trendia', 'Tumi', 'UGG', 'Under Armour', 'Untuckit', 'Vans', 'Vera Wang', 'Vince',
  'Victoria\'s Secret', 'Vineyard Vines', 'Vuori', 'Warby Parker', 'Wrangler', 'Yeti', 'YoungLA', 'Zara',
  'American Eagle', 'Brandy Melville', 'Comfrt', 'Fear of God Essentials', 'Hellstar', 'Hollister', 'RTIC Outdoors', 'Supreme'
];

function HowItWorksModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-neutral-900">How It Works</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-5">
          {[
            { step: '1', icon: '🏷️', title: 'Add Your Brands', desc: 'Search for and add the fashion brands you love. Organize them into collections like "Sneakers", "Luxury", or "Workwear".' },
            { step: '2', icon: '🔍', title: 'We Find the Deals', desc: 'BrandSnobs automatically scans your brands for sales, discounts, and deals — updated regularly so you never miss a drop.' },
            { step: '3', icon: '❤️', title: 'Save to Wishlist', desc: 'Heart any item to save it to a wishlist. Create multiple wishlists for birthdays, holidays, or any occasion.' },
            { step: '4', icon: '🔗', title: 'Share with Anyone', desc: 'Share your wishlist with friends and family via a link or email. Perfect for gift-giving season.' },
            { step: '5', icon: '🛍️', title: 'Shop When Ready', desc: 'Click any deal to go straight to the brand&apos;s website and check out. We never store your payment info.' },
          ].map(({ step, icon, title, desc }) => (
            <div key={step} className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-neutral-900 text-white rounded-full flex items-center justify-center font-bold text-sm">
                {step}
              </div>
              <div>
                <p className="font-semibold text-neutral-900 mb-1">{icon} {title}</p>
                <p className="text-sm text-neutral-600">{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="w-full mt-6 bg-neutral-900 text-white py-2.5 rounded-xl font-medium hover:bg-neutral-800 transition-colors"
        >
          Got it!
        </button>
      </div>
    </div>
  );
}

function PrivacyPolicyModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-neutral-900">Privacy Policy</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4 text-sm text-neutral-600">
          <p className="text-xs text-neutral-400">Last updated: January 2025</p>
          {[
            { title: 'Information We Collect', body: 'We collect your email address (if you sign in), your brand preferences, wishlist items, and shipping profile information you choose to enter. We do not collect payment information.' },
            { title: 'How We Use Your Information', body: 'Your data is used solely to provide the BrandSnobs service — syncing your brands and wishlists across devices. We do not sell your data to third parties.' },
            { title: 'Data Storage', body: 'Your data is stored securely using Google Firebase. We use industry-standard encryption for all data in transit and at rest.' },
            { title: 'Affiliate Links', body: 'BrandSnobs earns a commission when you make a purchase through our links. This does not affect the price you pay. We only feature brands and deals we believe are genuinely worthwhile.' },
            { title: 'Cookies', body: 'We use minimal cookies and local storage to remember your preferences between sessions. We do not use tracking cookies or share data with advertisers.' },
            { title: 'Your Rights', body: 'You can delete your account and all associated data at any time by contacting us at admin@brandsnobs.com. We will process deletion requests within 30 days.' },
            { title: 'Contact', body: 'Questions about this policy? Email us at admin@brandsnobs.com.' },
          ].map(({ title, body }) => (
            <div key={title}>
              <p className="font-semibold text-neutral-900 mb-1">{title}</p>
              <p>{body}</p>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="w-full mt-6 bg-neutral-900 text-white py-2.5 rounded-xl font-medium hover:bg-neutral-800 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function TermsOfServiceModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-neutral-900">Terms of Service</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4 text-sm text-neutral-600">
          <p className="text-xs text-neutral-400">Last updated: January 2025</p>
          {[
            { title: 'Acceptance', body: 'By using BrandSnobs, you agree to these terms. If you do not agree, please do not use the service.' },
            { title: 'Use of Service', body: 'BrandSnobs is a personal shopping tool. You may use it for personal, non-commercial purposes. You may not scrape, copy, or redistribute our deal data.' },
            { title: 'Accuracy of Deals', body: 'We strive to keep deal information accurate and up to date, but prices and availability can change at any time. Always verify the final price on the retailer&apos;s website before purchasing.' },
            { title: 'Affiliate Relationships', body: 'We have affiliate relationships with many of the brands and retailers featured. We earn a commission on qualifying purchases, which helps keep BrandSnobs free.' },
            { title: 'Account Responsibility', body: 'You are responsible for maintaining the security of your account. Please use a valid email address and notify us immediately of any unauthorized access.' },
            { title: 'Wishlist Sharing', body: 'When you share a wishlist with a link, anyone with that link can view it. You are responsible for who you share links with. Set wishlists to Private if you do not want them publicly accessible.' },
            { title: 'Limitation of Liability', body: 'BrandSnobs is provided "as is." We are not liable for missed deals, incorrect prices, or any purchases you make through third-party retailers.' },
            { title: 'Changes to Terms', body: 'We may update these terms from time to time. Continued use of the service after changes constitutes acceptance of the new terms.' },
            { title: 'Contact', body: 'Questions? Email us at admin@brandsnobs.com.' },
          ].map(({ title, body }) => (
            <div key={title}>
              <p className="font-semibold text-neutral-900 mb-1">{title}</p>
              <p>{body}</p>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="w-full mt-6 bg-neutral-900 text-white py-2.5 rounded-xl font-medium hover:bg-neutral-800 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function OnboardingWalkthrough({ step, onNext, onDone }) {
  const steps = [
    {
      emoji: '🎉',
      title: 'Your deals are loading!',
      body: 'BrandSnobs is fetching the latest sales from your brands. New deals are pulled every 6 hours so you never miss a drop.',
      cta: 'Next',
    },
    {
      emoji: '❤️',
      title: 'Save deals to your wishlist',
      body: 'Tap the heart icon on any deal to save it. Create multiple wishlists for birthdays, holidays, or any occasion.',
      cta: 'Next',
    },
    {
      emoji: '🔗',
      title: 'Share with friends & family',
      body: 'Tap the heart icon in the top bar to open your wishlists, then hit Share to send a link or email to anyone.',
      cta: 'Got it!',
    },
  ];

  const current = steps[step];
  if (!current) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-[90] p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl">
        <div className="text-center mb-4">
          <span className="text-4xl">{current.emoji}</span>
        </div>
        <h3 className="text-lg font-bold text-neutral-900 text-center mb-2">
          {current.title}
        </h3>
        <p className="text-sm text-neutral-600 text-center mb-6 leading-relaxed">
          {current.body}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? 'w-6 bg-neutral-900' : 'w-1.5 bg-neutral-300'
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onDone}
              className="text-sm text-neutral-400 hover:text-neutral-600 px-3 py-1.5"
            >
              Skip
            </button>
            <button
              onClick={step === steps.length - 1 ? onDone : onNext}
              className="text-sm bg-neutral-900 text-white px-4 py-1.5 rounded-lg hover:bg-neutral-800 font-medium"
            >
              {current.cta}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Toast({ message, visible }) {
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
    }`}>
      <div className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2.5 rounded-full shadow-lg text-sm font-medium">
        <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        {message}
      </div>
    </div>
  );
}

function BrandLogo({ domain, name }) {
  const [errored, setErrored] = React.useState(false);
  const logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  return (
    <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-100 flex items-center justify-center flex-shrink-0">
      {!errored ? (
        <img
          src={logoUrl}
          alt={name}
          className="w-8 h-8 object-contain"
          onError={() => setErrored(true)}
        />
      ) : (
        <span className="text-xs font-bold text-neutral-500">
          {name.replace(/[^a-zA-Z0-9 ]/g, '').trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
        </span>
      )}
    </div>
  );
}

function OnboardingScreen({ onAddBrand, onLoadCollection, onRequestBrand, brandSearchQuery, onBrandSearchChange, brandSuggestions, showSuggestions, setShowSuggestions, onSignIn, onHowItWorks, onPrivacy, onTerms }) {
  const popularBrands = [
    { name: 'Alo', emoji: '🧘' },
    { name: 'Burberry', emoji: '🧥' },
    { name: 'Cole Haan', emoji: '👞' },
    { name: 'Dolce & Gabbana', emoji: '👗' },
    { name: 'Everlane', emoji: '👕' }
  ];

  const handleBrandSelect = (brand) => {
    onBrandSearchChange(brand);
    setShowSuggestions(false);
    onAddBrand(brand);
  };

  const handlePopularBrandClick = (brandName) => {
    onAddBrand(brandName);
  };

  const handleRequestBrand = () => {
    onRequestBrand(brandSearchQuery);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-neutral-50 to-neutral-100 z-40 flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-2xl w-full py-8">
        <div className="text-center mb-8">
          <ShoppingBag className="w-16 h-16 text-neutral-900 mx-auto mb-5" />
          <h1 className="font-display text-4xl md:text-5xl font-bold text-neutral-900 mb-3">
            BrandSnobs
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 font-light tracking-widest uppercase mb-6">
            You Like What You Like
          </p>
          <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto mb-6">
            <div className="bg-white rounded-xl border border-neutral-200 p-3 text-center">
              <p className="text-xl font-bold text-neutral-900">100+</p>
              <p className="text-xs text-neutral-500 mt-0.5">Premium Brands</p>
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 p-3 text-center">
              <p className="text-xl font-bold text-neutral-900">Daily</p>
              <p className="text-xs text-neutral-500 mt-0.5">Deal Updates</p>
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 p-3 text-center">
              <p className="text-xl font-bold text-neutral-900">Free</p>
              <p className="text-xs text-neutral-500 mt-0.5">Always</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-neutral-500 max-w-md mx-auto mb-4">
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Track sales from your favorite brands</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Save to wishlists &amp; share with friends</span>
          </div>
          {userCount && userCount > 0 && (
            <p className="text-sm text-neutral-400 font-medium">
              🛍️ Join {userCount.toLocaleString()}+ shoppers already tracking deals
            </p>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 p-6 md:p-8 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4 text-center">
            Add Your First Brand
          </h2>
          
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                value={brandSearchQuery}
                onChange={(e) => onBrandSearchChange(e.target.value)}
                placeholder="Search for a brand... (e.g., Nike, Gucci, Patagonia)"
                className="w-full pl-12 pr-4 py-3 border-2 border-neutral-300 rounded-xl text-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                autoFocus
                onFocus={() => brandSearchQuery && setShowSuggestions(brandSuggestions.length > 0)}
              />
            </div>

            {showSuggestions && brandSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-white border-2 border-neutral-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                {brandSuggestions.map((brand, index) => (
                  <button
                    key={index}
                    onClick={() => handleBrandSelect(brand)}
                    className="w-full text-left px-4 py-3 hover:bg-neutral-100 transition-colors border-b border-neutral-100 last:border-b-0 font-medium text-neutral-900"
                  >
                    {brand}
                  </button>
                ))}
              </div>
            )}

            {brandSearchQuery && brandSuggestions.length === 0 && showSuggestions && (
              <div className="absolute z-10 w-full mt-2 bg-white border-2 border-neutral-300 rounded-xl shadow-lg p-6">
                <p className="text-neutral-600 mb-4 text-center">
                  Can't find <strong>"{brandSearchQuery}"</strong>?
                </p>
                <button
                  onClick={handleRequestBrand}
                  className="w-full bg-neutral-900 text-white py-3 px-6 rounded-xl hover:bg-neutral-800 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <TrendingUp className="w-5 h-5" />
                  Request This Brand
                </button>
                <p className="text-xs text-neutral-500 text-center mt-3">
                  ⚡ We'll add it in less than 24 hours and notify you!
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="text-center">
          <p className="text-neutral-600 mb-6 font-medium">Or start with our most popular brands:</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-4xl mx-auto">
            {popularBrands.map((brand) => (
              <button
                key={brand.name}
                onClick={() => handlePopularBrandClick(brand.name)}
                className="bg-white hover:bg-neutral-900 hover:text-white border-2 border-neutral-200 hover:border-neutral-900 text-neutral-900 py-4 px-4 rounded-xl transition-all font-semibold text-sm flex flex-col items-center justify-center gap-2"
              >
                <span className="text-2xl">{brand.emoji}</span>
                <span className="text-xs md:text-sm">{brand.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Returning user sign-in */}
        <div className="mt-8 text-center border-t border-neutral-200 pt-6">
          <p className="text-sm text-neutral-500 mb-3">
            Already have an account?
          </p>
          <button
            onClick={onSignIn}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-neutral-900 text-white rounded-xl font-semibold text-sm hover:bg-neutral-800 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            Sign In to Restore Your Brands
          </button>
        </div>

        {/* Footer links */}
        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-neutral-400">
          <button onClick={onHowItWorks} className="hover:text-neutral-600 underline">How It Works</button>
          <span>·</span>
          <button onClick={onPrivacy} className="hover:text-neutral-600 underline">Privacy Policy</button>
          <span>·</span>
          <button onClick={onTerms} className="hover:text-neutral-600 underline">Terms of Service</button>
        </div>
      </div>
    </div>
  );
}

function FetchingDealsAnimation() {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <div className="mb-8 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 border-4 border-neutral-200 rounded-full"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center animate-spin">
            <div className="w-32 h-32 border-4 border-neutral-900 rounded-full border-t-transparent"></div>
          </div>
          <div className="relative z-10 pt-8">
            <div className="animate-bounce">
              <ShoppingBag className="w-16 h-16 text-neutral-900 mx-auto" />
            </div>
          </div>
        </div>
        
        <h2 className="font-display text-3xl font-bold text-neutral-900 mb-3">
          Fetching Your Deals...
        </h2>
        <p className="text-neutral-600 text-lg mb-6">
          Strutting down the runway of savings 💃
        </p>
        
        <div className="flex items-center justify-center gap-2 text-neutral-400">
          <div className="w-2 h-2 bg-neutral-900 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-neutral-900 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-neutral-900 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}

function NameCollectionModal({ onClose, onRename, initialName = '' }) {
  const [collectionName, setCollectionName] = useState(initialName);
  
  const handleSubmit = () => {
    if (collectionName.trim()) {
      onRename(collectionName.trim());
      onClose();
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-neutral-900">Name Your Collection</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <p className="text-neutral-600 mb-4">
          You have multiple brands! Give them a collection name so you can organize them.
        </p>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Collection Name
          </label>
          <input
            type="text"
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
            placeholder="e.g., Athletic Gear, Luxury Favorites..."
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            autoFocus
          />
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={!collectionName.trim()}
            className="flex-1 bg-neutral-900 text-white py-2 rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Collection Name
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-neutral-200 text-neutral-700 py-2 rounded-lg hover:bg-neutral-300 transition-colors"
          >
            Skip for Now
          </button>
        </div>
      </div>
    </div>
  );
}

function CreateWishlistModal({ onClose, onCreate }) {
  const [wishlistType, setWishlistType] = useState('template'); // 'template' or 'custom'
  const [selectedTemplate, setSelectedTemplate] = useState('mylist');
  const [customName, setCustomName] = useState('');
  const [privacy, setPrivacy] = useState('link-only');

  const templates = [
    { id: 'mylist', name: 'My Wishlist', occasion: 'custom', emoji: '⭐' },
    { id: 'birthday', name: 'Birthday', occasion: 'birthday', emoji: '🎂' },
    { id: 'holiday', name: 'Holiday', occasion: 'holiday', emoji: '🎄' }
  ];

  const handleCreate = () => {
    if (wishlistType === 'custom') {
      if (!customName.trim()) {
        alert('Please enter a wishlist name');
        return;
      }
      onCreate(customName.trim(), 'custom', '✏️', privacy);
    } else {
      const template = templates.find(t => t.id === selectedTemplate);
      onCreate(template.name, template.occasion, template.emoji, privacy);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-neutral-900">Create New Wishlist</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setWishlistType('template')}
              className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                wishlistType === 'template'
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-neutral-300 text-neutral-700 hover:border-neutral-400'
              }`}
            >
              Templates
            </button>
            <button
              onClick={() => setWishlistType('custom')}
              className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                wishlistType === 'custom'
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-neutral-300 text-neutral-700 hover:border-neutral-400'
              }`}
            >
              Custom
            </button>
          </div>

          {wishlistType === 'template' ? (
            <div className="space-y-2">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                    selectedTemplate === template.id
                      ? 'border-neutral-900 bg-neutral-50'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <span className="text-2xl mr-3">{template.emoji}</span>
                  <span className="font-medium">{template.name}</span>
                </button>
              ))}
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Wishlist Name
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g., Dream Sneaker Collection"
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                autoFocus
              />
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Privacy
          </label>
          <p className="text-xs text-neutral-500 mb-3">Who can view this wishlist?</p>
          <div className="space-y-2">
            <button
              onClick={() => setPrivacy('link-only')}
              className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                privacy === 'link-only'
                  ? 'border-neutral-900 bg-neutral-50'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div className="font-medium">🔗 Link Only</div>
              <div className="text-xs text-neutral-500">Only people with the link can view</div>
            </button>
            <button
              onClick={() => setPrivacy('private')}
              className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                privacy === 'private'
                  ? 'border-neutral-900 bg-neutral-50'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div className="font-medium">🔒 Private</div>
              <div className="text-xs text-neutral-500">Only you can view</div>
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCreate}
            className="flex-1 bg-neutral-900 text-white py-2 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Create Wishlist
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-neutral-200 text-neutral-700 py-2 rounded-lg hover:bg-neutral-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function AddToWishlistModal({ onClose, wishlists, pendingItem, onAddToWishlist, onCreateNew }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-neutral-900">Add to Wishlist</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="text-neutral-600 mb-4">
          Choose which wishlist to add <strong>{pendingItem?.product}</strong> to:
        </p>

        <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
          {wishlists.map((wishlist) => (
            <button
              key={wishlist.id}
              onClick={() => onAddToWishlist(wishlist.id, pendingItem)}
              className="w-full text-left p-3 rounded-lg border-2 border-neutral-200 hover:border-neutral-900 hover:bg-neutral-50 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xl mr-2">{wishlist.emoji}</span>
                  <span className="font-medium">{wishlist.name}</span>
                </div>
                <span className="text-sm text-neutral-500">{wishlist.items.length} items</span>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={onCreateNew}
          className="w-full bg-neutral-900 text-white py-2 rounded-lg hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create New Wishlist
        </button>
      </div>
    </div>
  );
}

function LuxuryDealCard({ deal, onAddToBag, onDealClick, wishlist, onAddToWishlist, onRemoveFromWishlist }) {
  const [isHovered, setIsHovered] = useState(false);
  const [addedToBag, setAddedToBag] = useState(false);
  
  const isInWishlist = wishlist?.some(item => item.id === deal.id) || false;

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist) {
      onRemoveFromWishlist(deal.id);
    } else {
      onAddToWishlist(deal);
    }
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

        {(() => {
          const fetchedAt = deal.fetchedAt || deal.lastUpdated;
          if (!fetchedAt) return null;
          const hoursOld = (Date.now() - new Date(fetchedAt).getTime()) / (1000 * 60 * 60);
          if (hoursOld > 24) return null;
          return (
            <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-emerald-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
              New
            </div>
          );
        })()}

        {deal.sizeMatchScore && deal.sizeMatchScore > 0 && (
          <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 bg-green-600 text-white px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-semibold tracking-wide flex items-center gap-1">
            <Check className="w-3 h-3 md:w-4 md:h-4" />
            Your Size
          </div>
        )}

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
          {deal.retailer && deal.retailer !== deal.brand && (
            <span className="text-xs text-neutral-400 hidden md:block border border-neutral-200 px-1.5 py-0.5 rounded-full">
              {deal.retailer}
            </span>
          )}
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

        <button
          onClick={handleFavorite}
          className={`mt-2 w-full py-2 rounded-lg font-medium text-sm transition-all border ${
            isInWishlist 
              ? 'bg-rose-50 text-rose-600 border-rose-600' 
              : 'bg-white text-neutral-600 border-neutral-300 hover:border-neutral-400'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <Heart className="w-4 h-4" fill={isInWishlist ? 'currentColor' : 'none'} />
            {isInWishlist ? 'Saved' : 'Save'}
          </span>
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
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-xs text-neutral-400 font-medium tracking-wide uppercase mr-1">For:</span>
      {GENDER_OPTIONS.map((option) => {
        const isSelected = selectedGenders.includes(option.id);
        return (
          <button
            key={option.id}
            onClick={() => toggleGender(option.id)}
            className={`px-2.5 py-1 rounded-full border text-xs font-medium transition-all ${
              isSelected
                ? 'border-neutral-900 bg-neutral-900 text-white'
                : 'border-neutral-200 bg-white text-neutral-500 hover:border-neutral-400 hover:text-neutral-700'
            }`}
          >
            {option.label}
          </button>
        );
      })}
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

function WishlistModal({ wishlist, onClose, onRemove, onShare, onAddToBag }) {
  const totalValue = wishlist.reduce((sum, item) => sum + item.salePrice, 0);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const handleDealClick = (url) => {
    if (isMobile) {
      window.location.href = url;
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-neutral-900">My Wishlist</h2>
            <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-sm text-neutral-600">
            {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} • ${totalValue.toFixed(2)} total
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {wishlist.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500">Your wishlist is empty</p>
              <p className="text-sm text-neutral-400 mt-2">Click the heart icon on deals to save them here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {wishlist.map(item => (
                <div key={item.id} className="flex gap-4 bg-neutral-50 rounded-xl p-4">
                  <img 
                    src={item.image} 
                    alt={item.product}
                    className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80"
                    onClick={() => handleDealClick(item.link)}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-neutral-500 mb-1">{item.brand}</p>
                    <h3 className="font-medium text-neutral-900 line-clamp-2 text-sm mb-2 cursor-pointer hover:text-neutral-600" onClick={() => handleDealClick(item.link)}>
                      {item.product}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-neutral-900">${item.salePrice}</span>
                      {item.originalPrice > item.salePrice && (
                        <>
                          <span className="text-xs text-neutral-400 line-through">${item.originalPrice}</span>
                          <span className="text-xs text-green-600 font-medium">{item.discount} off</span>
                        </>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onAddToBag(item)}
                        className="text-xs bg-neutral-900 text-white px-3 py-1 rounded-lg hover:bg-neutral-800"
                      >
                        Add to Bag
                      </button>
                      <button
                        onClick={() => handleDealClick(item.link)}
                        className="text-xs bg-neutral-200 text-neutral-700 px-3 py-1 rounded-lg hover:bg-neutral-300"
                      >
                        View Deal
                      </button>
                    </div>
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

        {wishlist.length > 0 && (
          <div className="p-6 border-t border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-neutral-600">Total Value</p>
                <p className="text-2xl font-bold text-neutral-900">${totalValue.toFixed(2)}</p>
              </div>
            </div>
            <button
              onClick={onShare}
              className="w-full bg-neutral-900 text-white py-3 rounded-lg hover:bg-neutral-800 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Upload className="w-5 h-5" />
              Share Wishlist
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


// ── NEW COMPONENTS (Part 4) ────────────────────────────────
// ============================================================
// APP-PART-4-SIMPLE-AUTH.jsx
// Contains:
//   1. WishlistsManagerModal  (NEW — replaces old WishlistModal)
//   2. Updated ShareWishlistModal (copy-link + wishlist picker)
//   3. All modal renders to paste into the return() of App
//   4. Fixed saveToCloud (was referencing old `wishlist` variable)
//   5. Sign-in modal render
// ============================================================

// ─────────────────────────────────────────────────────────────
// 1. WishlistsManagerModal
//    Shows all wishlists, lets user pick one to view/manage,
//    create new ones, delete them, and share them.
// ─────────────────────────────────────────────────────────────
function WishlistsManagerModal({
  wishlists,
  onClose,
  onRemoveItem,
  onDeleteWishlist,
  onCreateNew,
  onShare,
  onAddToBag,
  shippingProfile,
}) {
  const [selectedWishlistId, setSelectedWishlistId] = useState(
    wishlists.length > 0 ? wishlists[0].id : null
  );
  const [view, setView] = useState('list'); // 'list' | 'detail'

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const handleDealClick = (url) => {
    if (isMobile) {
      window.location.href = url;
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // Helper: get size label for a wishlist item based on its category
  const getSizeLabel = (item) => {
    if (!shippingProfile) return null;
    const category = (item.category || '').toLowerCase();
    const brand = (item.brand || '').toLowerCase();

    // Footwear check
    const isFootwear =
      category === 'footwear' ||
      ['shoe', 'boot', 'sneaker', 'sandal', 'heel', 'loafer'].some(k =>
        (item.product || '').toLowerCase().includes(k)
      );
    if (isFootwear && shippingProfile.shoeSize) {
      return `Shoe: ${shippingProfile.shoeSize}`;
    }

    // Dress check
    if (category === 'dress' || (item.product || '').toLowerCase().includes('dress')) {
      if (shippingProfile.dressSize) return `Dress: ${shippingProfile.dressSize}`;
    }

    // Pants check
    if (['pant', 'jean', 'denim', 'trouser', 'short'].some(k =>
      (item.product || '').toLowerCase().includes(k)
    )) {
      if (shippingProfile.pantsWaist && shippingProfile.pantsInseam) {
        return `${shippingProfile.pantsWaist}W × ${shippingProfile.pantsInseam}L`;
      }
      if (shippingProfile.pantsWaist) return `Waist: ${shippingProfile.pantsWaist}`;
    }

    // Default: shirt size
    if (shippingProfile.shirtSize) return `Size: ${shippingProfile.shirtSize}`;

    return null;
  };

  const selectedWishlist = wishlists.find(w => w.id === selectedWishlistId);
  const totalItems = wishlists.reduce((sum, w) => sum + w.items.length, 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-2xl font-bold text-neutral-900">
              {view === 'detail' && selectedWishlist
                ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setView('list')}
                      className="text-neutral-400 hover:text-neutral-700 mr-1"
                    >
                      ←
                    </button>
                    <span>{selectedWishlist.emoji} {selectedWishlist.name}</span>
                  </div>
                )
                : 'My Wishlists'
              }
            </h2>
            <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
              <X className="w-6 h-6" />
            </button>
          </div>
          {view === 'list' && (
            <p className="text-sm text-neutral-500">
              {wishlists.length} wishlist{wishlists.length !== 1 ? 's' : ''} · {totalItems} item{totalItems !== 1 ? 's' : ''}
            </p>
          )}
          {view === 'detail' && selectedWishlist && (
            <p className="text-sm text-neutral-500">
              {selectedWishlist.items.length} item{selectedWishlist.items.length !== 1 ? 's' : ''} ·{' '}
              {selectedWishlist.privacy === 'link-only' ? '🔗 Link Only' : '🔒 Private'}
            </p>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* ── LIST VIEW ── */}
          {view === 'list' && (
            <div className="space-y-3">
              {wishlists.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                  <p className="text-neutral-500">No wishlists yet</p>
                  <p className="text-sm text-neutral-400 mt-1">
                    Create one to start saving deals
                  </p>
                </div>
              ) : (
                wishlists.map(wishlist => {
                  const preview = wishlist.items.slice(0, 3);
                  const totalValue = wishlist.items
                    .reduce((sum, i) => sum + i.salePrice, 0)
                    .toFixed(2);

                  return (
                    <div
                      key={wishlist.id}
                      className="border border-neutral-200 rounded-xl p-4 hover:border-neutral-300 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <button
                          onClick={() => {
                            setSelectedWishlistId(wishlist.id);
                            setView('detail');
                          }}
                          className="flex items-center gap-2 text-left"
                        >
                          <span className="text-2xl">{wishlist.emoji}</span>
                          <div>
                            <p className="font-semibold text-neutral-900">{wishlist.name}</p>
                            <p className="text-xs text-neutral-500">
                              {wishlist.items.length} item{wishlist.items.length !== 1 ? 's' : ''}
                              {wishlist.items.length > 0 && ` · $${totalValue}`}
                            </p>
                          </div>
                        </button>

                        <div className="flex items-center gap-2">
                          {/* Share button */}
                          <button
                            onClick={() => onShare(wishlist.id)}
                            className="p-1.5 text-neutral-400 hover:text-neutral-700 transition-colors"
                            title="Share wishlist"
                          >
                            <Upload className="w-4 h-4" />
                          </button>
                          {/* Delete button */}
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete "${wishlist.name}"? This can't be undone.`)) {
                                onDeleteWishlist(wishlist.id);
                                if (selectedWishlistId === wishlist.id) {
                                  const remaining = wishlists.filter(w => w.id !== wishlist.id);
                                  setSelectedWishlistId(remaining.length > 0 ? remaining[0].id : null);
                                }
                              }
                            }}
                            className="p-1.5 text-neutral-400 hover:text-red-500 transition-colors"
                            title="Delete wishlist"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Preview images */}
                      {preview.length > 0 && (
                        <div className="flex gap-2 mt-3">
                          {preview.map(item => (
                            <img
                              key={item.id}
                              src={item.image}
                              alt={item.product}
                              className="w-14 h-14 object-cover rounded-lg border border-neutral-200 cursor-pointer hover:opacity-80"
                              onClick={() => handleDealClick(item.link)}
                            />
                          ))}
                          {wishlist.items.length > 3 && (
                            <div className="w-14 h-14 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-xs text-neutral-500 font-medium">
                              +{wishlist.items.length - 3}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* ── DETAIL VIEW ── */}
          {view === 'detail' && selectedWishlist && (
            <div>
              {selectedWishlist.items.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                  <p className="text-neutral-500">This wishlist is empty</p>
                  <p className="text-sm text-neutral-400 mt-1">
                    Click the heart icon on deals to save them here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedWishlist.items.map(item => {
                    const sizeLabel = getSizeLabel(item);
                    return (
                      <div key={item.id} className="flex gap-4 bg-neutral-50 rounded-xl p-4">
                        <img
                          src={item.image}
                          alt={item.product}
                          className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 flex-shrink-0"
                          onClick={() => handleDealClick(item.link)}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-neutral-500 mb-0.5">{item.brand}</p>
                          <h3
                            className="font-medium text-neutral-900 line-clamp-2 text-sm mb-1 cursor-pointer hover:text-neutral-600"
                            onClick={() => handleDealClick(item.link)}
                          >
                            {item.product}
                          </h3>

                          {/* Size label */}
                          {sizeLabel && (
                            <span className="inline-block text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full mb-1.5">
                              Your {sizeLabel}
                            </span>
                          )}

                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-neutral-900">${item.salePrice}</span>
                            {item.originalPrice > item.salePrice && (
                              <>
                                <span className="text-xs text-neutral-400 line-through">
                                  ${item.originalPrice}
                                </span>
                                <span className="text-xs text-green-600 font-medium">
                                  {item.discount} off
                                </span>
                              </>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => onAddToBag(item)}
                              className="text-xs bg-neutral-900 text-white px-3 py-1 rounded-lg hover:bg-neutral-800"
                            >
                              Add to Bag
                            </button>
                            <button
                              onClick={() => handleDealClick(item.link)}
                              className="text-xs bg-neutral-200 text-neutral-700 px-3 py-1 rounded-lg hover:bg-neutral-300"
                            >
                              View Deal
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={() => onRemoveItem(selectedWishlist.id, item.id)}
                          className="text-red-400 hover:text-red-600 flex-shrink-0"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-200">
          {view === 'detail' && selectedWishlist && selectedWishlist.items.length > 0 && (
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-neutral-600">Total Value</p>
                <p className="text-xl font-bold text-neutral-900">
                  ${selectedWishlist.items.reduce((s, i) => s + i.salePrice, 0).toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => onShare(selectedWishlist.id)}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors text-sm font-medium"
              >
                <Upload className="w-4 h-4" />
                Share
              </button>
            </div>
          )}
          <button
            onClick={onCreateNew}
            className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-neutral-300 rounded-xl text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Create New Wishlist
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. Updated ShareWishlistModal
//    Adds: Copy Link button, wishlist selector dropdown
// ─────────────────────────────────────────────────────────────
function ShareWishlistModal({
  onClose,
  wishlists,
  shareWishlistId,
  setShareWishlistId,
  shareRecipient,
  setShareRecipient,
  shareMessage,
  setShareMessage,
  onShare,
  shareSending,
}) {
  const [copied, setCopied] = useState(false);

  const selectedWishlist = wishlists.find(w => w.id === shareWishlistId) || wishlists[0];
  const shareLink = selectedWishlist
    ? `${window.location.origin}/wishlist/${selectedWishlist.shareId}`
    : '';

  const handleCopyLink = async () => {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers that block clipboard
      const ta = document.createElement('textarea');
      ta.value = shareLink;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-neutral-900">Share Wishlist</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4 mb-6">

          {/* Wishlist picker (only shown when multiple wishlists exist) */}
          {wishlists.length > 1 && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Which Wishlist?
              </label>
              <select
                value={shareWishlistId || ''}
                onChange={(e) => setShareWishlistId(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-neutral-900"
              >
                {wishlists.map(w => (
                  <option key={w.id} value={w.id}>
                    {w.emoji} {w.name} ({w.items.length} items)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Privacy notice */}
          {selectedWishlist && (
            <div className={`flex items-start gap-2 p-3 rounded-lg text-xs ${
              selectedWishlist.privacy === 'private'
                ? 'bg-amber-50 border border-amber-200 text-amber-800'
                : 'bg-blue-50 border border-blue-200 text-blue-800'
            }`}>
              <span className="text-base">{selectedWishlist.privacy === 'private' ? '🔒' : '🔗'}</span>
              <p>
                {selectedWishlist.privacy === 'private'
                  ? 'This wishlist is set to Private. Only you can view it — sharing the link won\'t work until you change the privacy setting.'
                  : 'This wishlist is Link Only — anyone with the link can view it.'}
              </p>
            </div>
          )}

          {/* Copy link */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Share Link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg text-xs bg-neutral-50 text-neutral-600 font-mono overflow-hidden"
              />
              <button
                onClick={handleCopyLink}
                disabled={selectedWishlist?.privacy === 'private'}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  copied
                    ? 'bg-green-600 text-white'
                    : 'bg-neutral-900 text-white hover:bg-neutral-800'
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {copied ? (
                  <><Check className="w-4 h-4" /> Copied!</>
                ) : (
                  'Copy'
                )}
              </button>
            </div>
          </div>

          {/* Email share */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Or Share via Email
            </label>
            <input
              type="email"
              value={shareRecipient}
              onChange={(e) => setShareRecipient(e.target.value)}
              placeholder="friend@example.com"
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Message (optional)
            </label>
            <textarea
              value={shareMessage}
              onChange={(e) => setShareMessage(e.target.value)}
              placeholder="Add a personal message…"
              rows="3"
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onShare}
            disabled={!shareRecipient.trim() || shareSending}
            className="flex-1 bg-neutral-900 text-white py-2 rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            {shareSending ? 'Sending…' : 'Send Email'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-neutral-200 text-neutral-700 py-2 rounded-lg hover:bg-neutral-300 text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────────────

export default function App() {
  // Helper function to generate unique share IDs
  const generateShareId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

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
  const [toastMessage, setToastMessage] = useState('');
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [walkthroughStep, setWalkthroughStep] = useState(0);
  const [userCount, setUserCount] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfService, setShowTermsOfService] = useState(false);
  const [fetchingDeals, setFetchingDeals] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [editingCollectionName, setEditingCollectionName] = useState('');
  const [showNameCollectionPrompt, setShowNameCollectionPrompt] = useState(false);
  const [hasShownUncategorizedPrompt, setHasShownUncategorizedPrompt] = useState(() => {
    return localStorage.getItem('hasShownUncategorizedPrompt') === 'true';
  });
  
  // Wishlist states - Updated for multiple wishlists
  const [wishlists, setWishlists] = useState(() => {
    const saved = localStorage.getItem('wishlists');
    if (saved) {
      return JSON.parse(saved);
    }
    // Check for old single wishlist format and migrate
    const oldWishlist = localStorage.getItem('wishlist');
    if (oldWishlist) {
      const oldItems = JSON.parse(oldWishlist);
      if (oldItems.length > 0) {
        // Migrate to new format
        const migratedWishlist = {
          id: 'wishlist_' + Date.now(),
          name: 'My Wishlist',
          occasion: 'custom',
          emoji: '⭐',
          privacy: 'link-only',
          shareId: generateShareId(),
          items: oldItems,
          createdAt: Date.now()
        };
        localStorage.removeItem('wishlist'); // Clean up old format
        return [migratedWishlist];
      }
    }
    return [];
  });
  const [activeWishlistId, setActiveWishlistId] = useState(() => {
    const saved = localStorage.getItem('activeWishlistId');
    return saved || null;
  });
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [showCreateWishlistModal, setShowCreateWishlistModal] = useState(false);
  const [showAddToWishlistModal, setShowAddToWishlistModal] = useState(false);
  const [pendingWishlistItem, setPendingWishlistItem] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareWishlistId, setShareWishlistId] = useState(null);
  const [shareRecipient, setShareRecipient] = useState('');
  const [shareMessage, setShareMessage] = useState('');
  const [shareSending, setShareSending] = useState(false);

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
        
        // Handle wishlist migration
        if (data.wishlists) {
          // New format
          setWishlists(data.wishlists);
          setActiveWishlistId(data.activeWishlistId || (data.wishlists.length > 0 ? data.wishlists[0].id : null));
        } else if (data.wishlist && data.wishlist.length > 0) {
          // Old format - migrate
          const migratedWishlist = {
            id: 'wishlist_' + Date.now(),
            name: 'My Wishlist',
            occasion: 'custom',
            emoji: '⭐',
            privacy: 'link-only',
            shareId: generateShareId(),
            items: data.wishlist,
            createdAt: Date.now()
          };
          setWishlists([migratedWishlist]);
          setActiveWishlistId(migratedWishlist.id);
        }
        
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
          wishlist: [],
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
            
            // Handle wishlist migration
            if (data.wishlists) {
              setWishlists(data.wishlists);
              setActiveWishlistId(data.activeWishlistId || (data.wishlists.length > 0 ? data.wishlists[0].id : null));
            } else if (data.wishlist && data.wishlist.length > 0) {
              const migratedWishlist = {
                id: 'wishlist_' + Date.now(),
                name: 'My Wishlist',
                occasion: 'custom',
                emoji: '⭐',
                privacy: 'link-only',
                shareId: generateShareId(),
                items: data.wishlist,
                createdAt: Date.now()
              };
              setWishlists([migratedWishlist]);
              setActiveWishlistId(migratedWishlist.id);
            }
            
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
    
    // Check if we should show the "Name your collection" prompt
    if (!hasShownUncategorizedPrompt) {
      const uncategorizedBrands = myBrands.filter(b => b.collection === 'Uncategorized');
      if (uncategorizedBrands.length === 2) {
        setShowNameCollectionPrompt(true);
        setHasShownUncategorizedPrompt(true);
        localStorage.setItem('hasShownUncategorizedPrompt', 'true');
      }
    }
    
    if (user) {
      const timeoutId = setTimeout(() => {
        saveToCloud();
      }, 2000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [myBrands, user, hasShownUncategorizedPrompt]);

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
    
    if (myBrands.length === 0 && shoppingBag.length === 0 && selectedGenders.length === 0 && wishlists.length === 0) {
      return;
    }
    
    try {
      setSyncStatus('syncing');
      await setDoc(doc(db, 'users', user.email), {
        brands: myBrands,
        genderPreferences: selectedGenders,
        shoppingBag: shoppingBag,
        wishlists: wishlists,
        activeWishlistId: activeWishlistId,
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

  const addBrand = (brandNameOverride = null) => {
    const brandName = brandNameOverride || newBrandName.trim();
    if (!brandName) return;
    
    const collection = showNewCollection 
      ? newCollectionName.trim() 
      : newBrandCollection;
    
    if (!collection && !brandNameOverride) return;
    
    const isFirstBrand = myBrands.length === 0;
    
    setMyBrands([...myBrands, {
      id: Date.now(),
      name: brandName,
      collection: collection || 'Uncategorized'
    }]);
    
    setNewBrandName('');
    setNewBrandCollection('');
    setNewCollectionName('');
    setShowNewCollection(false);
    setShowAddBrand(false);
    setShowSuggestions(false);
    showToast(`${brandName} added to your brands!`);
    if (isFirstBrand) {
      setTimeout(() => {
        setShowWalkthrough(true);
        setWalkthroughStep(0);
      }, 3000); // Show after fetching animation completes
    }

    // Show fetching animation for first brand
    if (isFirstBrand) {
      setFetchingDeals(true);
      setTimeout(() => {
        setFetchingDeals(false);
        setActiveTab('deals');
      }, 2500);
    }
  };

  const renameCollection = (oldName, newName) => {
    if (!newName.trim() || newName === oldName) {
      setEditingCollection(null);
      return;
    }
    
    const updatedBrands = myBrands.map(brand => 
      brand.collection === oldName 
        ? { ...brand, collection: newName.trim() }
        : brand
    );
    
    setMyBrands(updatedBrands);
    setEditingCollection(null);
    setEditingCollectionName('');
  };

  const handleOnboardingBrandRequest = (brandName) => {
    setRecommendBrand(brandName);
    setShowRecommendModal(true);
  };

  // Fetch approximate user count for social proof on landing page
  React.useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const snapshot = await getCountFromServer(collection(db, 'users'));
        setUserCount(snapshot.data().count);
      } catch {
        setUserCount(null);
      }
    };
    fetchUserCount();
  }, []);

  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
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
      setShowSuggestions(true); // Always show dropdown when typing (even if empty, to show request brand)
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

    // Open all links first
    Object.entries(byRetailer).forEach(([retailer, data], index) => {
      setTimeout(() => {
        handleDealClick(data.items[0].link);
      }, index * 500);
    });

    // Wait for all tabs to open, then clear bag and close modal
    setTimeout(() => {
      clearBag();
      setShowBagModal(false);
    }, (retailerCount * 500) + 1000);
  };

  // Save wishlists to localStorage and cloud
  useEffect(() => {
    localStorage.setItem('wishlists', JSON.stringify(wishlists));
    localStorage.setItem('activeWishlistId', activeWishlistId || '');
    
    if (user) {
      const timeoutId = setTimeout(() => {
        setDoc(doc(db, 'users', user.email), {
          wishlists: wishlists,
          activeWishlistId: activeWishlistId,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }, 2000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [wishlists, activeWishlistId, user]);

  // Create new wishlist
  const createWishlist = (name, occasion, emoji, privacy = 'link-only') => {
    const newWishlist = {
      id: 'wishlist_' + Date.now(),
      name: name.trim(),
      occasion: occasion,
      emoji: emoji,
      privacy: privacy,
      shareId: generateShareId(),
      items: [],
      createdAt: Date.now()
    };
    
    setWishlists([...wishlists, newWishlist]);
    setActiveWishlistId(newWishlist.id);
    return newWishlist;
  };

  // Delete wishlist
  const deleteWishlist = (wishlistId) => {
    const updated = wishlists.filter(w => w.id !== wishlistId);
    setWishlists(updated);
    
    if (activeWishlistId === wishlistId) {
      setActiveWishlistId(updated.length > 0 ? updated[0].id : null);
    }
  };

  // Update wishlist privacy
  const updateWishlistPrivacy = (wishlistId, privacy) => {
    const updated = wishlists.map(w => 
      w.id === wishlistId ? { ...w, privacy } : w
    );
    setWishlists(updated);
  };

  // Add item to wishlist (shows modal to choose which wishlist)
  const addToWishlist = (deal) => {
    if (wishlists.length === 0) {
      // No wishlists exist, create default and add
      const newWishlist = createWishlist('My Wishlist', 'custom', '⭐', 'link-only');
      const updated = wishlists.map(w => 
        w.id === newWishlist.id ? { ...w, items: [...w.items, deal] } : w
      );
      setWishlists(updated);
    } else if (wishlists.length === 1) {
      // Only one wishlist, add directly
      const updated = wishlists.map(w => {
        if (w.items.find(item => item.id === deal.id)) return w;
        return { ...w, items: [...w.items, deal] };
      });
      setWishlists(updated);
    } else {
      // Multiple wishlists, show selection modal
      setPendingWishlistItem(deal);
      setShowAddToWishlistModal(true);
    }
  };

  // Add item to specific wishlist
  const addToSpecificWishlist = (wishlistId, deal) => {
    const updated = wishlists.map(w => {
      if (w.id !== wishlistId) return w;
      if (w.items.find(item => item.id === deal.id)) return w;
      return { ...w, items: [...w.items, deal] };
    });
    setWishlists(updated);
    setPendingWishlistItem(null);
    setShowAddToWishlistModal(false);
  };

  // Remove item from wishlist
  const removeFromWishlist = (wishlistId, dealId) => {
    const updated = wishlists.map(w => 
      w.id === wishlistId 
        ? { ...w, items: w.items.filter(item => item.id !== dealId) }
        : w
    );
    setWishlists(updated);
  };

  // Check if item is in any wishlist
  const isInWishlist = (dealId) => {
    return wishlists.some(w => w.items.some(item => item.id === dealId));
  };

  // Get active wishlist
  const getActiveWishlist = () => {
    if (!activeWishlistId && wishlists.length > 0) {
      setActiveWishlistId(wishlists[0].id);
      return wishlists[0];
    }
    return wishlists.find(w => w.id === activeWishlistId) || wishlists[0] || null;
  };

  // Share wishlist via email
  const shareWishlist = async () => {
    if (!shareRecipient.trim()) {
      alert('Please enter an email address');
      return;
    }

    const wishlistToShare = wishlists.find(w => w.id === shareWishlistId) || wishlists[0];
    if (!wishlistToShare) {
      alert('No wishlist found to share');
      return;
    }

    setShareSending(true);

    const wishlistText = wishlistToShare.items.map((item, index) =>
      `${index + 1}. ${item.product} - ${item.brand} - $${item.salePrice} (${item.discount} off)\n${item.link}`
    ).join('\n\n');

    const totalValue = wishlistToShare.items.reduce((sum, item) => sum + item.salePrice, 0).toFixed(2);
    const shareLink = `${window.location.origin}/wishlist/${wishlistToShare.shareId}`;

    const messageBody = shareMessage
      ? `${shareMessage}\n\n=== ${wishlistToShare.name.toUpperCase()} ===\n\n${wishlistText}\n\nView full wishlist: ${shareLink}`
      : `Check out my ${wishlistToShare.emoji} ${wishlistToShare.name} from BrandSnobs!\n\n${wishlistText}\n\nView full wishlist: ${shareLink}`;

    // Save share record to Firestore first (so it's never lost even if email fails)
    try {
      await setDoc(doc(collection(db, 'wishlist_shares')), {
        from: user?.email || 'anonymous',
        to: shareRecipient.trim(),
        wishlistName: wishlistToShare.name,
        wishlistId: wishlistToShare.id,
        shareId: wishlistToShare.shareId,
        shareLink,
        message: messageBody,
        sharedAt: new Date().toISOString(),
      });
    } catch (fsError) {
      console.warn('Firestore share record failed (non-fatal):', fsError);
    }

    // Send email via Vercel serverless function (bypasses CORS restrictions)
    try {
      const response = await fetch('/api/send-wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: shareRecipient.trim(),
          senderName: user?.email || 'A BrandSnobs user',
          wishlistName: wishlistToShare.name,
          wishlistEmoji: wishlistToShare.emoji,
          message: shareMessage.trim() || '',
          shareLink,
          items: wishlistToShare.items,
          totalValue,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      alert(`Wishlist shared! ${shareRecipient} will receive an email with all the details.`);
      setShowShareModal(false);
      setShareRecipient('');
      setShareMessage('');
    } catch (error) {
      console.error('Share error:', error);
      // Fall back to clipboard
      try {
        await navigator.clipboard.writeText(shareLink);
        alert(`Email failed — but the share link has been copied to your clipboard! Paste it in a message to ${shareRecipient}.`);
        setShowShareModal(false);
        setShareRecipient('');
        setShareMessage('');
      } catch {
        prompt('Copy this share link and send it manually:', shareLink);
      }
    } finally {
      setShareSending(false);
    }
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
          'service_9b98jq6',
          'template_7sri3sr',
          {
            brand_name: recommendBrand.trim(),
            submitter_email: recommendEmail.trim() || 'Not provided',
            user_email: user?.email || 'Anonymous',
            to_email: 'admin@brandsnobs.com',
            message: `New brand recommendation: ${recommendBrand.trim()}`
          },
          'QPiBFFlW7aGv6W0UP'
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

  const loadCollection = (collectionInput) => {
    // Handle both object (from recommendations tab) and string (from onboarding)
    const collection = typeof collectionInput === 'string' 
      ? BRAND_COLLECTIONS.find(c => c.name === collectionInput)
      : collectionInput;
    
    if (!collection) return;
    
    const isFirstBrands = myBrands.length === 0;
    
    const newBrands = collection.brands.filter(
      collBrand => !myBrands.some(myBrand => myBrand.name === collBrand.name)
    ).map(brand => ({
      id: Date.now() + Math.random(),
      name: brand.name,
      collection: collection.name
    }));
    
    setMyBrands([...myBrands, ...newBrands]);
    
    // Show fetching animation if these are first brands
    if (isFirstBrands) {
      setFetchingDeals(true);
      setTimeout(() => {
        setFetchingDeals(false);
        setActiveTab('deals');
      }, 2500);
    } else {
      setActiveTab('brands');
    }
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
      // Keyword maps for each gender — checks product title, category, and gender field
      const GENDER_KEYWORDS = {
        men:    ['men', "men's", 'mens', 'male', 'masculine', 'husband', 'boyfriend', 'guy', 'guys', 'his'],
        women:  ['women', "women's", 'womens', 'woman', 'female', 'feminine', 'ladies', 'lady', "lady's", 'her', 'hers', 'wife', 'girlfriend'],
        boys:   ['boys', "boys'", "boy's", 'boy', 'youth male', 'kids male', 'little boy'],
        girls:  ['girls', "girls'", "girl's", 'girl', 'youth female', 'kids female', 'little girl'],
        unisex: ['unisex', 'gender neutral', 'gender-neutral', 'all genders', 'everyone'],
      };

      const detectGender = (deal) => {
        const explicitGender = (deal.gender || '').toLowerCase().trim();

        // null gender = untagged, show only when no filter active (handled below)
        if (!explicitGender || explicitGender === 'null') return null;

        // Unisex shows under all filters
        if (explicitGender === 'unisex') return ['men', 'women', 'boys', 'girls', 'unisex'];

        // Generic kids shows under both boys and girls
        if (explicitGender === 'kids') return ['boys', 'girls'];

        // Exact matches
        if (explicitGender === 'women') return ['women'];
        if (explicitGender === 'men') return ['men'];
        if (explicitGender === 'girls') return ['girls'];
        if (explicitGender === 'boys') return ['boys'];

        // Fallback keyword scan for older deals in Firestore
        const searchText = [deal.product || '', deal.category || ''].join(' ').toLowerCase();
        const FRONTEND_KEYWORDS = {
          women:  ["women's", 'womens', 'women ', 'ladies', 'female', 'dress', 'skirt', 'bra', 'blouse'],
          men:    ["men's", 'mens', 'men ', 'masculine', 'male ', 'beard', 'necktie'],
          girls:  ["girls'", 'girls ', "girl's"],
          boys:   ["boys'", 'boys ', "boy's"],
          unisex: ['unisex', 'gender neutral'],
        };
        const matched = new Set();
        for (const [gender, keywords] of Object.entries(FRONTEND_KEYWORDS)) {
          if (keywords.some(kw => searchText.includes(kw))) matched.add(gender);
        }
        if (matched.has('unisex')) return ['men', 'women', 'boys', 'girls', 'unisex'];
        if (matched.size > 0) return [...matched];

        // Truly untagged — return null
        return null;
      };

      result = result.filter(deal => {
        const dealGenders = detectGender(deal);
        // null means untagged — only show when no specific gender filter conflicts
        // i.e. hide from filtered results to keep filters meaningful
        if (dealGenders === null) return false;
        return selectedGenders.some(g => dealGenders.includes(g));
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

  // ============================================================
  // APP-PART-3-SIMPLE-AUTH.jsx
  // Contains: Header, Tab Navigation, Deals Tab, Brands Tab,
  //           Profile Tab, Recommendations Tab
  // ============================================================

  // ── Total wishlist item count (across ALL wishlists) ────────
  const totalWishlistItems = wishlists.reduce((sum, w) => sum + w.items.length, 0);

  return (
    <div className="min-h-screen bg-neutral-50">

      {/* ── Onboarding ───────────────────────────────────────── */}
      {myBrands.length === 0 && !fetchingDeals && (
        <OnboardingScreen
          onAddBrand={(brand) => {
            setNewBrandName(brand);
            addBrand(brand);
          }}
          onLoadCollection={loadCollection}
          onRequestBrand={handleOnboardingBrandRequest}
          brandSearchQuery={newBrandName}
          onBrandSearchChange={handleBrandInputChange}
          brandSuggestions={brandSuggestions}
          showSuggestions={showSuggestions}
          setShowSuggestions={setShowSuggestions}
          onSignIn={() => setShowSignIn(true)}
          onHowItWorks={() => setShowHowItWorks(true)}
          onPrivacy={() => setShowPrivacyPolicy(true)}
          onTerms={() => setShowTermsOfService(true)}
        />
      )}

      {/* ── Fetching animation ───────────────────────────────── */}
      {fetchingDeals && <FetchingDealsAnimation />}

      {/* ── Header ───────────────────────────────────────────── */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

          {/* Logo — click to scroll back to top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 hover:opacity-75 transition-opacity"
          >
            <ShoppingBag className="w-7 h-7 text-neutral-900" />
            <span className="font-display text-xl font-bold text-neutral-900 tracking-tight">
              BrandSnobs
            </span>
          </button>

          {/* Right actions */}
          <div className="flex items-center gap-2">

            {/* Sync status */}
            {user && syncStatus === 'syncing' && (
              <span className="text-xs text-neutral-400 flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin" /> Saving…
              </span>
            )}
            {user && syncStatus === 'synced' && (
              <span className="text-xs text-green-600 flex items-center gap-1">
                <Cloud className="w-3 h-3" /> Saved
              </span>
            )}

            {/* Shopping bag */}
            <button
              onClick={() => setShowBagModal(true)}
              className="relative p-2 text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <ShoppingBag className="w-6 h-6" />
              {shoppingBag.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-neutral-900 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-semibold">
                  {shoppingBag.length}
                </span>
              )}
            </button>

            {/* Wishlist heart — shows total across ALL wishlists */}
            <button
              onClick={() => setShowWishlistModal(true)}
              className="relative p-2 text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <Heart
                className="w-6 h-6"
                fill={totalWishlistItems > 0 ? 'currentColor' : 'none'}
                color={totalWishlistItems > 0 ? '#e11d48' : 'currentColor'}
              />
              {totalWishlistItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-semibold">
                  {totalWishlistItems}
                </span>
              )}
            </button>

            {/* Auth */}
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500 hidden sm:block truncate max-w-[120px]">
                  {user.email}
                </span>
                <button
                  onClick={signOut}
                  className="p-2 text-neutral-500 hover:text-neutral-700"
                  title="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSignIn(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* ── Tab navigation ───────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto pb-0 scrollbar-hide">
            {[
              { id: 'deals', label: 'Deals', count: filteredDeals.length },
              { id: 'brands', label: 'My Brands', count: myBrands.length },
              { id: 'profile', label: 'Profile' },
              { id: 'recommendations', label: 'Inspiration' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-neutral-900 text-neutral-900'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.id
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-200 text-neutral-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── Main content ─────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 py-6">

        {/* ══════════════════════════════════════════════════════
            DEALS TAB
        ══════════════════════════════════════════════════════ */}
        {activeTab === 'deals' && (
          <div>
            {/* Stats bar */}
            {myBrands.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="bg-white rounded-xl border border-neutral-200 p-4 text-center">
                  <p className="text-2xl font-bold text-neutral-900">{stats.totalBrands}</p>
                  <p className="text-xs text-neutral-500 mt-1">Brands Tracked</p>
                </div>
                <div className="bg-white rounded-xl border border-neutral-200 p-4 text-center">
                  <p className="text-2xl font-bold text-neutral-900">{stats.totalDeals}</p>
                  <p className="text-xs text-neutral-500 mt-1">Live Deals</p>
                </div>
                <div className="bg-white rounded-xl border border-neutral-200 p-4 text-center">
                  <p className="text-2xl font-bold text-neutral-900">{stats.avgDiscount}%</p>
                  <p className="text-xs text-neutral-500 mt-1">Avg. Discount</p>
                </div>
                <div className="bg-white rounded-xl border border-neutral-200 p-4 text-center">
                  <p className="text-2xl font-bold text-neutral-900 truncate">
                    {stats.hotBrand ? stats.hotBrand.name.split(' ')[0] : '—'}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    {stats.hotBrand ? `Hottest (${stats.hotBrand.avgDiscount}% avg)` : 'No deals yet'}
                  </p>
                </div>
              </div>
            )}

            {/* Gender filter */}
            {myBrands.length > 0 && (
              <GenderPreference
                selectedGenders={selectedGenders}
                onGenderChange={setSelectedGenders}
              />
            )}

            {/* Side-by-side search bars + filters */}
            {myBrands.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-3 mb-6 items-end">

                {/* LEFT: Add Brand search */}
                <div className="flex-1">
                  <label className="block text-xs font-medium text-neutral-500 mb-1 ml-1">Add Brand</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      value={newBrandName}
                      onChange={(e) => handleBrandInputChange(e.target.value)}
                      placeholder="Search to add brand..."
                      className="w-full pl-9 pr-4 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                      onFocus={() => newBrandName && setShowSuggestions(brandSuggestions.length > 0)}
                    />
                    {newBrandName && (
                      <button
                        onClick={() => { setNewBrandName(''); setShowSuggestions(false); }}
                        className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    {/* Suggestions dropdown */}
                    {showSuggestions && brandSuggestions.length > 0 && (
                      <div className="absolute z-20 w-full mt-1 bg-white border border-neutral-300 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                        {brandSuggestions.map((brand, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              // Pre-fill the Add Brand modal and open it
                              setNewBrandName(brand);
                              setShowSuggestions(false);
                              setBrandSuggestions([]);
                              setShowAddBrand(true);
                            }}
                            className="w-full text-left px-4 py-2.5 hover:bg-neutral-100 transition-colors text-sm font-medium text-neutral-900 border-b border-neutral-100 last:border-b-0"
                          >
                            <span>{brand}</span>
                            <span className="text-xs text-neutral-400 ml-2">— tap to add</span>
                          </button>
                        ))}
                      </div>
                    )}
                    {/* Request brand when not found */}
                    {newBrandName && brandSuggestions.length === 0 && showSuggestions && (
                      <div className="absolute z-20 w-full mt-1 bg-white border border-neutral-300 rounded-xl shadow-lg p-4 text-center">
                        <p className="text-sm text-neutral-600 mb-3">
                          Can't find <strong>"{newBrandName}"</strong>?
                        </p>
                        <button
                          onClick={() => {
                            handleOnboardingBrandRequest(newBrandName);
                            setNewBrandName('');
                            setShowSuggestions(false);
                          }}
                          className="w-full bg-neutral-900 text-white py-2 px-4 rounded-lg hover:bg-neutral-800 text-sm font-medium flex items-center justify-center gap-2"
                        >
                          <TrendingUp className="w-4 h-4" />
                          Request This Brand
                        </button>
                        <p className="text-xs text-neutral-500 mt-2">
                          ⚡ We'll add it in less than 24 hours!
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT: Search Products */}
                <div className="flex-1">
                  <label className="block text-xs font-medium text-neutral-500 mb-1 ml-1">Search Products</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search your deals..."
                      className="w-full pl-9 pr-4 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {searchQuery && (
                    <p className="text-xs text-neutral-400 mt-1 ml-1">
                      {filteredDeals.length} result{filteredDeals.length !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>

                {/* Filters + refresh */}
                <div className="flex gap-2">
                  <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-1 ml-1">Sort</label>
                    <select
                      value={dealSort}
                      onChange={(e) => setDealSort(e.target.value)}
                      className="px-3 py-2 border border-neutral-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-neutral-900"
                    >
                      <option value="discount">Best Discount</option>
                      <option value="price-low">Price: Low–High</option>
                      <option value="price-high">Price: High–Low</option>
                      <option value="brand">Brand A–Z</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-1 ml-1">Filter</label>
                    <select
                      value={dealFilter}
                      onChange={(e) => setDealFilter(e.target.value)}
                      className="px-3 py-2 border border-neutral-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-neutral-900"
                    >
                      <option value="all">All Discounts</option>
                      <option value=">30%">30%+ Off</option>
                      <option value=">50%">50%+ Off</option>
                    </select>
                  </div>
                  <button
                    onClick={refreshDeals}
                    disabled={refreshing}
                    className="p-2 border border-neutral-300 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors self-end"
                    title="Refresh deals"
                  >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  </button>
                </div>

              </div>
            )}

            {/* Deal cards grid */}
            {dealsLoading ? (
              <div className="flex flex-col items-center justify-center py-24 text-neutral-400">
                <RefreshCw className="w-8 h-8 animate-spin mb-4" />
                <p className="text-sm">Loading deals…</p>
              </div>
            ) : dealsError ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <p className="text-red-700 font-medium">{dealsError}</p>
                <button
                  onClick={refreshDeals}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                >
                  Try Again
                </button>
              </div>
            ) : filteredDeals.length === 0 && myBrands.length > 0 ? (
              <div className="text-center py-24 text-neutral-400">
                <Tag className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium text-neutral-600">No deals found</p>
                <p className="text-sm mt-1">
                  {searchQuery ? 'Try a different search term.' : 'Check back soon — deals are updated regularly.'}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-4 px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm hover:bg-neutral-800"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <>
                {lastUpdated && (
                  <p className="text-xs text-neutral-400 mb-4">
                    Last updated: {new Date(lastUpdated).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                )}
                {/* Group deals by the user's named collections */}
                {(() => {
                  const allWishlistItems = wishlists.flatMap(w => w.items);
                  const dealCard = (deal) => (
                    <LuxuryDealCard
                      key={deal.id}
                      deal={deal}
                      onAddToBag={addToBag}
                      onDealClick={handleDealClick}
                      wishlist={allWishlistItems}
                      onAddToWishlist={addToWishlist}
                      onRemoveFromWishlist={(dealId) => {
                        const containing = wishlists.find(w => w.items.some(i => i.id === dealId));
                        if (containing) removeFromWishlist(containing.id, dealId);
                      }}
                    />
                  );

                  // If searching, show flat list
                  if (searchQuery) {
                    return (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
                        {filteredDeals.map(deal => dealCard(deal))}
                      </div>
                    );
                  }

                  // Group by collection
                  return userCollections.map(collName => {
                    const brandsInColl = myBrands
                      .filter(b => b.collection === collName)
                      .map(b => b.name.toLowerCase());
                    const collDeals = filteredDeals.filter(d =>
                      brandsInColl.includes((d.brand || '').toLowerCase())
                    );
                    if (collDeals.length === 0) return null;
                    const isCollapsedDeals = collapsedCollections.includes('deals__' + collName);
                    return (
                      <div key={collName} className="mb-8">
                        <button
                          onClick={() => toggleCollectionCollapse('deals__' + collName)}
                          className="w-full flex items-center justify-between mb-3 group"
                        >
                          <h3 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
                            {collName}
                            <span className="text-xs font-normal text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
                              {collDeals.length} deal{collDeals.length !== 1 ? 's' : ''}
                            </span>
                          </h3>
                          {isCollapsedDeals
                            ? <ChevronDown className="w-5 h-5 text-neutral-400 group-hover:text-neutral-600" />
                            : <ChevronUp className="w-5 h-5 text-neutral-400 group-hover:text-neutral-600" />
                          }
                        </button>
                        {!isCollapsedDeals && (
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
                            {collDeals.map(deal => dealCard(deal))}
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}
              </>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            BRANDS TAB
        ══════════════════════════════════════════════════════ */}
        {activeTab === 'brands' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-neutral-900">My Brands</h2>
              <button
                onClick={() => setShowAddBrand(true)}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Brand
              </button>
            </div>

            {/* Collections */}
            {userCollections.map(collectionName => {
              const brandsInCollection = myBrands.filter(b => b.collection === collectionName);
              const isCollapsed = collapsedCollections.includes(collectionName);

              return (
                <div key={collectionName} className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    {editingCollection === collectionName ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={editingCollectionName}
                          onChange={(e) => setEditingCollectionName(e.target.value)}
                          className="flex-1 px-3 py-1 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-neutral-900"
                          autoFocus
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') renameCollection(collectionName, editingCollectionName);
                          }}
                        />
                        <button
                          onClick={() => renameCollection(collectionName, editingCollectionName)}
                          className="text-xs px-3 py-1 bg-neutral-900 text-white rounded-lg"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingCollection(null)}
                          className="text-xs px-3 py-1 bg-neutral-200 text-neutral-700 rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingCollection(collectionName);
                          setEditingCollectionName(collectionName);
                        }}
                        className="text-lg font-semibold text-neutral-900 hover:text-neutral-600 transition-colors text-left"
                      >
                        {collectionName}
                      </button>
                    )}
                    <button
                      onClick={() => toggleCollectionCollapse(collectionName)}
                      className="p-1 text-neutral-400 hover:text-neutral-600"
                    >
                      {isCollapsed
                        ? <ChevronDown className="w-5 h-5" />
                        : <ChevronUp className="w-5 h-5" />
                      }
                    </button>
                  </div>

                  {!isCollapsed && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {brandsInCollection.map(brand => {
                        const brandImage = getBrandImage(brand.name);
                        const brandDealCount = deals.filter(d =>
                          (d.brand || '').toLowerCase() === brand.name.toLowerCase()
                        ).length;

                        return (
                          <div
                            key={brand.id}
                            className="bg-white rounded-xl border border-neutral-200 p-4 relative group hover:border-neutral-300 transition-colors"
                          >
                            <button
                              onClick={() => removeBrand(brand.id)}
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-neutral-400 hover:text-red-500"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            {brandImage ? (
                              <img
                                src={brandImage}
                                alt={brand.name}
                                className="w-12 h-12 object-cover rounded-lg mb-3 mx-auto"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-neutral-100 rounded-lg mb-3 mx-auto flex items-center justify-center">
                                <ShoppingBag className="w-6 h-6 text-neutral-400" />
                              </div>
                            )}
                            <p className="text-sm font-medium text-neutral-900 text-center truncate">
                              {brand.name}
                            </p>
                            <p className="text-xs text-neutral-500 text-center mt-1">
                              {brandDealCount} deal{brandDealCount !== 1 ? 's' : ''}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {myBrands.length === 0 && (
              <div className="text-center py-16 text-neutral-400">
                <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium text-neutral-600">No brands yet</p>
                <p className="text-sm mt-1">Add your favorite brands to start tracking deals.</p>
              </div>
            )}

          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            PROFILE TAB
        ══════════════════════════════════════════════════════ */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Your Profile</h2>

            <div className="bg-white rounded-2xl border border-neutral-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Shipping Info</h3>
              <p className="text-sm text-neutral-500 mb-4">
                Saved here so you can copy it quickly at checkout.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: 'firstName', label: 'First Name', placeholder: 'Jane' },
                  { key: 'lastName', label: 'Last Name', placeholder: 'Doe' },
                  { key: 'email', label: 'Email', placeholder: 'jane@example.com' },
                  { key: 'phone', label: 'Phone', placeholder: '(555) 000-0000' },
                  { key: 'address', label: 'Address', placeholder: '123 Main St', fullWidth: true },
                  { key: 'city', label: 'City', placeholder: 'New York' },
                  { key: 'state', label: 'State', placeholder: 'NY' },
                  { key: 'zip', label: 'Zip Code', placeholder: '10001' },
                ].map(field => (
                  <div key={field.key} className={field.fullWidth ? 'col-span-2' : ''}>
                    <label className="block text-xs font-medium text-neutral-600 mb-1">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      value={shippingProfile[field.key] || ''}
                      onChange={(e) => setShippingProfile({ ...shippingProfile, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Your Sizes</h3>
              <p className="text-sm text-neutral-500 mb-4">
                We'll highlight deals that match your size.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: 'shirtSize', label: 'Shirt Size', placeholder: 'M' },
                  { key: 'shoeSize', label: 'Shoe Size', placeholder: '10' },
                  { key: 'pantsWaist', label: 'Pants Waist', placeholder: '32' },
                  { key: 'pantsInseam', label: 'Pants Inseam', placeholder: '30' },
                  { key: 'dressSize', label: 'Dress Size', placeholder: '8' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="block text-xs font-medium text-neutral-600 mb-1">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      value={shippingProfile[field.key] || ''}
                      onChange={(e) => setShippingProfile({ ...shippingProfile, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            RECOMMENDATIONS / DISCOVER TAB
        ══════════════════════════════════════════════════════ */}
        {activeTab === 'recommendations' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-neutral-900">Inspiration</h2>
              <button
                onClick={() => setShowRecommendModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 text-sm font-medium"
              >
                <TrendingUp className="w-4 h-4" />
                Request Brand
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {BRAND_COLLECTIONS.map(collection => {
                const alreadyAdded = collection.brands.filter(b =>
                  myBrands.some(mb => mb.name === b.name)
                ).length;
                const total = collection.brands.length;

                return (
                  <div
                    key={collection.id}
                    className="bg-white rounded-xl border border-neutral-200 p-5 hover:border-neutral-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0 mr-3">
                        <h3 className="font-semibold text-neutral-900">{collection.name}</h3>
                        <p className="text-xs text-neutral-500 mt-0.5">{collection.description}</p>
                      </div>
                      <button
                        onClick={() => loadCollection(collection)}
                        disabled={alreadyAdded === total}
                        className="flex-shrink-0 px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-medium hover:bg-neutral-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {alreadyAdded === total ? 'Added ✓' : alreadyAdded > 0 ? 'Add Rest' : 'Add All'}
                      </button>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mt-2">
                      {collection.brands.slice(0, 10).map(brand => {
                        const isAdded = myBrands.some(mb => mb.name === brand.name);
                        // Known domain lookup — Clearbit needs the real domain to find logos
                        const BRAND_DOMAINS = {
                          'Gucci': 'gucci.com',
                          'Prada': 'prada.com',
                          'Louis Vuitton': 'louisvuitton.com',
                          'Hermès': 'hermes.com',
                          'Goyard': 'goyard.com',
                          'Fendi': 'fendi.com',
                          'Saint Laurent': 'ysl.com',
                          'Chloé': 'chloe.com',
                          'The Row': 'therow.com',
                          'Burberry': 'burberry.com',
                          'Dolce & Gabbana': 'dolcegabbana.com',
                          'Christian Louboutin': 'christianlouboutin.com',
                          'Jimmy Choo': 'jimmychoo.com',
                          'Stuart Weitzman': 'stuartweitzman.com',
                          'Cole Haan': 'colehaan.com',
                          'Feragamo': 'ferragamo.com',
                          'Lucchese': 'lucchese.com',
                          'Tumi': 'tumi.com',
                          'Coach': 'coach.com',
                          'Nike': 'nike.com',
                          'Adidas': 'adidas.com',
                          'Lululemon': 'lululemon.com',
                          'Alo': 'aloyoga.com',
                          'Vuori': 'vuoriclothing.com',
                          'On Running': 'on.com',
                          'Athleta': 'athleta.gap.com',
                          'Under Armour': 'underarmour.com',
                          'YoungLA': 'youngla.com',
                          'Gymshark': 'gymshark.com',
                          'Calvin Klein': 'calvinklein.com',
                          'Donna Karan': 'donnakaran.com',
                          'Free People': 'freepeople.com',
                          'Kate Spade': 'katespade.com',
                          'Marc Jacobs': 'marcjacobs.com',
                          'Michael Kors': 'michaelkors.com',
                          'Oscar de la Renta': 'oscardelarenta.com',
                          'Spanx': 'spanx.com',
                          'Tom Ford': 'tomford.com',
                          'Tory Burch': 'toryburch.com',
                          'Vera Wang': 'verawang.com',
                          'Abercrombie & Fitch': 'abercrombie.com',
                          'American Giant': 'american-giant.com',
                          'Brooks Brothers': 'brooksbrothers.com',
                          'Carhartt': 'carhartt.com',
                          'Chubbies': 'chubbiesshorts.com',
                          'Everlane': 'everlane.com',
                          'Kith': 'kith.com',
                          'Lacoste': 'lacoste.com',
                          'Levi Strauss': 'levi.com',
                          'Madewell': 'madewell.com',
                          'Peter Millar': 'petermillar.com',
                          'Polo Ralph Lauren': 'ralphlauren.com',
                          'Rhone': 'rhone.com',
                          'Tommy Bahama': 'tommybahama.com',
                          'TravisMatthew': 'travismathew.com',
                          'Vineyard Vines': 'vineyardvines.com',
                          'Wrangler': 'wrangler.com',
                          'Allbirds': 'allbirds.com',
                          'BIRKENSTOCK': 'birkenstock.com',
                          'Bombas': 'bombas.com',
                          'Crocs': 'crocs.com',
                          'Havaianas': 'havaianas.com',
                          'OluKai': 'olukai.com',
                          'OOFOS': 'oofos.com',
                          'Reef': 'reef.com',
                          'Sanuk': 'sanuk.com',
                          'Teva': 'teva.com',
                          'UGG': 'ugg.com',
                          'Costa': 'costadelmar.com',
                          'Gorjana': 'gorjana.com',
                          'Kendra Scott': 'kendrascott.com',
                          'Oakley': 'oakley.com',
                          'Ray-Ban': 'ray-ban.com',
                          'The North Face': 'thenorthface.com',
                          'Columbia': 'columbia.com',
                          'Yeti': 'yeti.com',
                          'Pelagic': 'pelagicgear.com',
                          'Ariat': 'ariat.com',
                          'Cinch': 'cinchwestern.com',
                          'Justin Boots': 'justinboots.com',
                          'Stetson': 'stetson.com',
                          'Tony Lama': 'tonylama.com',
                          'Thom Browne': 'thombrowne.com',
                          'Cult Gaia': 'cultgaia.com',
                          'American Eagle': 'ae.com',
                          'Brandy Melville': 'brandymelvilleusa.com',
                          'Comfrt': 'wearecomfrt.com',
                          'Fear of God Essentials': 'fearofgod.com',
                          'Hellstar': 'hellstar.com',
                          'Hollister': 'hollisterco.com',
                          'RTIC Outdoors': 'rticoutdoors.com',
                          'Supreme': 'supremenewyork.com',
                          "Victoria's Secret": 'victoriassecret.com',
                        };
                        const domain = BRAND_DOMAINS[brand.name] || (brand.name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com');
                        return (
                          <button
                            key={brand.name}
                            onClick={() => {
                              if (!isAdded) {
                                setNewBrandName(brand.name);
                                setShowAddBrand(true);
                              }
                            }}
                            disabled={isAdded}
                            title={isAdded ? `${brand.name} (added)` : `Add ${brand.name}`}
                            className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all ${
                              isAdded
                                ? 'bg-emerald-600 border-emerald-600 cursor-default'
                                : 'bg-white border-neutral-200 hover:border-neutral-400 hover:shadow-sm cursor-pointer'
                            }`}
                          >
                            <BrandLogo domain={domain} name={brand.name} />
                            <span className={`text-xs font-medium text-center leading-tight line-clamp-2 ${
                              isAdded ? 'text-white font-semibold' : 'text-neutral-700'
                            }`}>
                              {brand.name}
                            </span>
                            {isAdded && (
                              <span className="text-xs text-neutral-300">✓</span>
                            )}
                          </button>
                        );
                      })}
                      {collection.brands.length > 10 && (
                        <div className="flex flex-col items-center justify-center p-2 rounded-xl border border-dashed border-neutral-300 text-neutral-400">
                          <span className="text-sm font-medium">+{collection.brands.length - 10}</span>
                          <span className="text-xs">more</span>
                        </div>
                      )}
                    </div>

                    {alreadyAdded > 0 && alreadyAdded < total && (
                      <p className="text-xs text-neutral-400 mt-2">
                        {alreadyAdded} of {total} added
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* ── App footer ────────────────────────────────────── */}
      {myBrands.length > 0 && (
        <footer className="border-t border-neutral-200 mt-8 py-6 text-center">
          <div className="flex items-center justify-center gap-4 text-xs text-neutral-400">
            <button onClick={() => setShowHowItWorks(true)} className="hover:text-neutral-600 underline">How It Works</button>
            <span>·</span>
            <button onClick={() => setShowPrivacyPolicy(true)} className="hover:text-neutral-600 underline">Privacy Policy</button>
            <span>·</span>
            <button onClick={() => setShowTermsOfService(true)} className="hover:text-neutral-600 underline">Terms of Service</button>
            <span>·</span>
            <a href="mailto:admin@brandsnobs.com" className="hover:text-neutral-600 underline">Contact</a>
          </div>
          <p className="text-xs text-neutral-300 mt-2">© {new Date().getFullYear()} BrandSnobs. All rights reserved.</p>
        </footer>
      )}

      {/* ── Add Brand modal (global — works from any tab) ─── */}
      {showAddBrand && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-neutral-900">Add a Brand</h3>
              <button
                onClick={() => {
                  setShowAddBrand(false);
                  setNewBrandName('');
                  setNewBrandCollection('');
                  setShowSuggestions(false);
                }}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Brand name */}
            <div className="mb-4 relative">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Brand Name
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  value={newBrandName}
                  onChange={(e) => handleBrandInputChange(e.target.value)}
                  placeholder="Search brands…"
                  className="w-full pl-9 pr-4 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                  autoFocus
                />
              </div>

              {showSuggestions && brandSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-neutral-300 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                  {brandSuggestions.map((brand, i) => (
                    <button
                      key={i}
                      onClick={() => selectBrandSuggestion(brand)}
                      className="w-full text-left px-4 py-2.5 hover:bg-neutral-100 transition-colors text-sm font-medium text-neutral-900 border-b border-neutral-100 last:border-b-0"
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              )}

              {newBrandName && brandSuggestions.length === 0 && showSuggestions && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-neutral-300 rounded-xl shadow-lg p-4 text-center">
                  <p className="text-sm text-neutral-600 mb-3">
                    Can't find <strong>"{newBrandName}"</strong>?
                  </p>
                  <button
                    onClick={() => handleOnboardingBrandRequest(newBrandName)}
                    className="w-full bg-neutral-900 text-white py-2 px-4 rounded-lg hover:bg-neutral-800 text-sm font-medium"
                  >
                    Request This Brand
                  </button>
                </div>
              )}
            </div>

            {/* Collection picker */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Add to Collection
              </label>
              {!showNewCollection ? (
                <>
                  <select
                    value={newBrandCollection}
                    onChange={(e) => setNewBrandCollection(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-neutral-900 mb-2"
                  >
                    <option value="">Choose a collection…</option>
                    {userCollections.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => setShowNewCollection(true)}
                    className="text-sm text-neutral-600 underline hover:text-neutral-900"
                  >
                    + Create new collection
                  </button>
                </>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    placeholder="Collection name…"
                    className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-neutral-900"
                    autoFocus
                  />
                  <button
                    onClick={() => setShowNewCollection(false)}
                    className="text-sm text-neutral-500 hover:text-neutral-700"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => addBrand()}
                disabled={!newBrandName.trim() || (!newBrandCollection && !newCollectionName.trim())}
                className="flex-1 bg-neutral-900 text-white py-2 rounded-lg hover:bg-neutral-800 transition-colors text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Add Brand
              </button>
              <button
                onClick={() => {
                  setShowAddBrand(false);
                  setNewBrandName('');
                  setNewBrandCollection('');
                  setShowSuggestions(false);
                }}
                className="flex-1 bg-neutral-200 text-neutral-700 py-2 rounded-lg hover:bg-neutral-300 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toastMessage} visible={toastVisible} />

      {showWalkthrough && (
        <OnboardingWalkthrough
          step={walkthroughStep}
          onNext={() => setWalkthroughStep(s => s + 1)}
          onDone={() => {
            setShowWalkthrough(false);
            setWalkthroughStep(0);
          }}
        />
      )}

      {/* ── How It Works modal ────────────────────────────── */}
      {showHowItWorks && (
        <HowItWorksModal onClose={() => setShowHowItWorks(false)} />
      )}

      {/* ── Privacy Policy modal ───────────────────────────── */}
      {showPrivacyPolicy && (
        <PrivacyPolicyModal onClose={() => setShowPrivacyPolicy(false)} />
      )}

      {/* ── Terms of Service modal ─────────────────────────── */}
      {showTermsOfService && (
        <TermsOfServiceModal onClose={() => setShowTermsOfService(false)} />
      )}

      {/* ── Sign-in modal ──────────────────────────────────── */}
      {showSignIn && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-neutral-900">Sign In</h3>
              <button onClick={() => setShowSignIn(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-sm text-neutral-600 mb-4">
              Enter your email to sync your brands and wishlist across devices.
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-neutral-900 mb-3"
              onKeyPress={(e) => e.key === 'Enter' && signIn()}
              autoFocus
            />
            {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
            <div className="flex gap-3">
              <button
                onClick={signIn}
                disabled={signingIn}
                className="flex-1 bg-neutral-900 text-white py-2 rounded-lg hover:bg-neutral-800 transition-colors text-sm font-medium disabled:opacity-50"
              >
                {signingIn ? 'Signing in…' : 'Continue'}
              </button>
              <button
                onClick={() => setShowSignIn(false)}
                className="flex-1 bg-neutral-200 text-neutral-700 py-2 rounded-lg hover:bg-neutral-300 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Shopping bag modal ─────────────────────────────── */}
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

      {/* ── Wishlists manager modal ────────────────────────── */}
      {showWishlistModal && (
        <WishlistsManagerModal
          wishlists={wishlists}
          onClose={() => setShowWishlistModal(false)}
          onRemoveItem={removeFromWishlist}
          onDeleteWishlist={deleteWishlist}
          onCreateNew={() => {
            setShowWishlistModal(false);
            setShowCreateWishlistModal(true);
          }}
          onShare={(wishlistId) => {
            setShareWishlistId(wishlistId);
            setShowWishlistModal(false);
            setShowShareModal(true);
          }}
          onAddToBag={addToBag}
          shippingProfile={shippingProfile}
        />
      )}

      {/* ── Create wishlist modal ──────────────────────────── */}
      {showCreateWishlistModal && (
        <CreateWishlistModal
          onClose={() => setShowCreateWishlistModal(false)}
          onCreate={createWishlist}
        />
      )}

      {/* ── Add-to-wishlist modal (multi-wishlist picker) ──── */}
      {showAddToWishlistModal && (
        <AddToWishlistModal
          onClose={() => {
            setShowAddToWishlistModal(false);
            setPendingWishlistItem(null);
          }}
          wishlists={wishlists}
          pendingItem={pendingWishlistItem}
          onAddToWishlist={addToSpecificWishlist}
          onCreateNew={() => {
            setShowAddToWishlistModal(false);
            setShowCreateWishlistModal(true);
          }}
        />
      )}

      {/* ── Share wishlist modal ───────────────────────────── */}
      {showShareModal && (
        <ShareWishlistModal
          onClose={() => {
            setShowShareModal(false);
            setShareRecipient('');
            setShareMessage('');
          }}
          wishlists={wishlists}
          shareWishlistId={shareWishlistId}
          setShareWishlistId={setShareWishlistId}
          shareRecipient={shareRecipient}
          setShareRecipient={setShareRecipient}
          shareMessage={shareMessage}
          setShareMessage={setShareMessage}
          onShare={shareWishlist}
          shareSending={shareSending}
        />
      )}

      {/* ── Recommend brand modal ──────────────────────────── */}
      {showRecommendModal && (
        <RecommendBrandModal
          onClose={() => {
            setShowRecommendModal(false);
            setRecommendBrand('');
            setRecommendEmail('');
            setRecommendSuccess(false);
          }}
          onSubmit={submitBrandRecommendation}
          brandName={recommendBrand}
          setBrandName={setRecommendBrand}
          email={recommendEmail}
          setEmail={setRecommendEmail}
          submitting={recommendSubmitting}
          success={recommendSuccess}
        />
      )}

      {/* ── Name collection prompt ─────────────────────────── */}
      {showNameCollectionPrompt && (
        <NameCollectionModal
          onClose={() => setShowNameCollectionPrompt(false)}
          onRename={(name) => {
            renameCollection('Uncategorized', name);
            setShowNameCollectionPrompt(false);
          }}
          initialName=""
        />
      )}

    </div>
  );
}
