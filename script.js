// Filter Events by Category
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

// Open Event Detail View
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

// Back to Events List View
function showListPage() {
    document.getElementById('event-detail-page').classList.add('hidden-page');
    document.getElementById('events-list-page').classList.remove('hidden-page');
    window.scrollTo(0, 0);
}

// Student & Teacher Fixed Login Verification
function handleLogin(event) {
    event.preventDefault();
    
    const usernameInput = document.getElementById('username').value.trim();
    const passwordInput = document.getElementById('password').value.trim();

    // Fixed Username & Password
    const correctUsername = "nagarclg@1947";
    const correctPassword = "aca.2026";

    if (usernameInput === correctUsername && passwordInput === correctPassword) {
        alert("Login Successful! Welcome to Ahmednagar College Portal.");
        window.location.href = "events.html"; // Opens main events page on successful login
    } else {
        alert("Incorrect Username or Password! Please check and try again.");
    }
}
