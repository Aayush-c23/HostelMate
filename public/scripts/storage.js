const Storage = {
    init() {
        if (!localStorage.getItem('hm_users')) {
            const users = [
                { name: 'Student User', email: 'student@hostel.com', password: '123', role: 'student', room: '304-B', hostel: 'BH-1' },
                { name: 'Admin User', email: 'admin@hostel.com', password: '123', role: 'admin' }
            ];
            localStorage.setItem('hm_users', JSON.stringify(users));
        }
        if (!localStorage.getItem('hm_complaints')) localStorage.setItem('hm_complaints', JSON.stringify([]));
        if (!localStorage.getItem('hm_leaves')) localStorage.setItem('hm_leaves', JSON.stringify([]));
        if (!localStorage.getItem('hm_notices')) {
            localStorage.setItem('hm_notices', JSON.stringify([
                { id: 1, title: 'Welcome', date: 'Oct 24', content: 'Welcome to HostelMate!' },
                { id: 2, title: 'Mess Timing', date: 'Oct 25', content: 'Lunch is now 12:30 PM.' }
            ]));
        }
        if (!localStorage.getItem('hm_mess')) {
            const menu = {
                Mon: { b: 'Idli Sambar', l: 'Rice Dal', d: 'Chapati' },
                Tue: { b: 'Poha', l: 'Rajma Rice', d: 'Egg Curry' },
                Wed: { b: 'Dosa', l: 'Curd Rice', d: 'Biryani' },
                Thu: { b: 'Upma', l: 'Veg Pulao', d: 'Roti Sabzi' },
                Fri: { b: 'Vada', l: 'Lemon Rice', d: 'Pasta' },
                Sat: { b: 'Paratha', l: 'Khichdi', d: 'Paneer' },
                Sun: { b: 'Bread Jam', l: 'Feast', d: 'Light Meal' }
            };
            localStorage.setItem('hm_mess', JSON.stringify(menu));
        }
    },
    get(key) { return JSON.parse(localStorage.getItem(key)) || []; },
    set(key, data) { localStorage.setItem(key, JSON.stringify(data)); },
    
    getCurrentUser() { return JSON.parse(localStorage.getItem('hm_currentUser')); },
    
    // Added this helper to make logout button work
    logout() { 
        localStorage.removeItem('hm_currentUser'); 
        window.location.href = 'login.html';
    }
};

// Initialize data immediately
Storage.init();