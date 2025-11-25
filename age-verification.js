// Age Verification
document.addEventListener('DOMContentLoaded', function() {
    const ageModal = document.getElementById('ageModal');
    const confirmAge = document.getElementById('confirmAge');
    const denyAge = document.getElementById('denyAge');
    
    // Check if age was already confirmed
    if (!localStorage.getItem('ageVerified')) {
        setTimeout(() => {
            ageModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }, 1000);
    }
    
    confirmAge.addEventListener('click', function() {
        localStorage.setItem('ageVerified', 'true');
        ageModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Track confirmation
        if (typeof gtag !== 'undefined') {
            gtag('event', 'age_verified', {
                'event_category': 'engagement'
            });
        }
    });
    
    denyAge.addEventListener('click', function() {
        // Redirect to safe page
        window.location.href = 'https://www.google.com';
    });
    
    // Close modal on outside click
    ageModal.addEventListener('click', function(e) {
        if (e.target === ageModal) {
            // Don't allow closing by clicking outside for age verification
            return;
        }
    });

    // Prevent right-click and text selection (optional, for content protection)
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    // Prevent text selection on sensitive elements
    const sensitiveElements = document.querySelectorAll('.hero-title, .hero-subtitle, .module-content, .team-member');
    sensitiveElements.forEach(el => {
        el.style.userSelect = 'none';
        el.style.webkitUserSelect = 'none';
    });
});
