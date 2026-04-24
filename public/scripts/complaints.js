document.addEventListener('DOMContentLoaded', async () => {
    const user = checkAuth();

    // ROLE-BASED VISIBILITY: Hide complaint form for admins
    if (user.role === 'admin') {
        const complaintForm = document.querySelector('.card');
        if (complaintForm) {
            complaintForm.style.display = 'none';
        }
        const pageTitle = document.querySelector('.top-bar h2');
        if (pageTitle) pageTitle.textContent = 'Manage Complaints';
        const pageDesc = document.querySelector('.top-bar p');
        if (pageDesc) pageDesc.textContent = 'Review and resolve student complaints.';
    }

    // Auto-fill Room (only for students)
    const roomInput = document.getElementById('roomNo');
    if (roomInput && user.role === 'student') roomInput.value = user.room || 'N/A';

    await loadComplaints();

    // Handle Form Submit
    const form = document.getElementById('complaintForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const category = document.getElementById('category').value;
            const desc = document.getElementById('desc').value;

            const newComplaint = {
                studentName: user.name,
                studentEmail: user.email,
                room: user.room || 'N/A',
                category: category,
                description: desc,
                status: 'Pending'
            };

            try {
                const response = await fetch('/api/complaints', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newComplaint)
                });
                
                if (response.ok) {
                    form.reset();
                    if (roomInput) roomInput.value = user.room || 'N/A';
                    alert('Complaint registered!');
                    await loadComplaints();
                } else {
                    alert('Error registering complaint');
                }
            } catch (error) {
                alert('Error registering complaint');
            }
        });
    }

    // LOAD TABLE
    async function loadComplaints() {
        const listBody = document.getElementById('complaintTableBody');
        
        try {
            const response = await fetch(`/api/complaints?role=${user.role}&email=${user.email}`);
            const complaints = await response.json();
            
            listBody.innerHTML = '';

            if (complaints.length === 0) {
                listBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:2rem;">No active complaints.</td></tr>';
                return;
            }

            complaints.reverse().forEach(c => {
                let actionButtons = '-';
                
                if (user.role === 'admin') {
                    actionButtons = `
                        <div style="display:flex; gap:5px;">
                            ${c.status === 'Pending' ? 
                            `<button onclick="resolveComplaint('${c._id}')" style="background:#10B981; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;" title="Mark Resolved">✔</button>` 
                            : ''}
                            
                            <button onclick="deleteComplaint('${c._id}')" style="background:#EF4444; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;" title="Delete Complaint">🗑</button>
                        </div>
                    `;
                }

                const row = `
                    <tr>
                        <td style="font-weight:600; font-size:0.9rem;">#${c._id.slice(-6)}</td>
                        <td>
                            <div style="font-weight:600;">${c.category}</div>
                            <div style="font-size:0.8rem; color:gray;">${c.date}</div>
                        </td>
                        <td style="max-width:300px; line-height:1.4;">
                            ${user.role === 'admin' ? `<b>Room ${c.room}:</b> ` : ''}
                            ${c.description}
                        </td>
                        <td>
                            <span class="status-badge status-${c.status === 'Pending' ? 'Pending' : 'Resolved'}">
                                ${c.status}
                            </span>
                        </td>
                        <td>
                            ${actionButtons}
                        </td>
                    </tr>
                `;
                listBody.innerHTML += row;
            });
        } catch (error) {
            listBody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:red;">Error loading complaints</td></tr>';
        }
    }

    // ADMIN ACTIONS
    window.resolveComplaint = async (id) => {
        try {
            const response = await fetch(`/api/complaints/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Resolved' })
            });
            
            if (response.ok) {
                await loadComplaints();
            } else {
                alert('Error resolving complaint');
            }
        } catch (error) {
            alert('Error resolving complaint');
        }
    };

    window.deleteComplaint = async (id) => {
        if(confirm('Are you sure you want to delete this complaint permanently?')) {
            try {
                const response = await fetch(`/api/complaints/${id}`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    await loadComplaints();
                } else {
                    alert('Error deleting complaint');
                }
            } catch (error) {
                alert('Error deleting complaint');
            }
        }
    };
});