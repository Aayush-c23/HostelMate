const user = Storage.getCurrentUser();
if(user.role === 'admin') {
    document.getElementById('admin-area').innerHTML = `<div class="card" style="margin-bottom:2rem;"><form id="noticeForm"><input id="title" class="form-control" placeholder="Title" style="margin-bottom:10px" required><textarea id="content" class="form-control" placeholder="Message" style="margin-bottom:10px" required></textarea><button class="btn btn-primary">Post Notice</button></form></div>`;
    document.getElementById('noticeForm').addEventListener('submit', (e) => {
        e.preventDefault();
        let all = Storage.get('hm_notices');
        all.push({id: Date.now(), title: document.getElementById('title').value, content: document.getElementById('content').value, date: new Date().toISOString().split('T')[0] });
        Storage.set('hm_notices', all); location.reload();
    });
}
document.getElementById('list').innerHTML = Storage.get('hm_notices').map(n => `<tr><td>${n.title}</td><td>${n.date}</td><td>${n.content}</td><td>${user.role==='admin'?`<button onclick="del(${n.id})" style="color:red;border:none;background:none">Delete</button>`:''}</td></tr>`).join('');
window.del = function(id) { Storage.set('hm_notices', Storage.get('hm_notices').filter(n=>n.id!==id)); location.reload(); };