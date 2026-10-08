// ==========================================
// 1. SUPABASE INITIALIZATION & CONFIG
// ==========================================
const SUPABASE_URL = "https://cixcdchvkzwhcfkdtjxs.supabase.co";
const SUPABASE_KEY = "sb_publishable_5kDtCBsEgOI7i0-jGwWHuw_AAuSZNwf"; // Publishable Key
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

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
// 2. REGISTERED STUDENTS MANAGEMENT (LIVE SUPABASE FETCH)
// ==========================================

// Load Registered Students Table from Supabase
async function loadRegisteredStudents() {
    const tbody = document.getElementById("studentTableBody");
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Loading students data from Supabase...</td></tr>`;

    try {
        const { data: students, error } = await supabase
            .from('Student registration')
            .select('*');

        if (error) throw error;

        tbody.innerHTML = "";

        if (!students || students.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No students registered yet in Supabase.</td></tr>`;
            return;
        }

        students.forEach((std, index) => {
            tbody.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td><strong>${std['Student name'] || 'N/A'}</strong></td>
                    <td>${std['Roll no'] || 'N/A'}</td>
                    <td>${std['E-mail'] || 'N/A'}</td>
                    <td><button class="delete-btn" onclick="deleteStudent(${std.id})">Delete Student</button></td>
                </tr>
            `;
        });
    } catch (err) {
        console.error("Error loading students:", err);
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:red;">Failed to load data: ${err.message}</td></tr>`;
    }
}

// Delete Registered Student from Supabase
async function deleteStudent(id) {
    if (confirm("Are you sure you want to remove this student account from Supabase database?")) {
        try {
            const { error } = await supabase
                .from('Student registration')
                .delete()
                .eq('id', id);

            if (error) throw error;

            alert("Student deleted successfully!");
            loadRegisteredStudents();
        } catch (err) {
            alert("Delete failed: " + err.message);
        }
    }
}


// ==========================================
// 3. LOGIN ACTIVITY LOGS MANAGEMENT
// ==========================================

function loadLoginLogs() {
    const logList = document.getElementById("loginActivityList");
    if (!logList) return;

    let logs = JSON.parse(localStorage.getItem("loginLogs")) || [];
    logList.innerHTML = "";

    if (logs.length === 0) {
        logList.innerHTML = `<li>No login activity recorded yet.</li>`;
        return;
    }

    logs.reverse().forEach((log) => {
        logList.innerHTML += `
            <li style="margin-bottom: 5px;">
                🟢 <strong>${log.name}</strong> (${log.email}) logged in at <em>${log.time}</em>
            </li>
        `;
    });
}

function clearLoginLogs() {
    if (confirm("Are you sure you want to clear all student login activity logs?")) {
        localStorage.removeItem("loginLogs");
        loadLoginLogs();
        alert("All login logs cleared!");
    }
}


// ==========================================
// 4. EVENTS MANAGEMENT (SUPABASE CONNECTED)
// ==========================================

// Add Event to Supabase 'events' Table
async function addCollegeEvent(e) {
    e.preventDefault();
    const title = document.getElementById("eventTitle").value.trim();
    const category = document.getElementById("eventCategory").value;
    const image = document.getElementById("eventImage").value.trim();
    const desc = document.getElementById("eventDesc").value.trim();
    const btn = document.getElementById("eventSubmitBtn");

    btn.innerText = "Publishing...";
    btn.disabled = true;

    try {
        const { error } = await supabase
            .from('events')
            .insert([
                {
                    title: title,
                    category: category,
                    description: desc,
                    image_url: image
                }
            ]);

        if (error) throw error;

        alert("New Event Information Added to Supabase Successfully!");
        document.getElementById("eventForm").reset();
        loadAdminEvents();
    } catch (err) {
        alert("Failed to add event: " + err.message);
    } finally {
        btn.innerText = "Upload Event Info";
        btn.disabled = false;
    }
}

// Load Events Table from Supabase
async function loadAdminEvents() {
    const tbody = document.getElementById("eventTableBody");
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Loading events...</td></tr>`;

    try {
        const { data: events, error } = await supabase
            .from('events')
            .select('*');

        if (error) throw error;

        tbody.innerHTML = "";

        if (!events || events.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">No events uploaded yet.</td></tr>`;
            return;
        }

        events.forEach((evt) => {
            tbody.innerHTML += `
                <tr>
                    <td><strong>${evt.title}</strong></td>
                    <td>${evt.category || 'General'}</td>
                    <td><code>${evt.image_url}</code></td>
                    <td><button class="delete-btn" onclick="deleteEvent(${evt.id})">Delete Event</button></td>
                </tr>
            `;
        });
    } catch (err) {
        console.error("Error loading events:", err);
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:red;">Failed to load events.</td></tr>`;
    }
}

// Delete Event from Supabase
async function deleteEvent(id) {
    if (confirm("Are you sure you want to delete this event from Supabase?")) {
        try {
            const { error } = await supabase
                .from('events')
                .delete()
                .eq('id', id);

            if (error) throw error;

            alert("Event deleted successfully!");
            loadAdminEvents();
        } catch (err) {
            alert("Delete failed: " + err.message);
        }
    }
}
