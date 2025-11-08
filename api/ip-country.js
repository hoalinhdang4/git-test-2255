// Serverless Function: expose country_code and client IP from request headers
// Country uses `x-vercel-ip-country` (if present) or `cf-ipcountry`.
// IP prefers `x-forwarded-for` first entry, then `x-real-ip`, `cf-connecting-ip`, or `x-vercel-ip`.

export default async function handler(req, res) {
  try {
    const h = req.headers || {};
    const getHeader = (name) => {
      try {
        // Node serverless: headers is a plain object
        const lower = String(name).toLowerCase();
        return (h[name] || h[lower] || '') + '';
      } catch (_) { return ''; }
    };

    // Country code from headers
    let rawCountry = (getHeader('x-vercel-ip-country') || getHeader('cf-ipcountry') || '').toUpperCase();
    let code = rawCountry && rawCountry.length === 2 ? rawCountry : '';

    // IP extraction
    const xff = (getHeader('x-forwarded-for') || '').trim();
    const ipFromXff = xff ? xff.split(',')[0].trim() : '';
    const ipCandidate = ipFromXff
      || (getHeader('x-real-ip') || '').trim()
      || (getHeader('cf-connecting-ip') || '').trim()
      || (getHeader('x-vercel-ip') || '').trim()
      || (req.connection && req.connection.remoteAddress) || '';
    const ip = ipCandidate && String(ipCandidate).length > 0 ? ipCandidate : 'N/A';

    // Enrich country_code via ipapi if header missing or invalid
    if (!code || code.length !== 2) {
      try {
        const r = await fetch('https://ipapi.co/json/');
        if (r && r.ok) {
          const j = await r.json();
          const c = (j && j.country) ? String(j.country).toUpperCase() : '';
          if (c && c.length === 2) code = c;
        }
      } catch (_) {}
    }

    const region_code = (getHeader('x-vercel-ip-country-region') || '').toUpperCase() || 'N/A';
    const city = (getHeader('x-vercel-ip-city') || '') || 'N/A';

    res.setHeader('content-type', 'application/json');
    res.setHeader('cache-control', 'no-store');
    res.status(200).send(JSON.stringify({
      provider: 'vercel',
      source: 'headers+fallback',
      country_code: code || 'N/A',
      ip,
      region_code,
      city
    }));
  } catch (e) {
    res.setHeader('content-type', 'application/json');
    res.setHeader('cache-control', 'no-store');
    res.status(200).send(JSON.stringify({ provider: 'vercel', source: 'error', country_code: 'N/A', ip: 'N/A', region_code: 'N/A', city: 'N/A' }));
  }
}