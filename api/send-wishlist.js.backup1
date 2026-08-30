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

  // Build item cards — 3 per row, compact thumbnails
  const buildItemCards = (items) => {
    if (!items || items.length === 0) return '<p style="color:#737373;text-align:center;padding:16px 0;">No items yet.</p>';

    const buildCard = (item) => item ? `
      <td width="31%" valign="top" style="padding:0 4px 12px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e5e5;border-radius:10px;overflow:hidden;background:#ffffff;">
          <tr>
            <td style="padding:0;">
              <a href="${item.link}" style="display:block;">
                <img src="${item.image}" alt="${item.product}"
                     width="100%" height="120"
                     style="display:block;width:100%;height:120px;object-fit:cover;border-radius:10px 10px 0 0;background:#f5f5f5;" />
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 10px 10px;">
              <p style="margin:0 0 2px;font-size:9px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#737373;">${item.brand}</p>
              <p style="margin:0 0 6px;font-size:11px;font-weight:500;color:#171717;line-height:1.3;">${item.product.length > 40 ? item.product.substring(0, 40) + '…' : item.product}</p>
              <p style="margin:0 0 8px;">
                <span style="font-size:13px;font-weight:700;color:#171717;">$${item.salePrice}</span>
                ${item.originalPrice > item.salePrice
                  ? `<span style="font-size:10px;color:#a3a3a3;text-decoration:line-through;margin-left:4px;">$${item.originalPrice}</span>
                     <span style="display:inline-block;font-size:9px;font-weight:600;color:#16a34a;background:#f0fdf4;padding:1px 4px;border-radius:3px;margin-left:3px;">${item.discount} off</span>`
                  : ''}
              </p>
              <a href="${item.link}" style="display:block;background:#171717;color:#ffffff;text-decoration:none;padding:5px 0;border-radius:6px;font-size:10px;font-weight:600;text-align:center;">View Deal →</a>
            </td>
          </tr>
        </table>
      </td>` : '<td width="31%" style="padding:0 4px 12px;"></td>';

    let rows = '';
    for (let i = 0; i < items.length; i += 3) {
      rows += `
        <tr>
          ${buildCard(items[i])}
          <td width="3%" style="padding:0;"></td>
          ${buildCard(items[i + 1] || null)}
          <td width="3%" style="padding:0;"></td>
          ${buildCard(items[i + 2] || null)}
        </tr>`;
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

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:24px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#171717;border-radius:16px 16px 0 0;padding:20px 28px;text-align:center;">
              <p style="margin:0;font-size:18px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">🛍️ BrandSnobs</p>
            </td>
          </tr>

          <!-- Hero -->
          <tr>
            <td style="background:#ffffff;padding:24px 28px 16px;">
              <p style="margin:0 0 4px;font-size:12px;color:#737373;">${senderName || 'Someone'} shared a wishlist with you</p>
              <p style="margin:0 0 4px;font-size:24px;font-weight:800;letter-spacing:-0.5px;">${wishlistEmoji || '❤️'} ${wishlistName || 'My Wishlist'}</p>
              <p style="margin:0 0 16px;font-size:13px;color:#737373;">${items ? items.length : 0} item${items && items.length !== 1 ? 's' : ''}${totalValue ? ` · $${totalValue} total value` : ''}</p>

              ${message ? `
              <div style="border-left:3px solid #171717;padding-left:12px;margin-bottom:16px;">
                <p style="margin:0;font-size:13px;color:#404040;font-style:italic;">"${message}"</p>
              </div>` : ''}

              ${sizes && sizes.length > 0 ? `
              <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:12px;margin-bottom:16px;">
                <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#15803d;">📏 Their Sizes</p>
                <div>${sizes.map(s => `<span style="display:inline-block;background:#fff;border:1px solid #86efac;color:#166534;font-size:11px;font-weight:600;padding:3px 8px;border-radius:99px;margin:0 4px 4px 0;">${s}</span>`).join('')}</div>
              </div>` : ''}

              <!-- PRIMARY CTA — top of email -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
                <tr>
                  <td align="center" style="background:#171717;border-radius:10px;padding:14px 20px;">
                    <a href="${shareLink}" style="color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;letter-spacing:-0.2px;">
                      View Full Wishlist Online →
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 20px;font-size:11px;color:#a3a3a3;text-align:center;">Opens an interactive page — shop directly from your browser</p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="background:#ffffff;padding:0 28px;">
              <hr style="border:none;border-top:1px solid #f5f5f5;margin:0;" />
            </td>
          </tr>

          <!-- Items -->
          <tr>
            <td style="background:#ffffff;padding:16px 24px 20px;">
              <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#171717;">Items in this wishlist</p>
              ${buildItemCards(items)}
            </td>
          </tr>

          <!-- Secondary CTA -->
          <tr>
            <td style="background:#ffffff;padding:0 28px 24px;text-align:center;">
              <a href="${shareLink}"
                 style="display:inline-block;background:#ffffff;color:#171717;text-decoration:none;padding:10px 24px;border-radius:8px;font-weight:600;font-size:13px;border:1.5px solid #171717;">
                View All ${items ? items.length : ''} Items →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#fafafa;border-top:1px solid #e5e5e5;border-radius:0 0 16px 16px;padding:20px 28px;text-align:center;">
              <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#171717;">🛍️ BrandSnobs</p>
              <p style="margin:0 0 12px;font-size:11px;color:#a3a3a3;">Track sales from your favorite fashion brands — free, forever.</p>
              <a href="https://www.brandsnobs.com"
                 style="display:inline-block;background:#171717;color:#ffffff;text-decoration:none;padding:8px 20px;border-radius:7px;font-size:11px;font-weight:600;">
                Start Tracking Deals →
              </a>
              <p style="margin:14px 0 0;font-size:10px;color:#d4d4d4;">
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
