async function login(email, password) {
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const result = await response.json();
        
        if (result.success) {
            localStorage.setItem('hm_currentUser', JSON.stringify(result.user));
            window.location.href = 'dashboard.html';
            return { success: true };
        }
        return { success: false, message: result.message };
    } catch (error) {
        return { success: false, message: 'Connection error' };
    }
}

function checkAuth() {
    const user = Storage.getCurrentUser();
    if (!user) {
        window.location.href = 'login.html'; // Kick out if not logged in
    }
    return user;
}