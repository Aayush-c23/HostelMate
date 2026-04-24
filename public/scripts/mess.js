document.addEventListener('DOMContentLoaded', async () => {
    const user = checkAuth();
    
    // ROLE-BASED VISIBILITY: Only show admin controls for admins
    const controls = document.getElementById('admin-mess-controls');
    if (user.role === 'admin' && controls) {
        controls.style.display = 'block';
    } else if (controls) {
        controls.style.display = 'none';
    }

    await loadMenu();

    // HANDLE MENU EDIT
    const editForm = document.getElementById('messEditForm');
    if(editForm) {
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const day = document.getElementById('editDay').value;
            const meal = document.getElementById('editMeal').value;
            const newFood = document.getElementById('editFood').value;

            try {
                const response = await fetch('/api/mess', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ day, [meal]: newFood })
                });
                
                if (response.ok) {
                    alert(`Updated ${day}'s menu!`);
                    await loadMenu();
                    document.getElementById('editFood').value = '';
                } else {
                    alert('Error updating menu');
                }
            } catch (error) {
                alert('Error updating menu');
            }
        });
    }

    // LOAD MENU FUNCTION
    async function loadMenu() {
        const tbody = document.getElementById('messTable');
        if(!tbody) return;

        try {
            const response = await fetch('/api/mess');
            const menu = await response.json();
            tbody.innerHTML = '';

            const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

            days.forEach(day => {
                if(menu[day]) {
                    const row = `
                        <tr>
                            <td style="font-weight:700; color:var(--primary);">${day}</td>
                            <td>${menu[day].b}</td>
                            <td>${menu[day].l}</td>
                            <td>${menu[day].d}</td>
                        </tr>
                    `;
                    tbody.innerHTML += row;
                }
            });
        } catch (error) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:red;">Error loading menu</td></tr>';
        }
    }
});