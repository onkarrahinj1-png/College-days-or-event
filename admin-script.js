// ==========================================
// 1. ADMIN AUTHENTICATION & ACCESS CONTROL
// ==========================================

// Handle Admin Login (admin-login.html के लिए)
function handleAdminLogin(e) {
    e.preventDefault();
    const user = document.getElementById("adminUsername").value.trim();
    const pass = document.getElementById("adminPassword").value.trim();

    // Default Credentials
    if (user === "admin" && pass === "admin123") {
        localStorage.setItem("isAdminLoggedIn", "true");
        alert("Admin Login Successful!");
        window.location.href = "admin-dashboard.html";
    } else {
        alert("Invalid Admin Username or Password!");
    }
}

// Admin Logout Function
function adminLogout() {
    localStorage.removeItem("isAdminLoggedIn");
    alert("Admin Logged Out Successfully!");
    window.location.href = "admin-login.html";
}

// Ensure Page Access & Load All Data on Dashboard Load
document.addEventListener("DOMContentLoaded", function () {
    const currentPage = window.location.pathname.split("/").pop();

    if (currentPage === "admin-dashboard.html") {
        const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn");
        
        // Security Guard: Check if Admin is logged in
        if (!isAdminLoggedIn || isAdminLoggedIn !== "true") {
            alert("Please login as Admin first!");
            window.location.href = "admin-login.html";
            return;
        }

        // Load dashboard data
        loadRegisteredStudents();
        loadLoginLogs();
        loadAdminEvents();
    }
});


// ==========================================
// 2. REGISTERED STUDENTS & LOGIN LOGS
// ==========================================

// Load Registered Students Table
function loadRegisteredStudents() {
    const tbody = document.getElementById("studentTableBody");
    if (!tbody) return;

    let students = JSON.parse(localStorage.getItem("studentsList")) || [];
    tbody.innerHTML = "";

    if (students.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No students registered yet.</td></tr>`;
        return;
    }

    students.forEach((std, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${std.name}</strong></td>
                <td>${std.rollNo}</td>
                <td>${std.email}</td>
                <td>${std.date || 'N/A'}</td>
            </tr>
        `;
    });
}

// Load Student Login Activity Logs
function loadLoginLogs() {
    const logList = document.getElementById("loginActivityList");
    if (!logList) return;

    let logs = JSON.parse(localStorage.getItem("loginLogs")) || [];
    logList.innerHTML = "";

    if (logs.length === 0) {
        logList.innerHTML = `<li>No login activity recorded yet.</li>`;
        return;
    }

    logs.reverse().forEach(log => {
        logList.innerHTML += `<li><strong>${log.name}</strong> (${log.email}) logged in at <em>${log.time}</em></li>`;
    });
}


// ==========================================
// 3. COLLEGE EVENTS & DAYS MANAGEMENT
// ==========================================

// Function to Add Event / Days Info
function addCollegeEvent(e) {
    e.preventDefault();
    const title = document.getElementById("eventTitle").value.trim();
    const category = document.getElementById("eventCategory").value;
    const date = document.getElementById("eventDate").value;
    const image = document.getElementById("eventImage").value.trim();
    const desc = document.getElementById("eventDesc").value.trim();

    let events = JSON.parse(localStorage.getItem("adminUploadedEvents")) || [];
    events.push({ title, category, date, image, desc });

    localStorage.setItem("adminUploadedEvents", JSON.stringify(events));
    document.getElementById("eventForm").reset();
    loadAdminEvents();
    alert("New Event Information Added Successfully!");
}

// Function to Load Events Table in Dashboard
function loadAdminEvents() {
    const tbody = document.getElementById("eventTableBody");
    if (!tbody) return;

    let events = JSON.parse(localStorage.getItem("adminUploadedEvents")) || [];
    tbody.innerHTML = "";

    if (events.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No events uploaded yet.</td></tr>`;
        return;
    }

    events.forEach((evt, index) => {
        tbody.innerHTML += `
            <tr>
                <td><strong>${evt.title}</strong></td>
                <td>${evt.category}</td>
                <td>${evt.date}</td>
                <td><code>${evt.image}</code></td>
                <td><button class="delete-btn" onclick="deleteEvent(${index})">Delete</button></td>
            </tr>
        `;
    });
}

// Function to Delete Event
function deleteEvent(index) {
    if (confirm("Are you sure you want to delete this event?")) {
        let events = JSON.parse(localStorage.getItem("adminUploadedEvents")) || [];
        events.splice(index, 1);
        localStorage.setItem("adminUploadedEvents", JSON.stringify(events));
        loadAdminEvents();
    }
}
