document.addEventListener('DOMContentLoaded', () => {
    const user = Storage.getCurrentUser();
    if (!user) return; // Stop if not logged in

    // 1. Common Links (Everyone sees these)
    let menuItems = `
        <a href="dashboard.html" class="nav-item ${window.location.href.includes('dashboard') ? 'active' : ''}">
            <img src="assets/icons/icon-dashboard.png" class="nav-icon"> Dashboard
        </a>
        <a href="mess.html" class="nav-item ${window.location.href.includes('mess') ? 'active' : ''}">
            <img src="assets/icons/icon-mess.png" class="nav-icon"> Mess Menu
        </a>
        <a href="complaint.html" class="nav-item ${window.location.href.includes('complaint') ? 'active' : ''}">
            <img src="assets/icons/icon-complaint.png" class="nav-icon"> Complaints
        </a>
        <a href="leave.html" class="nav-item ${window.location.href.includes('leave') ? 'active' : ''}">
            <img src="assets/icons/icon-leave.png" class="nav-icon"> Leave
        </a>
    `;

    // 2. Student Specific Links
    if (user.role === 'student') {
        menuItems += `
            <a href="lostfound.html" class="nav-item ${window.location.href.includes('lostfound') ? 'active' : ''}">
                <img src="assets/icons/icon-lostfound.png" class="nav-icon"> Lost & Found
            </a>
            <a href="room.html" class="nav-item ${window.location.href.includes('room') ? 'active' : ''}">
                <img src="assets/icons/icon-room.png" class="nav-icon"> My Room
            </a>
        `;
    }

    // 3. Admin Specific Links (NO ROOM PAGE HERE)
    if (user.role === 'admin') {
        menuItems += `
            <a href="attendance.html" class="nav-item ${window.location.href.includes('attendance') ? 'active' : ''}">
                <img src="assets/icons/icon-attendance.png" class="nav-icon"> Attendance
            </a>
            <a href="lostfound.html" class="nav-item ${window.location.href.includes('lostfound') ? 'active' : ''}">
                <img src="assets/icons/icon-lostfound.png" class="nav-icon"> Lost & Found
            </a>
        `;
    }

    // 4. Render Sidebar
    const sidebarHTML = `
        <div class="sidebar">
            <div class="sidebar-header">
                <img src="assets/logo.png" alt="HostelMate" style="height: 40px; width: auto;">
            </div>
            <nav class="nav-links">
                ${menuItems}
                <div style="flex-grow:1"></div>
                <a href="#" onclick="Storage.logout()" class="nav-item logout-btn">
                    <img src="assets/icons/icon-logout.png" class="nav-icon"> Logout
                </a>
            </nav>
        </div>
    `;

    document.body.insertAdjacentHTML('afterbegin', sidebarHTML);

    // Render Top Bar Profile
    const profileDiv = document.querySelector('.user-profile');
    if (profileDiv) {
        profileDiv.innerHTML = `
            <div style="text-align:right;">
                <div style="font-weight:700; font-size:0.9rem;">${user.name}</div>
                <div style="font-size:0.8rem; color:gray;">${user.role.toUpperCase()}</div>
            </div>
            <img src="assets/images/${user.role === 'admin' ? 'login-admin.png' : 'login-student.png'}" class="avatar-img" style="width:40px; height:40px; border-radius:50%; object-fit:cover;">
        `;
    }
});