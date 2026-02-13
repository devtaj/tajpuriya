// Global Translation Manager
class TranslationManager {
  constructor() {
    // Default language is English
    this.currentLang = localStorage.getItem('lang') || 'en';
    this.init();
  }

  init() {
    this.updateLangButton();
    this.applyTranslations();
  }

  toggleLanguage() {
    this.currentLang = this.currentLang === 'en' ? 'ne' : 'en';
    localStorage.setItem('lang', this.currentLang);
    this.updateLangButton();
    this.applyTranslations();
  }

  updateLangButton() {
    const langBtn = document.getElementById('lang-btn');
    if (langBtn) {
      // Show opposite language label for switching
      langBtn.textContent = this.currentLang === 'en' ? 'ने' : 'EN';
    }
  }

  applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translationData[this.currentLang] && translationData[this.currentLang][key]) {
        el.textContent = translationData[this.currentLang][key];
      }
    });
  }

  t(key) {
    return translationData[this.currentLang]?.[key] || key;
  }
}

// Initialize translation manager
const i18n = new TranslationManager();

// Global function for language toggle (use in button onclick)
function toggleLang() {
  i18n.toggleLanguage();
}