// Simple inline read more/less functionality
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        const text = card.querySelector('.card-text');
        if (!text) return;
        
        const fullText = text.textContent.trim();
        const words = fullText.split(' ');
        
        if (words.length > 30) {
            const shortText = words.slice(0, 30).join(' ') + '...';
            text.textContent = shortText;
            text.dataset.fullText = fullText;
            text.dataset.shortText = shortText;
            text.dataset.expanded = 'false';
            
            const btn = document.createElement('a');
            btn.href = '#';
            btn.textContent = 'Read More';
            btn.style.cssText = 'color: var(--primary-color); font-weight: 600; text-decoration: none; display: inline-block; margin-top: 0.5rem; cursor: pointer;';
            
            btn.onclick = function(e) {
                e.preventDefault();
                if (text.dataset.expanded === 'false') {
                    text.textContent = text.dataset.fullText;
                    btn.textContent = 'Read Less';
                    text.dataset.expanded = 'true';
                } else {
                    text.textContent = text.dataset.shortText;
                    btn.textContent = 'Read More';
                    text.dataset.expanded = 'false';
                }
            };
            
            text.parentElement.appendChild(btn);
        }
    });
});
