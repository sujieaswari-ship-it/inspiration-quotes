import EXTRA_QUOTES from './quotes.js';

const quoteText = document.getElementById('quoteText');
const quoteAuthor = document.getElementById('quoteAuthor');
const tagContainer = document.getElementById('tagContainer');
const newQuoteBtn = document.getElementById('newQuoteBtn');
const copyBtn = document.getElementById('copyBtn');
const shareBtn = document.getElementById('shareBtn');
const toast = document.getElementById('toast');
const quoteCard = document.getElementById('quoteCard');

const API_URL = 'https://api.quotable.io/random';

async function fetchQuote() {
    // Start exit animation
    quoteCard.style.opacity = '0';
    quoteCard.style.transform = 'translateY(10px)';

    // 30% chance to use a local extra quote for variety
    if (Math.random() < 0.3) {
        setTimeout(() => {
            const randomLocal = EXTRA_QUOTES[Math.floor(Math.random() * EXTRA_QUOTES.length)];
            displayQuote(randomLocal);
            quoteCard.style.opacity = '1';
            quoteCard.style.transform = 'translateY(0)';
        }, 300);
        return;
    }

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('API Unavailable');
        const data = await response.json();

        setTimeout(() => {
            displayQuote(data);
            quoteCard.style.opacity = '1';
            quoteCard.style.transform = 'translateY(0)';
        }, 300);

    } catch (error) {
        console.warn('API fetch failed, using local quote backup:', error);
        setTimeout(() => {
            const randomLocal = EXTRA_QUOTES[Math.floor(Math.random() * EXTRA_QUOTES.length)];
            displayQuote(randomLocal);
            quoteCard.style.opacity = '1';
            quoteCard.style.transform = 'translateY(0)';
        }, 300);
    }
}

function displayQuote(data) {
    quoteText.textContent = data.content;
    quoteAuthor.textContent = `- ${data.author}`;

    // Clear and add tags
    tagContainer.innerHTML = '';
    data.tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = tag;
        tagContainer.appendChild(span);
    });
}

function copyToClipboard() {
    const textToCopy = `"${quoteText.textContent}" ${quoteAuthor.textContent}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
        showToast();
    });
}

function showToast() {
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

async function shareQuote() {
    const shareData = {
        title: 'Inspiration Quote',
        text: `"${quoteText.textContent}" ${quoteAuthor.textContent}`,
        url: window.location.href
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            copyToClipboard();
        }
    } catch (err) {
        console.log('Share failed', err);
    }
}

// Event Listeners
newQuoteBtn.addEventListener('click', fetchQuote);
copyBtn.addEventListener('click', copyToClipboard);
shareBtn.addEventListener('click', shareQuote);

// Initial Load
window.addEventListener('load', fetchQuote);
