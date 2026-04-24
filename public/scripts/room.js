document.addEventListener('DOMContentLoaded', () => {
    const user = checkAuth();

    // Set Room Number
    document.getElementById('displayRoom').innerText = user.room || 'N/A';

    // Handle Cleaning Logic
    const btnClean = document.getElementById('btnClean');
    const statusText = document.getElementById('cleanStatus');
    
    // Check if already requested today
    const lastCleanDate = localStorage.getItem('hm_last_clean_date');
    const today = new Date().toLocaleDateString();

    if (lastCleanDate === today) {
        markAsRequested();
    }

    btnClean.addEventListener('click', () => {
        // Save request
        localStorage.setItem('hm_last_clean_date', today);
        
        // Visual Feedback
        btnClean.innerHTML = '✨ Cleaning Requested';
        btnClean.classList.remove('btn-outline');
        btnClean.classList.add('btn-primary');
        
        // Simulate API delay
        setTimeout(() => {
            markAsRequested();
            alert('Housekeeping has been notified!');
        }, 500);
    });

    function markAsRequested() {
        btnClean.innerHTML = '✅ Requested for Today';
        btnClean.style.background = '#ECFDF5';
        btnClean.style.color = '#10B981';
        btnClean.style.border = 'none';
        btnClean.disabled = true;
        statusText.style.display = 'block';
        statusText.innerText = 'Staff will visit between 10 AM - 12 PM.';
    }
});