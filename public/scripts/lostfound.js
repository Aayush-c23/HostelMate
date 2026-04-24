document.addEventListener('DOMContentLoaded', async () => {
    const user = checkAuth();
    
    await loadItems();

    // HANDLE FORM SUBMIT
    const form = document.getElementById('lostFoundForm');
    if(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const type = document.getElementById('type').value;
            
            const newItem = {
                type: type,
                name: document.getElementById('itemName').value,
                desc: document.getElementById('itemDesc').value,
                contact: type === 'Found' ? 'Security Desk' : `${user.name} (${user.room || 'Hostel'})`,
                createdBy: user.email
            };

            try {
                const response = await fetch('/api/lostfound', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newItem)
                });
                
                if (response.ok) {
                    form.reset();
                    await loadItems();
                } else {
                    alert('Error adding item');
                }
            } catch (error) {
                alert('Error adding item');
            }
        });
    }

    // RENDER ITEMS
    async function loadItems() {
        const grid = document.getElementById('itemsGrid');
        
        try {
            const response = await fetch('/api/lostfound');
            const items = await response.json();
            grid.innerHTML = '';

            if(items.length === 0) {
                grid.innerHTML = '<p style="color:gray;">No items reported yet.</p>';
                return;
            }

            items.forEach(item => {
                const isLost = item.type === 'Lost';
                const canDelete = (user.role === 'admin') || (item.createdBy === user.email);

                const card = `
                    <div class="card" style="padding: 1.5rem; position:relative;">
                        
                        ${canDelete ? 
                            `<button onclick="deleteLF('${item._id}')" style="position:absolute; top:15px; left:15px; background:#FEE2E2; color:red; border:none; border-radius:50%; width:30px; height:30px; cursor:pointer; font-weight:bold; font-size:1.2rem; line-height:1;">&times;</button>` 
                            : ''}

                        <div style="position:absolute; top:15px; right:15px; background:${isLost ? '#FEF2F2' : '#ECFDF5'}; color:${isLost ? '#EF4444' : '#10B981'}; padding:5px 12px; border-radius:20px; font-weight:700; font-size:0.8rem;">
                            ${item.type.toUpperCase()}
                        </div>
                        
                        <div style="font-size:2rem; margin-bottom:10px;">
                            ${isLost ? '❓' : '🎒'}
                        </div>
                        
                        <h3 style="font-size:1.1rem; margin-bottom:5px;">${item.name}</h3>
                        <p style="color:gray; font-size:0.9rem; margin-bottom:10px;">${item.desc}</p>
                        
                        <div style="border-top:1px solid #eee; padding-top:10px; margin-top:10px; font-size:0.85rem;">
                            <div><b>Contact:</b> ${item.contact}</div>
                            <div style="color:#aaa; font-size:0.8rem; margin-top:5px;">${item.date}</div>
                        </div>
                    </div>
                `;
                grid.innerHTML += card;
            });
        } catch (error) {
            grid.innerHTML = '<p style="color:red;">Error loading items.</p>';
        }
    }

    // DELETE FUNCTION
    window.deleteLF = async (id) => {
        if(confirm('Are you sure you want to delete this item?')) {
            try {
                const response = await fetch(`/api/lostfound/${id}`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    await loadItems();
                } else {
                    alert('Error deleting item');
                }
            } catch (error) {
                alert('Error deleting item');
            }
        }
    };
});