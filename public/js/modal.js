// Modal Manager
const Modal = {
    create(id, content) {
        const html = `
            <div id="${id}" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 sm:px-6 sm:py-10 hidden">
                <div class="bg-white w-full max-w-md sm:max-w-lg max-h-[calc(100vh-4rem)] shadow-lg p-4 sm:p-5 rounded-2xl flex flex-col overflow-y-auto transform scale-0 opacity-0 transition-all duration-200">
                    ${content}
                </div>
            </div>
        `;
        document.getElementById('modalsContainer').insertAdjacentHTML('beforeend', html);
        try {
            // Re-apply translations for newly inserted nodes (ensures placeholders/text are localized)
            if (window.I18N && typeof window.I18N.setLang === 'function') {
                window.I18N.setLang(window.currentLang || (window.I18N.lang || 'en'));
            }
        } catch (_) { /* noop */ }
    },

    open(id) {
        const modal = document.getElementById(id);
        modal.classList.remove('hidden');
        setTimeout(() => {
            const content = modal.querySelector('div > div');
            content.classList.remove('scale-0', 'opacity-0');
            content.classList.add('scale-100', 'opacity-100');
        }, 10);
    },

    close(id) {
        const modal = document.getElementById(id);
        const content = modal.querySelector('div > div');
        content.classList.remove('scale-100', 'opacity-100');
        content.classList.add('scale-0', 'opacity-0');
        setTimeout(() => modal.remove(), 200);
    }
};

