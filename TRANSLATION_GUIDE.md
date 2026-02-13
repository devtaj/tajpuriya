# Global Translation System - Implementation Guide

## How It Works

The translation system uses:
1. **localStorage** - Saves language preference across pages
2. **data-i18n attributes** - Marks translatable elements
3. **translations.js** - Central translation file loaded on all pages

## Setup for Each Page

### 1. Add Translation Script (in <head>)
```html
<script src="/js/translations.js"></script>
```

### 2. Add Language Button (in navigation)
```html
<button id="lang-btn" class="btn btn-outline" onclick="toggleLang()">EN</button>
```

### 3. Mark Translatable Elements
Replace class="t" with data-i18n="key":
```html
<!-- Old way (page-specific) -->
<a href="/" class="t">Home</a>

<!-- New way (global) -->
<a href="/" data-i18n="home">Home</a>
```

## Adding New Translations

Edit `/public/js/translations.js`:

```javascript
const translations = {
  en: {
    yourKey: "Your English Text",
    // ... more keys
  },
  ne: {
    yourKey: "तपाईंको नेपाली पाठ",
    // ... more keys
  }
};
```

Then use in HTML:
```html
<p data-i18n="yourKey">Your English Text</p>
```

## Benefits

✅ Language persists across all pages
✅ Single source of truth for translations
✅ Easy to add new languages
✅ Automatic on page load
✅ No duplicate translation code

## Migration Checklist

For each HTML page:
- [ ] Add `<script src="/js/translations.js"></script>` in head
- [ ] Add language button with `id="lang-btn"` and `onclick="toggleLang()"`
- [ ] Replace all `class="t"` with `data-i18n="key"`
- [ ] Remove inline translation scripts
- [ ] Test language switching
