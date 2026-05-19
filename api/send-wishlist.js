// /api/send-wishlist.js
// Vercel serverless function — handles wishlist share emails via Resend
// Deploy by placing this file in the /api folder of your GitHub repo

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, from, senderName, wishlistName, wishlistEmoji, message, shareLink, items, totalValue } = req.body;

  // Basic validation
  if (!to || !shareLink) {
    return res.status(400).json({ error: 'Missing required fields: to, shareLink' });
  }

  // Format items list for email body
  const itemsList = items && items.length > 0
    ? items.map((item, i) =>
        `${i + 1}. ${item.product}<br>&nbsp;&nbsp;&nbsp;${item.brand} — <strong>$${item.salePrice}</strong> <span style="color:#16a34a">(${item.discount} off)</span><br>&nbsp;&nbsp;&nbsp;<a href="${item.link}" style="color:#1d4ed8">View Deal</a>`
      ).join('<br><br>')
    : 'No items in this wishlist yet.';

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #171717;">

      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="font-size: 24px; font-weight: 800; letter-spacing: -0.5px; margin: 0;">
          🛍️ BrandSnobs
        </h1>
      </div>

      <div style="background: #f5f5f5; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
        <p style="margin: 0 0 8px 0; font-size: 18px; font-weight: 700;">
          ${senderName || 'Someone'} shared a wishlist with you!
        </p>
        <p style="margin: 0; color: #525252; font-size: 15px;">
          ${wishlistEmoji || '❤️'} <strong>${wishlistName || 'My Wishlist'}</strong>
          ${totalValue ? `— $${totalValue} in deals` : ''}
        </p>
      </div>

      ${message ? `
      <div style="border-left: 3px solid #171717; padding-left: 16px; margin-bottom: 24px;">
        <p style="margin: 0; color: #404040; font-style: italic;">"${message}"</p>
      </div>
      ` : ''}

      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 16px; font-weight: 700; margin-bottom: 16px; color: #171717;">
          Items in this wishlist:
        </h2>
        <div style="background: #fafafa; border-radius: 12px; padding: 20px; line-height: 1.8;">
          ${itemsList}
        </div>
      </div>

      <div style="text-align: center; margin-bottom: 32px;">
        <a href="${shareLink}"
           style="display: inline-block; background: #171717; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 700; font-size: 16px;">
          View Full Wishlist →
        </a>
      </div>

      <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;">

      <p style="text-align: center; color: #a3a3a3; font-size: 12px; margin: 0;">
        Sent via <a href="https://www.brandsnobs.com" style="color: #a3a3a3;">BrandSnobs</a> —
        the smart way to track fashion deals from your favorite brands.
      </p>

    </body>
    </html>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'BrandSnobs <admin@brandsnobs.com>',
        to: [to],
        subject: `${senderName || 'Someone'} shared their ${wishlistName || 'wishlist'} with you 🛍️`,
        html: emailHtml,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend error:', data);
      return res.status(response.status).json({ error: data.message || 'Failed to send email' });
    }

    return res.status(200).json({ success: true, id: data.id });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
