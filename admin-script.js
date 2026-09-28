// Function to Add Event
function addCollegeEvent(e) {
    e.preventDefault();
    const title = document.getElementById("eventTitle").value;
    const category = document.getElementById("eventCategory").value;
    const date = document.getElementById("eventDate").value;
    const image = document.getElementById("eventImage").value;
    const desc = document.getElementById("eventDesc").value;

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
    let events = JSON.parse(localStorage.getItem("adminUploadedEvents")) || [];
    events.splice(index, 1);
    localStorage.setItem("adminUploadedEvents", JSON.stringify(events));
    loadAdminEvents();
}

// Ensure loadAdminEvents runs on dashboard load
document.addEventListener("DOMContentLoaded", function() {
    const currentPage = window.location.pathname.split("/").pop();
    if (currentPage === "admin-dashboard.html") {
        loadRegisteredStudents();
        loadLoginLogs();
        loadAdminEvents();
    }
});
