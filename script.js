// Optimized smooth scrolling for navigation links
document.querySelectorAll('a.nav-link').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        const offsetTop = targetElement.offsetTop - 70;

        // Smooth scroll using requestAnimationFrame
        const start = window.scrollY;
        const distance = offsetTop - start;
        const duration = 500; // in ms
        let startTime = null;

        function scrollAnimation(currentTime) {
            if (!startTime) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const ease = progress < 0.5
                ? 2 * progress * progress
                : -1 + (4 - 2 * progress) * progress;
            window.scrollTo(0, start + distance * ease);
            if (timeElapsed < duration) requestAnimationFrame(scrollAnimation);
        }

        requestAnimationFrame(scrollAnimation);
    });
});

// Custom cursor and laser trail
const customCursor = document.getElementById('custom-cursor');
const trail = document.getElementById('laser-trail');

if (!customCursor || !trail) {
    console.error('Custom cursor or trail element not found. Skipping custom cursor setup.');
    document.body.style.cursor = 'auto'; // Fallback to default cursor
} else {
    let isMoving = false;
    let timeout;

    document.body.style.cursor = 'none';

    // Mouse movement (desktop)
    document.addEventListener('mousemove', (e) => {
        customCursor.style.left = `${e.clientX}px`;
        customCursor.style.top = `${e.clientY}px`;
        trail.style.left = `${e.clientX}px`;
        trail.style.top = `${e.clientY}px`;
        if (!isMoving) {
            trail.classList.add('active');
            isMoving = true;
        }
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            trail.classList.remove('active');
            isMoving = false;
        }, 100);
    });

    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .card, .profile-img');
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => customCursor.classList.add('hovered'));
        element.addEventListener('mouseleave', () => customCursor.classList.remove('hovered'));
    });
}

// Typing animation for dynamic text with light effect
const dynamicText = document.getElementById('dynamic-text');
const typingCursor = document.querySelector('.cursor'); // Ensure correct variable name
const phrases = ["IT Student", "Tech Explorer", "Problem Solver"];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentPhrase = phrases[phraseIndex];
    if (isDeleting) {
        charIndex--;
    } else {
        charIndex++;
    }

    dynamicText.textContent = currentPhrase.substring(0, charIndex);

    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        setTimeout(typeEffect, 1000); // Pause before deleting
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(typeEffect, 500); // Pause before typing next phrase
    } else {
        setTimeout(typeEffect, isDeleting ? 50 : 100); // Typing speed
    }
}

// Blinking cursor effect
if (typingCursor) {
    setInterval(() => {
        typingCursor.classList.toggle('active');
    }, 500);
}

typeEffect();

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