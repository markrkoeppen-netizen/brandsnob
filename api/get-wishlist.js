// /api/get-wishlist.js
// Fetches a wishlist from Firestore by shareId for public viewing

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function initFirebase() {
  if (getApps().length > 0) return;
  
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    initializeApp({ credential: cert(serviceAccount) });
  } else {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { shareId } = req.query;

  if (!shareId) {
    return res.status(400).json({ error: 'Missing shareId' });
  }

  try {
    initFirebase();
    const db = getFirestore();

    // Search all users for a wishlist with this shareId
    const usersSnapshot = await db.collection('users').get();
    
    for (const userDoc of usersSnapshot.docs) {
      const data = userDoc.data();
      const wishlists = data.wishlists || [];
      
      const wishlist = wishlists.find(w => w.shareId === shareId);
      
      if (wishlist) {
        // Check privacy
        if (wishlist.privacy === 'private') {
          return res.status(403).json({ error: 'This wishlist is private' });
        }
        
        return res.status(200).json({
          wishlist: {
            name: wishlist.name,
            emoji: wishlist.emoji,
            items: wishlist.items,
            createdAt: wishlist.createdAt,
          },
          owner: userDoc.id, // email as owner identifier
        });
      }
    }

    return res.status(404).json({ error: 'Wishlist not found' });

  } catch (error) {
    console.error('get-wishlist error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
