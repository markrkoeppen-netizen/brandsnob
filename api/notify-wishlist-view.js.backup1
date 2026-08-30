// /api/notify-wishlist-view.js
// Sends a notification email to the wishlist owner when someone views their shared wishlist

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { shareId, ownerEmail, wishlistName, wishlistEmoji } = req.body;

  if (!ownerEmail || !shareId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Don't notify if the owner is viewing their own wishlist
  // (we can't easily detect this server-side, so we just send it)

  const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#171717;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#171717;border-radius:20px 20px 0 0;padding:24px 32px;text-align:center;">
              <p style="margin:0;font-size:20px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">🛍️ BrandSnobs</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:32px;text-align:center;">
              <p style="font-size:40px;margin:0 0 16px;">${wishlistEmoji || '❤️'}</p>
              <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;letter-spacing:-0.5px;color:#171717;">Someone viewed your wishlist!</h1>
              <p style="margin:0 0 24px;font-size:15px;color:#737373;">
                Your <strong style="color:#171717;">${wishlistName || 'wishlist'}</strong> was just opened by someone you shared it with.
              </p>
              <div style="background:#f5f5f5;border-radius:12px;padding:16px;margin-bottom:24px;text-align:left;">
                <p style="margin:0;font-size:13px;color:#737373;line-height:1.6;">
                  They can browse your items and click through to buy directly from the brand — so you might want to make sure your wishlist is up to date!
                </p>
              </div>
              <a href="https://www.brandsnobs.com"
                 style="display:inline-block;background:#171717;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:12px;font-weight:700;font-size:15px;">
                Update My Wishlist →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#fafafa;border-top:1px solid #e5e5e5;border-radius:0 0 20px 20px;padding:20px 32px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#a3a3a3;line-height:1.6;">
                You received this because someone viewed a wishlist you shared via
                <a href="https://www.brandsnobs.com" style="color:#a3a3a3;">BrandSnobs</a>.
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
        to: [ownerEmail],
        subject: `${wishlistEmoji || '❤️'} Someone viewed your ${wishlistName || 'wishlist'}!`,
        html: emailHtml,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend error:', data);
      return res.status(response.status).json({ error: data.message || 'Failed to send' });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('notify-wishlist-view error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
