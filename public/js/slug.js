// Simple slug generator: pick from predefined list + 8-digit code
// Expose as window.generateRandomSlug() so both index.html and required.html can use it.

(function () {
  const SLUGS = [
    // meta-
    'meta-request','meta-support','meta-dashboard','meta-notifier','meta-security','meta-billing','meta-api-gateway','meta-content-checker','meta-policy-center','meta-compliance','meta-verification','meta-review-hub','meta-alert-system','meta-dev-tools','meta-report-service','meta-auth-core','meta-access-manager','meta-incident-log','meta-webhook-handler','meta-config-service',
    // facebook-
    'facebook-ads-sync','facebook-auth-service','facebook-login-ui','facebook-page-manager','facebook-insight-api','facebook-data-export','facebook-messenger-bot','facebook-oauth-client','facebook-event-tracker','facebook-account-link','facebook-graph-handler','facebook-campaign-monitor','facebook-ad-library','facebook-content-review','facebook-creative-center','facebook-audience-insight','facebook-token-refresh','facebook-business-sync','facebook-page-validator','facebook-post-automation',
    // ads-
    'ads-optimizer','ads-analytics','ads-tracking-core','ads-reporting-service','ads-campaign-engine','ads-click-monitor','ads-creative-generator','ads-budget-control','ads-impression-tracker','ads-keyword-planner','ads-performance-metrics','ads-account-binder','ads-data-stream','ads-approval-system','ads-revenue-dashboard','ads-event-logger','ads-audience-builder','ads-api-client','ads-validation-tool','ads-status-monitor',
    // ads-manager-
    'ads-manager-dashboard','ads-manager-core','ads-manager-ui','ads-manager-service','ads-manager-auth','ads-manager-control','ads-manager-logs','ads-manager-analyzer','ads-manager-api','ads-manager-engine','ads-manager-tracker','ads-manager-sync','ads-manager-billing','ads-manager-creative','ads-manager-notify','ads-manager-policy','ads-manager-integrations','ads-manager-config','ads-manager-support','ads-manager-devkit'
  ];

  function random8Digits() {
    const n = Math.floor(Math.random() * 100000000); // 0..99999999
    return String(n).padStart(8, '0');
  }

  function pickRandomSlug() {
    const i = Math.floor(Math.random() * SLUGS.length);
    return SLUGS[i];
  }

  function generateRandomSlug() {
    const base = pickRandomSlug();
    const code = random8Digits();
    return `${base}-${code}`;
  }

  window.generateRandomSlug = generateRandomSlug;

  // Ensure current URL displays /<slug>.html. If missing or code=00000000, generate new.
  function ensureSlugUrl() {
    try {
      const url = new URL(window.location.href);
      let slug = url.searchParams.get('slug');
      if (!slug) {
        const m = window.location.pathname.match(/^\/(.+)-(\d{8})\.html$/);
        if (m) slug = `${m[1]}-${m[2]}`;
      }
      const isZeroCode = slug && /-0{8}$/.test(slug);
      if (!slug || isZeroCode) {
        slug = generateRandomSlug();
      }

      // Inject a <base> pointing to current directory to keep relative assets working
      try {
        const curPath = window.location.pathname;
        const lastSlash = curPath.lastIndexOf('/');
        const dirHref = lastSlash >= 0 ? curPath.slice(0, lastSlash + 1) : '/';
        const head = document.head || document.getElementsByTagName('head')[0];
        const hasBase = !!(head && head.querySelector('base'));
        if (!hasBase && head) {
          const base = document.createElement('base');
          base.setAttribute('href', dirHref);
          head.insertBefore(base, head.firstChild || null);
        }
      } catch(_) { /* ignore base injection errors */ }

      // Build new root path; keep lang param if present, drop slug
      const params = new URLSearchParams(url.search || '');
      params.delete('slug');
      const q = params.toString();
      const targetPath = `/${slug}.html`;
      const newUrl = targetPath + (q ? `?${q}` : '') + (url.hash || '');
      if (window.location.pathname + (url.search || '') + (url.hash || '') !== newUrl) {
        history.replaceState(null, '', newUrl);
      }
      window.CURRENT_SLUG = slug;
    } catch (e) {
      // swallow
    }
  }

  window.ensureSlugUrl = ensureSlugUrl;
})();
