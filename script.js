// ==========================================
// 1. SUPABASE INITIALIZATION
// ==========================================
const SUPABASE_URL = "https://cixcdchvkzwhcfkdtjxs.supabase.co";
const SUPABASE_KEY = "sb_publishable_5kDtCBsEgOI7i0-jGwWHuw_AAuSZNwf"; // आपकी Copy की हुई Publishable Key
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ==========================================
// 2. PAGE NAVIGATION & FILTER LOGIC
// ==========================================

function showEventsList() {
    document.getElementById('home-landing-page').classList.add('hidden-page');
    document.getElementById('events-list-page').classList.remove('hidden-page');
    loadSupabaseEvents(); // Supabase से सेव की हुई इवेंट्स लोड होंगी
    window.scrollTo(0, 0);
}

function filterEvents(category, evt) {
    const cards = document.querySelectorAll('.card');
    const buttons = document.querySelectorAll('.filter-btn');

    buttons.forEach(btn => btn.classList.remove('active'));
    evt.target.classList.add('active');

    cards.forEach(card => {
        if (category === 'all') {
            card.style.display = 'block';
        } else {
            if (card.classList.contains(category.toLowerCase())) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

function showListPage() {
    document.getElementById('event-detail-page').classList.add('hidden-page');
    document.getElementById('events-list-page').classList.remove('hidden-page');
    window.scrollTo(0, 0);
}

// ==========================================
// 3. STUDENT REGISTRATION & LOGIN (Supabase Connected)
// ==========================================

document.addEventListener("DOMContentLoaded", function() {
    const isRegistered = localStorage.getItem("isRegistered");
    const currentPage = window.location.pathname.split("/").pop();

    if (!isRegistered && (currentPage === "index.html" || currentPage === "")) {
        window.location.href = "register.html";
    }
});

// Student Registration Form Handler
async function handleRegistration(event) {
    event.preventDefault();
    
    const name = document.getElementById("fullName").value.trim();
    const rollNo = document.getElementById("rollNo").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value.trim();

    try {
        // Supabase Database 'Student registration' टेबल में डेटा डालना
        const { data, error } = await supabase
            .from('Student registration')
            .insert([
                { 
                    'Student name': name,
                    'Roll no': rollNo,
                    'E-mail': email
                }
            ]);

        if (error) {
            console.error("Supabase Error:", error);
            alert("Error saving to database: " + error.message);
            return;
        }

        // Local Storage Sync
        let students = JSON.parse(localStorage.getItem("studentsList")) || [];
        students.push({ name, rollNo, email, password, date: new Date().toLocaleDateString() });
        localStorage.setItem("studentsList", JSON.stringify(students));
        localStorage.setItem("isRegistered", "true");

        alert("Registration Successful! Data saved to Supabase.");
        window.location.href = "index.html";

    } catch (err) {
        alert("Registration Failed: " + err.message);
    }
}

// Student Login Verification
function handleLogin(event) {
    event.preventDefault();
    
    const userInput = document.getElementById('username').value.trim();
    const passwordInput = document.getElementById('password').value.trim();

    const fixedUsername = "nagarclg@1947";
    const fixedPassword = "aca.2026";

    let students = JSON.parse(localStorage.getItem("studentsList")) || [];
    let registeredUser = students.find(s => (s.email === userInput || s.rollNo === userInput) && s.password === passwordInput);

    if ((userInput === fixedUsername && passwordInput === fixedPassword) || registeredUser) {
        alert("Login Successful! Welcome to Ahmednagar College Portal.");
        window.location.href = "events.html";
    } else {
        alert("Incorrect Email/Username or Password!");
    }
}

// ==========================================
// 4. IMAGE UPLOAD & EVENT CREATION (Supabase Storage)
// ==========================================

async function uploadEventWithPhoto(event) {
    event.preventDefault();

    const title = document.getElementById("eventTitle").value;
    const category = document.getElementById("eventCategory").value;
    const desc = document.getElementById("eventDesc").value;
    const fileInput = document.getElementById("eventImageFile");
    const uploadBtn = document.getElementById("uploadBtn");

    if (fileInput.files.length === 0) {
        alert("Please select an image file!");
        return;
    }

    const file = fileInput.files[0];
    const fileName = `${Date.now()}_${file.name}`;
    uploadBtn.innerText = "Uploading Photo...";
    uploadBtn.disabled = true;

    try {
        // 1. Photo को Supabase Storage 'event-images' में अपलोड करें
        const { data: storageData, error: storageError } = await supabase.storage
            .from('event-images')
            .upload(fileName, file);

        if (storageError) throw storageError;

        // 2. Photo का Public Link प्राप्त करें
        const { data: urlData } = supabase.storage
            .from('event-images')
            .getPublicUrl(fileName);

        const publicImageUrl = urlData.publicUrl;

        // 3. Events टेबल में जानकारी सेव करें (If table exists)
        const { error: dbError } = await supabase
            .from('events')
            .insert([
                {
                    title: title,
                    category: category,
                    description: desc,
                    image_url: publicImageUrl
                }
            ]);

        alert("Event and Image Published Successfully!");
        document.getElementById("addEventForm").reset();
        loadSupabaseEvents();

    } catch (err) {
        console.error(err);
        alert("Upload failed: " + err.message);
    } finally {
        uploadBtn.innerText = "Upload & Publish Event";
        uploadBtn.disabled = false;
    }
}

// Fetch Events from Supabase
async function loadSupabaseEvents() {
    const grid = document.getElementById("dynamicEventsGrid");
    if (!grid) return;

    const { data: events, error } = await supabase.from('events').select('*');
    if (error || !events) return;

    events.forEach(evt => {
        const card = document.createElement("div");
        card.className = `card ${evt.category ? evt.category.toLowerCase() : 'cultural'}`;
        card.onclick = () => showCustomEventDetail(evt);
        card.innerHTML = `
            <span class="badge">${evt.category || 'Event'}</span>
            <h3>${evt.title}</h3>
            <p class="tap-hint">👉 Click to view details & photo</p>
        `;
        grid.prepend(card);
    });
}

function showCustomEventDetail(evt) {
    document.getElementById('events-list-page').classList.add('hidden-page');
    document.getElementById('event-detail-page').classList.remove('hidden-page');

    const detailContainer = document.getElementById('dynamic-detail-content');
    detailContainer.innerHTML = `
        <h2>${evt.title}</h2>
        <img src="${evt.image_url}" class="detail-img" alt="${evt.title}">
        <div class="info-box">
            <p><strong>Category:</strong> ${evt.category}</p>
            <p class="desc">${evt.description}</p>
        </div>
    `;
}
    
