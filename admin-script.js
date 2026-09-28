// ==========================================
// 1. ADMIN AUTHENTICATION & ACCESS CONTROL
// ==========================================

// Handle Admin Login
function handleAdminLogin(e) {
    e.preventDefault();
    const user = document.getElementById("adminUsername").value.trim();
    const pass = document.getElementById("adminPassword").value.trim();

    if (user === "admin" && pass === "admin123") {
        localStorage.setItem("isAdminLoggedIn", "true");
        alert("Admin Login Successful!");
        window.location.href = "admin-dashboard.html";
    } else {
        alert("Invalid Admin Username or Password!");
    }
}

// Admin Logout
function adminLogout() {
    localStorage.removeItem("isAdminLoggedIn");
    alert("Admin Logged Out Successfully!");
    window.location.href = "admin-login.html";
}

// Security Check & Load All Data
document.addEventListener("DOMContentLoaded", function () {
    const currentPage = window.location.pathname.split("/").pop();

    if (currentPage === "admin-dashboard.html") {
        const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn");
        
        if (!isAdminLoggedIn || isAdminLoggedIn !== "true") {
            alert("Please login as Admin first!");
            window.location.href = "admin-login.html";
            return;
        }

        loadRegisteredStudents();
        loadLoginLogs();
        loadAdminEvents();
    }
});


// ==========================================
// 2. REGISTERED STUDENTS MANAGEMENT (DELETE FEATURE)
// ==========================================

// Load Registered Students Table
function loadRegisteredStudents() {
    const tbody = document.getElementById("studentTableBody");
    if (!tbody) return;

    let students = JSON.parse(localStorage.getItem("studentsList")) || [];
    tbody.innerHTML = "";

    if (students.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No students registered yet.</td></tr>`;
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
                <td><button class="delete-btn" onclick="deleteStudent(${index})">Delete Student</button></td>
            </tr>
        `;
    });
}

// Delete Registered Student
function deleteStudent(index) {
    if (confirm("Are you sure you want to remove this student account?")) {
        let students = JSON.parse(localStorage.getItem("studentsList")) || [];
        students.splice(index, 1);
        localStorage.setItem("studentsList", JSON.stringify(students));
        loadRegisteredStudents();
        alert("Student deleted successfully!");
    }
}


// ==========================================
// 3. LOGIN ACTIVITY LOGS MANAGEMENT
// ==========================================

// Load Login Activity
function loadLoginLogs() {
    const logList = document.getElementById("loginActivityList");
    if (!logList) return;

    let logs = JSON.parse(localStorage.getItem("loginLogs")) || [];
    logList.innerHTML = "";

    if (logs.length === 0) {
        logList.innerHTML = `<li>No login activity recorded yet.</li>`;
        return;
    }

    logs.reverse().forEach((log, index) => {
        logList.innerHTML += `
            <li style="margin-bottom: 5px;">
                🟢 <strong>${log.name}</strong> (${log.email}) logged in at <em>${log.time}</em>
            </li>
        `;
    });
}

// Clear All Login Logs
function clearLoginLogs() {
    if (confirm("Are you sure you want to clear all student login activity logs?")) {
        localStorage.removeItem("loginLogs");
        loadLoginLogs();
        alert("All login logs cleared!");
    }
}


// ==========================================
// 4. EVENTS MANAGEMENT (ADD / DELETE)
// ==========================================

// Add Event
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

// Load Events Table
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
                <td><button class="delete-btn" onclick="deleteEvent(${index})">Delete Event</button></td>
            </tr>
        `;
    });
}

// Delete Event
function deleteEvent(index) {
    if (confirm("Are you sure you want to delete this event?")) {
        let events = JSON.parse(localStorage.getItem("adminUploadedEvents")) || [];
        events.splice(index, 1);
        localStorage.setItem("adminUploadedEvents", JSON.stringify(events));
        loadAdminEvents();
        alert("Event deleted successfully!");
    }
}
