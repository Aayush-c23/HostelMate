document.addEventListener('DOMContentLoaded', () => {
    // 1. Check Auth & Get User
    const user = checkAuth(); // Defined in auth.js

    // 2. Load Existing Leaves
    loadLeaves();

    // 3. Handle Form Submission
    const form = document.getElementById('leaveForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const reason = document.getElementById('reason').value;
            const fromDate = document.getElementById('fromDate').value;
            const toDate = document.getElementById('toDate').value;

            // Create New Leave Object
            const newLeave = {
                id: Date.now(), // Unique ID based on time
                studentName: user.name,
                studentEmail: user.email,
                reason: reason,
                from: fromDate,
                to: toDate,
                status: 'Pending', // Default status
                appliedOn: new Date().toLocaleDateString()
            };

            // Save to Storage
            const leaves = Storage.get('hm_leaves'); // Get current list
            leaves.push(newLeave); // Add new one
            Storage.set('hm_leaves', leaves); // Save back

            // Reset Form & Reload Table
            form.reset();
            alert('Leave applied successfully!');
            loadLeaves();
        });
    }

    // --- FUNCTION TO LOAD TABLE ---
    function loadLeaves() {
        const listBody = document.getElementById('leaveTableBody');
        const allLeaves = Storage.get('hm_leaves');
        
        // Filter: Students see only their own, Admins see all
        let myLeaves = [];
        if(user.role === 'admin') {
            myLeaves = allLeaves;
        } else {
            myLeaves = allLeaves.filter(l => l.studentEmail === user.email);
        }

        listBody.innerHTML = ''; // Clear table

        if (myLeaves.length === 0) {
            listBody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:2rem;">No leave history found.</td></tr>';
            return;
        }

        // Sort by newest first
        myLeaves.reverse().forEach(leave => {
            const row = `
                <tr>
                    <td>
                        <div style="font-weight:600;">${leave.from} <span style="color:gray; font-weight:400;">to</span> ${leave.to}</div>
                        <div style="font-size:0.85rem; color:gray;">Applied: ${leave.appliedOn}</div>
                    </td>
                    <td>${leave.reason}</td>
                    <td>
                        <span class="status-badge status-${leave.status}">${leave.status}</span>
                    </td>
                    <td>
                        ${user.role === 'admin' && leave.status === 'Pending' ? 
                        `<button onclick="approveLeave(${leave.id})" style="color:green; background:none; border:none; cursor:pointer; font-weight:bold;">Approve</button>` : 
                        '<span style="color:#CBD5E1;">-</span>'}
                    </td>
                </tr>
            `;
            listBody.innerHTML += row;
        });
    }

    // --- ADMIN ACTION (Optional) ---
    window.approveLeave = (id) => {
        const leaves = Storage.get('hm_leaves');
        const index = leaves.findIndex(l => l.id === id);
        if(index > -1) {
            leaves[index].status = 'Approved';
            Storage.set('hm_leaves', leaves);
            loadLeaves(); // Refresh UI
        }
    };
});