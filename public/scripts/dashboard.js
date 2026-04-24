document.addEventListener('DOMContentLoaded', async () => {
    const user = checkAuth();

    // Set Date
    const dateElement = document.getElementById('dash-date');
    if (dateElement) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.innerText = new Date().toLocaleDateString('en-US', options);
    }

    // Show correct view
    if (user.role === 'student') {
        document.getElementById('student-view').style.display = 'block';
        await loadStudentData();
    } else if (user.role === 'admin') {
        document.getElementById('admin-view').style.display = 'block';
        await loadAdminData();
        await loadNoticesForAdmin();
    }

    // STUDENT DATA FUNCTIONS
    async function loadStudentData() {
        const firstName = user.name.split(' ')[0];
        const firstNameEl = document.getElementById('user-first-name');
        if(firstNameEl) firstNameEl.innerText = firstName;

        // Load mess menu from API
        try {
            const response = await fetch('/api/mess');
            const menu = await response.json();
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const today = days[new Date().getDay()];
            const lunchItem = (menu[today] && menu[today].l) ? menu[today].l : 'Special Meal';
            document.getElementById('mess-lunch').innerText = lunchItem;
        } catch (error) {
            document.getElementById('mess-lunch').innerText = 'Special Meal';
        }

        // Load complaints count from API
        try {
            const response = await fetch(`/api/complaints?role=${user.role}&email=${user.email}`);
            const complaints = await response.json();
            const myPending = complaints.filter(c => c.status === 'Pending').length;
            document.getElementById('pending-count').innerText = myPending;
        } catch (error) {
            document.getElementById('pending-count').innerText = '0';
        }

        await renderNotices('dash-notices');
    }

    // ADMIN DATA FUNCTIONS
    async function loadAdminData() {
        try {
            const response = await fetch(`/api/complaints?role=admin`);
            const complaints = await response.json();
            const openComplaints = complaints.filter(c => c.status === 'Pending').length;
            document.getElementById('admin-complaint-count').innerText = openComplaints;
        } catch (error) {
            document.getElementById('admin-complaint-count').innerText = '0';
        }
        
        // Handle "Post Notice" Form
        const noticeForm = document.getElementById('noticeForm');
        if(noticeForm) {
            const newForm = noticeForm.cloneNode(true);
            noticeForm.parentNode.replaceChild(newForm, noticeForm);
            
            newForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const title = document.getElementById('noticeTitle').value;
                const tag = document.getElementById('noticeTag').value || 'Info';

                try {
                    await fetch('/api/notices', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ title, tag })
                    });
                    alert('Notice Posted!');
                    newForm.reset();
                    await loadNoticesForAdmin();
                } catch (error) {
                    alert('Error posting notice');
                }
            });
        }
    }

    async function loadNoticesForAdmin() {
        const container = document.querySelector('#admin-view .grid-container');
        if(container && !document.getElementById('admin-notices')) {
            const tableHTML = `
                <h3 style="margin: 2rem 0 1rem 0;">Manage Notices</h3>
                <div class="table-container">
                    <table id="admin-notices"></table>
                </div>
            `;
            container.insertAdjacentHTML('afterend', tableHTML);
        }
        await renderNotices('admin-notices');
    }

    // SHARED NOTICE RENDERER
    async function renderNotices(tableId) {
        const list = document.getElementById(tableId);
        if(!list) return;

        try {
            const response = await fetch('/api/notices');
            const notices = await response.json();
            list.innerHTML = '';
            
            if(notices.length === 0) {
                list.innerHTML = '<tr><td colspan="2" style="color:gray;">No notices.</td></tr>';
                return;
            }

            notices.slice(0, 5).forEach(n => {
                let deleteBtn = '';
                if(user.role === 'admin') {
                    deleteBtn = `
                        <span onclick="deleteNotice('${n._id}')" 
                              style="color:red; cursor:pointer; font-weight:bold; margin-left:10px; font-size:1.2rem;" 
                              title="Delete Notice">×</span>
                    `;
                }

                const row = `
                    <tr>
                        <td>
                            <span style="font-weight:600;">${n.title}</span>
                            <span class="status-badge status-Pending" style="font-size:0.7rem; padding:2px 6px;">${n.tag || 'Info'}</span>
                            ${deleteBtn}
                        </td>
                        <td style="text-align:right; color:gray;">${n.date}</td>
                    </tr>
                `;
                list.innerHTML += row;
            });
        } catch (error) {
            list.innerHTML = '<tr><td colspan="2" style="color:gray;">Error loading notices.</td></tr>';
        }
    }

    if(user.role === 'student') {
        await renderNotices('dash-notices');
    }
    
    if(user.role === 'admin') {
        await renderNotices('admin-notices');
    }

    // DELETE FUNCTION
    window.deleteNotice = async (id) => {
        if(confirm('Delete this announcement?')) {
            try {
                await fetch(`/api/notices/${id}`, {
                    method: 'DELETE'
                });
                
                if(document.getElementById('dash-notices')) await renderNotices('dash-notices');
                if(document.getElementById('admin-notices')) await renderNotices('admin-notices');
            } catch (error) {
                alert('Error deleting notice');
            }
        }
    };
});