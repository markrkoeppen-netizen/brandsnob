// /api/get-wishlist.js
// Fetches a wishlist from Firestore by shareId using Firebase REST API
// No firebase-admin needed — uses Firestore REST API with API key

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { shareId } = req.query;

  if (!shareId) {
    return res.status(400).json({ error: 'Missing shareId' });
  }

  try {
    const projectId = process.env.FIREBASE_PROJECT_ID || 'brandsnobs-37142';
    const apiKey = process.env.FIREBASE_API_KEY;

    // Use Firestore REST API to query users collection
    // Run a collection group query isn't easily done via REST, so we use
    // the Firestore query endpoint to find users with matching shareId
    const queryUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery${apiKey ? `?key=${apiKey}` : ''}`;

    const queryBody = {
      structuredQuery: {
        from: [{ collectionId: 'users' }],
        limit: 100,
      }
    };

    const response = await fetch(queryUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(queryBody),
    });

    if (!response.ok) {
      throw new Error(`Firestore query failed: ${response.status}`);
    }

    const results = await response.json();

    for (const result of results) {
      if (!result.document) continue;
      const fields = result.document.fields || {};
      
      // Parse wishlists array from Firestore format
      const wishlistsField = fields.wishlists?.arrayValue?.values || [];
      
      for (const wlValue of wishlistsField) {
        const wl = wlValue.mapValue?.fields || {};
        const wlShareId = wl.shareId?.stringValue;
        
        if (wlShareId === shareId) {
          const privacy = wl.privacy?.stringValue || 'link-only';
          
          if (privacy === 'private') {
            return res.status(403).json({ error: 'This wishlist is private' });
          }

          // Parse items
          const itemValues = wl.items?.arrayValue?.values || [];
          const items = itemValues.map(iv => {
            const f = iv.mapValue?.fields || {};
            return {
              id: f.id?.stringValue || '',
              brand: f.brand?.stringValue || '',
              product: f.product?.stringValue || '',
              salePrice: parseFloat(f.salePrice?.doubleValue || f.salePrice?.integerValue || 0),
              originalPrice: parseFloat(f.originalPrice?.doubleValue || f.originalPrice?.integerValue || 0),
              discount: f.discount?.stringValue || '',
              image: f.image?.stringValue || '',
              link: f.link?.stringValue || '',
              retailer: f.retailer?.stringValue || '',
            };
          });

          return res.status(200).json({
            wishlist: {
              name: wl.name?.stringValue || 'Wishlist',
              emoji: wl.emoji?.stringValue || '⭐',
              items,
            }
          });
        }
      }
    }

    return res.status(404).json({ error: 'Wishlist not found' });

  } catch (error) {
    console.error('get-wishlist error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
