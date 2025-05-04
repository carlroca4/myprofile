/**
 * Initialize AOS for scroll animations
 */
AOS.init({
    duration: 800,
    once: true
});

/**
 * Spiderweb Animation
 */
const canvas = document.getElementById('spiderweb-canvas');
const ctx = canvas.getContext('2d');

if (!ctx) {
    console.error('Failed to get canvas context. Canvas may not be supported.');
} else {
    console.log('Canvas context initialized successfully.');
}

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    console.log(`Canvas resized to ${canvas.width}x${canvas.height}`);
}
resizeCanvas();

// Spiderweb parameters
const numRadials = 12;
let maxRadius = Math.min(canvas.width, canvas.height) * 0.4;
let centerX = canvas.width / 2;
let centerY = canvas.height / 2;
let time = 0;

function drawSpiderweb() {
    try {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const isMobile = window.innerWidth <= 576;
        const opacity = isMobile ? 0.5 : 0.7;
        const offsetMultiplier = isMobile ? 10 : 20;

        for (let i = 0; i < numRadials; i++) {
            const angle = (i / numRadials) * Math.PI * 2;
            const offset = Math.sin(time * 0.02) * offsetMultiplier;
            const endX = centerX + Math.cos(angle) * (maxRadius + offset);
            const endY = centerY + Math.sin(angle) * (maxRadius + offset);

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        for (let r = maxRadius * 0.2; r <= maxRadius; r += maxRadius * 0.2) {
            ctx.beginPath();
            for (let i = 0; i <= numRadials; i++) {
                const angle = (i / numRadials) * Math.PI * 2;
                const offset = Math.sin(time * 0.02 + r * 0.01) * (offsetMultiplier / 2);
                const x = centerX + Math.cos(angle) * (r + offset);
                const y = centerY + Math.sin(angle) * (r + offset);
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.closePath();
            ctx.strokeStyle = `rgba(192, 0, 0, ${opacity + 0.2})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }

        time++;
        console.log('Spiderweb frame rendered');
        requestAnimationFrame(drawSpiderweb);
    } catch (error) {
        console.error('Error in drawSpiderweb:', error);
    }
}

if (ctx) {
    drawSpiderweb();
}

window.addEventListener('resize', () => {
    resizeCanvas();
    centerX = canvas.width / 2;
    centerY = canvas.height / 2;
    maxRadius = Math.min(canvas.width, canvas.height) * 0.4;
});

/**
 * Smooth scrolling for navigation links and ensure all buttons are functional
 */
document.querySelectorAll('a.nav-link').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
        // Collapse navbar on mobile after clicking a link
        const navbarCollapse = document.getElementById('navbarNav');
        if (window.innerWidth <= 991 && navbarCollapse.classList.contains('show')) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                toggle: false
            });
            bsCollapse.hide();
        }
    });
});

/**
 * Ensure navbar toggler works properly and remains functional
 */
const navbarToggler = document.querySelector('.navbar-toggler');
const navbarCollapse = document.getElementById('navbarNav');
navbarToggler.addEventListener('click', () => {
    const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
        toggle: true
    });
});

/**
 * Add scrolled class to navbar for visual effect
 */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

/**
 * Custom cursor and laser trail effects
 */
const cursor = document.getElementById('custom-cursor');
const trail = document.getElementById('laser-trail');
let isMoving = false;
let timeout;

document.addEventListener('mousemove', (e) => {
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
});

document.addEventListener('wheel', (e) => {
    trail.classList.add('active');
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        trail.classList.remove('active');
    }, 200);
});

let touchStartX = 0;
let touchStartY = 0;
document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchmove', (e) => {
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    cursor.style.left = touchX + 'px';
    cursor.style.top = touchY + 'px';
    trail.style.left = touchX + 'px';
    trail.style.top = touchY + 'px';
    trail.classList.add('active');
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        trail.classList.remove('active');
    }, 200);
});

/**
 * Hover effects for interactive elements
 */
const hoverElements = document.querySelectorAll('a, button, .card, .profile-img');
hoverElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursor.classList.add('hovered');
    });
    element.addEventListener('mouseleave', () => {
        cursor.classList.remove('hovered');
    });
});

/**
 * Typing animation for dynamic text with light effect
 */
const dynamicText = document.getElementById('dynamic-text');
const cur = document.querySelector('.cursor');
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
        setTimeout(typeEffect, 1000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(typeEffect, 500);
    } else {
        setTimeout(typeEffect, isDeleting ? 50 : 100);
    }
}

setInterval(() => {
    cur.classList.toggle('active');
}, 500);

typeEffect();

/**
 * Contact form validation with SweetAlert confirmation
 */
const contactForm = document.getElementById('contactForm');
const formFeedback = document.getElementById('formFeedback');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    let isValid = true;

    name.classList.remove('is-invalid');
    email.classList.remove('is-invalid');
    message.classList.remove('is-invalid');
    formFeedback.className = 'mt-3';
    formFeedback.textContent = '';

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

    if (isValid) {
        Swal.fire({
            icon: 'success',
            title: 'Message Sent!',
            text: 'Thank you for reaching out. I will get back to you soon.',
            confirmButtonText: 'OK'
        });
        contactForm.reset();
    } else {
        formFeedback.className = 'mt-3 alert alert-danger';
        formFeedback.textContent = 'Please fill out all fields correctly.';
    }
});

/**
 * Make project buttons clickable with a placeholder action
 */
document.querySelectorAll('.card .btn').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        console.log(`Clicked ${button.textContent} button for project ${button.closest('.card').querySelector('.card-title').textContent}`);
        alert(`This is a placeholder. The project "${button.closest('.card').querySelector('.card-title').textContent}" is not yet linked to a live site.`);
    });
});

/**
 * Background audio controls
 */
const audio = document.getElementById('background-audio');
audio.volume = 0.2; // Lower the volume to 20%

const toggleAudioButton = document.createElement('button');
toggleAudioButton.textContent = '🔊';
toggleAudioButton.style.position = 'fixed';
toggleAudioButton.style.bottom = '20px';
toggleAudioButton.style.right = '20px';
toggleAudioButton.style.zIndex = '1100';
toggleAudioButton.style.background = 'rgba(0, 0, 0, 0.7)';
toggleAudioButton.style.color = '#fff';
toggleAudioButton.style.border = 'none';
toggleAudioButton.style.padding = '10px 15px';
toggleAudioButton.style.borderRadius = '50%';
toggleAudioButton.style.cursor = 'pointer';
toggleAudioButton.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.5)';
document.body.appendChild(toggleAudioButton);

toggleAudioButton.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        toggleAudioButton.textContent = '🔊';
    } else {
        audio.pause();
        toggleAudioButton.textContent = '🔇';
    }
});