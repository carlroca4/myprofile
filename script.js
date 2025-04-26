// Smooth scrolling for navigation links
document.querySelectorAll('a.nav-link').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        window.scrollTo({
            top: targetElement.offsetTop - 70,
            behavior: 'smooth'
        });
    });
});

// Custom cursor and laser trail
const cursor = document.getElementById('custom-cursor');
const trail = document.getElementById('laser-trail');
let isMoving = false;
let timeout;

// Cursor setup with error handling
if (!cursor || !trail) {
    console.error('Cursor elements not found. Using default cursor.');
    document.body.style.cursor = 'auto';
} else {
    document.body.style.cursor = 'none';

    // Mouse movement (desktop)
    document.addEventListener('mousemove', (e) => {
        try {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            trail.style.left = e.clientX + 'px';
            trail.style.top = e.clientY + 'px';
            if (!isMoving) {
                trail.classList.add('active');
                isMoving = true;
            }
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                trail.classList.remove('active');
                isMoving = false;
            }, 100);
        } catch (err) {
            console.error('Error in mousemove:', err);
            document.body.style.cursor = 'auto';
        }
    });

    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .card, .profile-img');
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
        element.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
    });
}

// Contact form validation
const contactForm = document.getElementById('contactForm');
const formFeedback = document.getElementById('formFeedback');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    let isValid = true;

    // Reset validation
    name.classList.remove('is-invalid');
    email.classList.remove('is-invalid');
    message.classList.remove('is-invalid');
    formFeedback.className = 'mt-3';
    formFeedback.textContent = '';

    // Validate inputs
    if (!name.value.trim()) {
        name.classList.add('is-invalid');
        isValid = false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value.trim())) {
        email.classList.add('is-invalid');
        isValid = false;
    }
    if (!message.value.trim()) {
        message.classList.add('is-invalid');
        isValid = false;
    }

    // Feedback
    if (isValid) {
        formFeedback.className = 'mt-3 alert alert-success';
        formFeedback.textContent = 'Message sent successfully! (Demo)';
        contactForm.reset();
    } else {
        formFeedback.className = 'mt-3 alert alert-danger';
        formFeedback.textContent = 'Please fill out all fields correctly.';
    }
});