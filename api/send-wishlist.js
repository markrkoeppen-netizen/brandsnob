// /api/send-wishlist.js
// Vercel serverless function — handles wishlist share emails via Resend

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, senderName, wishlistName, wishlistEmoji, message, shareLink, items, totalValue, sizes } = req.body;

  if (!to || !shareLink) {
    return res.status(400).json({ error: 'Missing required fields: to, shareLink' });
  }

  // Build item cards — 2 per row using proper HTML tables (guaranteed side-by-side in all email clients)
  const buildItemCards = (items) => {
    if (!items || items.length === 0) return '<p style="color:#737373;text-align:center;padding:24px 0;">No items yet.</p>';

    const buildCard = (item) => item ? `
      <td width="48%" valign="top" style="padding:0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e5e5;border-radius:12px;overflow:hidden;background:#ffffff;">
          <tr>
            <td style="padding:0;">
              <img src="${item.image}" alt="${item.product}"
                   width="100%" height="160"
                   style="display:block;width:100%;height:160px;object-fit:cover;background:#f5f5f5;border-radius:12px 12px 0 0;" />
            </td>
          </tr>
          <tr>
            <td style="padding:12px;">
              <p style="margin:0 0 3px;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#737373;">${item.brand}</p>
              <p style="margin:0 0 8px;font-size:12px;font-weight:500;color:#171717;line-height:1.4;">${item.product.length > 45 ? item.product.substring(0, 45) + '…' : item.product}</p>
              <p style="margin:0 0 10px;">
                <span style="font-size:15px;font-weight:700;color:#171717;">$${item.salePrice}</span>
                ${item.originalPrice > item.salePrice
                  ? `<span style="font-size:11px;color:#a3a3a3;text-decoration:line-through;margin-left:5px;">$${item.originalPrice}</span>
                     <span style="font-size:10px;font-weight:600;color:#16a34a;background:#f0fdf4;padding:2px 5px;border-radius:4px;margin-left:4px;">${item.discount} off</span>`
                  : ''}
              </p>
              <a href="${item.link}" style="display:block;background:#171717;color:#ffffff;text-decoration:none;padding:7px;border-radius:7px;font-size:11px;font-weight:600;text-align:center;">View Deal →</a>
            </td>
          </tr>
        </table>
      </td>` : '<td width="48%"></td>';

    let rows = '';
    for (let i = 0; i < items.length; i += 2) {
      rows += `
        <tr>
          ${buildCard(items[i])}
          <td width="4%"></td>
          ${buildCard(items[i + 1] || null)}
        </tr>
        <tr><td colspan="3" height="16"></td></tr>`;
    }

    return `<table width="100%" cellpadding="0" cellspacing="0">${rows}</table>`;
  };

  const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${wishlistEmoji || '🛍️'} ${wishlistName || 'Wishlist'} — BrandSnobs</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#171717;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#171717;border-radius:20px 20px 0 0;padding:28px 32px;text-align:center;">
              <p style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">🛍️ BrandSnobs</p>
              <p style="margin:6px 0 0;font-size:12px;color:#a3a3a3;letter-spacing:0.1em;text-transform:uppercase;">Fashion Deals, Tracked For You</p>
            </td>
          </tr>

          <!-- Hero section -->
          <tr>
            <td style="background:#ffffff;padding:32px 32px 24px;">
              <p style="margin:0 0 6px;font-size:13px;color:#737373;font-weight:500;">${senderName || 'Someone'} wants to share something with you</p>
              <p style="margin:0 0 4px;font-size:28px;font-weight:800;letter-spacing:-0.5px;">${wishlistEmoji || '❤️'} ${wishlistName || 'My Wishlist'}</p>
              <p style="margin:0;font-size:14px;color:#737373;">${items ? items.length : 0} item${items && items.length !== 1 ? 's' : ''}${totalValue ? ` · $${totalValue} total value` : ''}</p>

              ${message ? `
              <div style="margin-top:20px;border-left:3px solid #171717;padding-left:16px;">
                <p style="margin:0;font-size:14px;color:#404040;font-style:italic;">"${message}"</p>
              </div>` : ''}

              ${sizes && sizes.length > 0 ? `
              <div style="margin-top:20px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px;">
                <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#15803d;">📏 Their Sizes</p>
                <div>
                  ${sizes.map(s => `<span style="display:inline-block;background:#fff;border:1px solid #86efac;color:#166534;font-size:12px;font-weight:600;padding:4px 10px;border-radius:99px;margin:0 6px 6px 0;">${s}</span>`).join('')}
                </div>
                <p style="margin:8px 0 0;font-size:11px;color:#6b7280;">So you know exactly what size to order!</p>
              </div>` : ''}
            </td>
          </tr>

          <!-- Items -->
          <tr>
            <td style="background:#ffffff;padding:0 32px 32px;">
              <p style="margin:0 0 16px;font-size:14px;font-weight:700;color:#171717;border-top:1px solid #f5f5f5;padding-top:24px;">Items in this wishlist</p>
              ${buildItemCards(items)}
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="background:#ffffff;padding:0 32px 32px;text-align:center;">
              <a href="${shareLink}"
                 style="display:inline-block;background:#171717;color:#ffffff;text-decoration:none;padding:16px 40px;border-radius:12px;font-weight:700;font-size:16px;letter-spacing:-0.2px;">
                View Full Wishlist →
              </a>
              <p style="margin:12px 0 0;font-size:12px;color:#a3a3a3;">Opens an interactive page with all items</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#fafafa;border-top:1px solid #e5e5e5;border-radius:0 0 20px 20px;padding:24px 32px;text-align:center;">
              <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#171717;">🛍️ BrandSnobs</p>
              <p style="margin:0 0 12px;font-size:12px;color:#a3a3a3;line-height:1.6;">
                The smart way to track sales from your favorite fashion brands — free, forever.
              </p>
              <a href="https://www.brandsnobs.com"
                 style="display:inline-block;background:#171717;color:#ffffff;text-decoration:none;padding:10px 24px;border-radius:8px;font-size:12px;font-weight:600;">
                Start Tracking Deals →
              </a>
              <p style="margin:16px 0 0;font-size:11px;color:#d4d4d4;">
                Sent via <a href="https://www.brandsnobs.com" style="color:#d4d4d4;">BrandSnobs</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;

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
        subject: `${senderName || 'Someone'} shared their ${wishlistEmoji || '🛍️'} ${wishlistName || 'wishlist'} with you`,
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
