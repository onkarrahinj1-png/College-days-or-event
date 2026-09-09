// श्रेणी अनुसार फिल्टर करें
function filterEvents(category, evt) {
    const cards = document.querySelectorAll('.card');
    const buttons = document.querySelectorAll('.filter-btn');

    buttons.forEach(btn => btn.classList.remove('active'));
    evt.target.classList.add('active');

    cards.forEach(card => {
        if (category === 'all') {
            card.style.display = 'block';
        } else {
            if (card.classList.contains(category)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

// 📄 Next Page खोलने का फंक्शन
function openDetailPage(eventId) {
    document.getElementById('events-list-page').classList.add('hidden-page');
    document.getElementById('event-detail-page').classList.remove('hidden-page');

    const contents = document.querySelectorAll('.detail-content');
    contents.forEach(content => content.classList.remove('active'));

    const activeContent = document.getElementById('detail-' + eventId);
    if (activeContent) {
        activeContent.classList.add('active');
    }

    window.scrollTo(0, 0);
}

// 🔙 Back To Events List
function showListPage() {
    document.getElementById('event-detail-page').classList.add('hidden-page');
    document.getElementById('events-list-page').classList.remove('hidden-page');
    window.scrollTo(0, 0);
}
