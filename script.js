// ==========================================
// 1. PAGE NAVIGATION & FILTER LOGIC (Events Page)
// ==========================================

// Show Events List from Home Landing Page
function showEventsList() {
    document.getElementById('home-landing-page').classList.add('hidden-page');
    document.getElementById('events-list-page').classList.remove('hidden-page');
    window.scrollTo(0, 0);
}

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


// ==========================================
// 2. STUDENT REGISTRATION & LOGIN LOGIC
// ==========================================

// Check on index.html load: If user is already registered, stay on login page.
// If NOT registered, redirect automatically to register.html
document.addEventListener("DOMContentLoaded", function() {
    const isRegistered = localStorage.getItem("isRegistered");
    const currentPage = window.location.pathname.split("/").pop();

    // Only redirect if opening main page (index.html or root URL) and user is not registered
    if (!isRegistered && (currentPage === "index.html" || currentPage === "")) {
        window.location.href = "register.html";
    }
});

// Handle Student Registration (from register.html)
function handleRegistration(event) {
    event.preventDefault();
    
    const name = document.getElementById("fullName").value.trim();
    const rollNo = document.getElementById("rollNo").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value.trim();

    let students = JSON.parse(localStorage.getItem("studentsList")) || [];

    // Check if email already registered
    let existingStudent = students.find(s => s.email === email);
    if (existingStudent) {
        alert("This email is already registered! Please go to Login.");
        window.location.href = "index.html";
        return;
    }

    // Save new student details
    students.push({
        name: name,
        rollNo: rollNo,
        email: email,
        password: password,
        date: new Date().toLocaleDateString()
    });

    localStorage.setItem("studentsList", JSON.stringify(students));
    localStorage.setItem("isRegistered", "true"); // Flag set so register won't open again

    alert("Registration Successful! Welcome to Ahmednagar College Portal. Please login now.");
    window.location.href = "index.html";
}

// Student Login Verification (from index.html)
function handleLogin(event) {
    event.preventDefault();
    
    const userInput = document.getElementById('username').value.trim();
    const passwordInput = document.getElementById('password').value.trim();

    // Default Fixed Login (For quick testing/teacher access)
    const fixedUsername = "nagarclg@1947";
    const fixedPassword = "aca.2026";

    // Check against registered students list
    let students = JSON.parse(localStorage.getItem("studentsList")) || [];
    let registeredUser = students.find(s => (s.email === userInput || s.rollNo === userInput) && s.password === passwordInput);

    if ((userInput === fixedUsername && passwordInput === fixedPassword) || registeredUser) {
        
        // Log activity for Admin Dashboard
        let logs = JSON.parse(localStorage.getItem("loginLogs")) || [];
        logs.push({
            name: registeredUser ? registeredUser.name : "Fixed Student/Faculty",
            email: userInput,
            time: new Date().toLocaleString()
        });
        localStorage.setItem("loginLogs", JSON.stringify(logs));

        alert("Login Successful! Welcome to Ahmednagar College Portal.");
        window.location.href = "events.html";
    } else {
        alert("Incorrect Email/Username or Password! Please check and try again.");
    }
}
