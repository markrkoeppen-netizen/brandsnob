// /api/send-recommendation.js
// Vercel serverless function — sends brand recommendation emails via Resend
// Place this file in the /api folder of your GitHub repo

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { brandName, submitterEmail, userEmail } = req.body;

  if (!brandName) {
    return res.status(400).json({ error: 'Missing required field: brandName' });
  }

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
          New Brand Recommendation
        </p>
        <p style="margin: 0; color: #525252; font-size: 15px;">
          A user has suggested a brand to add to BrandSnobs.
        </p>
      </div>

      <div style="background: #ffffff; border: 1px solid #e5e5e5; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-size: 13px; color: #737373; width: 140px;">Brand Requested</td>
            <td style="padding: 8px 0; font-size: 15px; font-weight: 700; color: #171717;">${brandName}</td>
          </tr>
          <tr style="border-top: 1px solid #f5f5f5;">
            <td style="padding: 8px 0; font-size: 13px; color: #737373;">Submitted By</td>
            <td style="padding: 8px 0; font-size: 14px; color: #171717;">${userEmail || 'Anonymous'}</td>
          </tr>
          <tr style="border-top: 1px solid #f5f5f5;">
            <td style="padding: 8px 0; font-size: 13px; color: #737373;">Contact Email</td>
            <td style="padding: 8px 0; font-size: 14px; color: #171717;">${submitterEmail || 'Not provided'}</td>
          </tr>
          <tr style="border-top: 1px solid #f5f5f5;">
            <td style="padding: 8px 0; font-size: 13px; color: #737373;">Submitted At</td>
            <td style="padding: 8px 0; font-size: 14px; color: #171717;">${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })} CT</td>
          </tr>
        </table>
      </div>

      <div style="background: #fafafa; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
        <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; color: #525252;">Next Steps</p>
        <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #737373; line-height: 1.8;">
          <li>Add <strong>${brandName}</strong> to PRIORITY_BRANDS in DealFetcher.js</li>
          <li>Add to BRAND_COLLECTIONS in App.jsx</li>
          <li>Add to ALL_AVAILABLE_BRANDS in App.jsx</li>
          <li>Add domain to BRAND_DOMAINS lookup for logo</li>
          ${submitterEmail ? `<li>Notify ${submitterEmail} that the brand has been added</li>` : ''}
        </ul>
      </div>

      <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;">
      <p style="text-align: center; color: #a3a3a3; font-size: 12px; margin: 0;">
        BrandSnobs Admin Notification · <a href="https://www.brandsnobs.com" style="color: #a3a3a3;">brandsnobs.com</a>
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
        to: ['admin@brandsnobs.com', 'mark.r.koeppen@gmail.com'],
        subject: `New Brand Recommendation: ${brandName}`,
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
