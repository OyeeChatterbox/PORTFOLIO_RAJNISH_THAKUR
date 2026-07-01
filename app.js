
document.addEventListener("DOMContentLoaded", () => {
    // ----------------------------------------------------
    // 1. One-Time Fade-In Setup via Intersection Observer
    // ----------------------------------------------------
    const observerOptions = {
        root: null,
        rootMargin: "0px 0px -50px 0px", // Trigger slightly before it hits the bottom
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visible class
                entry.target.classList.add("visible");
                // Unobserve to ensure it ONLY runs ONCE
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select all elements to reveal
    const revealElements = document.querySelectorAll(".reveal-on-scroll");
    revealElements.forEach(el => observer.observe(el));

    // ----------------------------------------------------
    // 2. Mobile Menu Toggle
    // ----------------------------------------------------
    const ham = document.getElementById("ham");
    const mobileMenu = document.getElementById("mobile-menu");
    if (ham && mobileMenu) {
        ham.addEventListener("click", function () {
            if (mobileMenu.style.display === "block") {
                mobileMenu.style.display = "none";
            } else {
                mobileMenu.style.display = "block";
            }
        });
        mobileMenu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                mobileMenu.style.display = "none";
            });
        });
        window.addEventListener("resize", function () {
            if (window.innerWidth >= 768) {
                mobileMenu.style.display = "none";
            }
        });
    }

    // ----------------------------------------------------
    // 3. Typing Animation
    // ----------------------------------------------------
    const typingText = document.getElementById("typing-text");
    if (typingText) {
        const phrases = [
            { icon: "fa-solid fa-clapperboard", text: "Professional Video Editor" },
            { icon: "fa-solid fa-palette", text: "Thumbnail Design Expert" },
            { icon: "fa-solid fa-code", text: "Website Developer" },
            { icon: "fa-solid fa-mobile-screen-button", text: "Reels & Shorts Specialist" },
            { icon: "fa-solid fa-rocket", text: "Creative Entrepreneur" },
            { icon: "fa-solid fa-laptop-code", text: "Front-End Developer" },
            { icon: "fa-solid fa-bolt", text: "Content Creator" },
            { icon: "fa-brands fa-youtube", text: "YouTube Growth Partner" },
            { icon: "fa-solid fa-pen-nib", text: "Graphic Designer" },
            { icon: "fa-solid fa-chart-line", text: "Brand Growth Strategist" },
            { icon: "fa-solid fa-handshake", text: "Co-Founder @ CreaNext.in" },
            { icon: "fa-solid fa-wand-magic-sparkles", text: "Helping Creators Grow Online" }
        ];
        
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function type() {
            const currentObj = phrases[phraseIndex];
            const currentText = currentObj.text;
            const iconHtml = `<i class="${currentObj.icon}" style="margin-right: 8px;"></i>`;
            
            if (isDeleting) {
                typingText.innerHTML = iconHtml + currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingText.innerHTML = iconHtml + currentText.substring(0, charIndex + 1);
                charIndex++;
            }
            
            // Natural human-like typing speed
            let typeSpeed = isDeleting ? 30 : 60 + Math.random() * 40;
            
            if (!isDeleting && charIndex === currentText.length) {
                typeSpeed = 1500; // Pause at end of phrase
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeSpeed = 400; // Pause before typing new phrase
            }
            
            setTimeout(type, typeSpeed);
        }
        
        // Start typing after initial fade-in (reveal-on-scroll takes 1s)
        setTimeout(type, 1000);
    }
});


// ----------------------------------------------------


// ----------------------------------------------------

// ----------------------------------------------------
// 5. Node.js Backend Integration
// ----------------------------------------------------
const BACKEND_URL = "http://localhost:3000";

// Override Entry Modal Logic
const entryModal = document.getElementById('entry-modal');
const visitorName = document.getElementById('visitor-name');

if (entryModal) {
    if (localStorage.getItem('creanext_visitor_phone')) {
        // User already submitted, hide it
        entryModal.classList.add('hidden');
    } else {
        // Prevent scrolling while modal is active
        document.body.style.overflow = 'hidden';
    }
}

window.handleEntry = async function(targetUrl) {
    const phoneVal = document.getElementById('visitor-phone').value.trim();
    const nameVal = visitorName ? visitorName.value.trim() : "Unknown";
    
    const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
    
    if (phoneRegex.test(phoneVal) && nameVal.length > 0) {
        localStorage.setItem('creanext_visitor_phone', phoneVal);
        
        // Hide Modal immediately for better UX
        document.getElementById('entry-modal').classList.add('hidden');
        document.body.style.overflow = '';
        document.getElementById('modal-error').style.display = 'none';

        // Send Data to Backend
        try {
            await fetch(`${BACKEND_URL}/api/entry`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: nameVal, phone: phoneVal })
            });
        } catch(e) {
            console.error("Backend connection failed:", e);
        }

        // Routing logic
        if (targetUrl === 'index.html') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (targetUrl.startsWith('#')) {
            const section = document.querySelector(targetUrl);
            if (section) section.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.location.href = targetUrl;
        }
    } else {
        document.getElementById('modal-error').innerText = "Please enter both your name and a valid phone number.";
        document.getElementById('modal-error').style.display = 'block';
    }
}

// ----------------------------------------------------
// 6. Course Enrollment Modal Logic
// ----------------------------------------------------
const courseModal = document.getElementById('course-modal');
const courseSelectionInput = document.getElementById('course-selection');

window.openCourseModal = function(courseName) {
    courseSelectionInput.value = courseName;
    courseModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

window.closeCourseModal = function() {
    courseModal.classList.add('hidden');
    document.body.style.overflow = '';
    if (document.getElementById('course-modal-error')) {
        document.getElementById('course-modal-error').style.display = 'none';
    }
}

window.submitCourseEnrollment = async function() {
    const name = document.getElementById('course-visitor-name').value.trim();
    const phone = document.getElementById('course-visitor-phone').value.trim();
    const email = document.getElementById('course-visitor-email').value.trim();
    const message = document.getElementById('course-visitor-message').value.trim();
    const course = courseSelectionInput.value;
    
    const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
    
    if(name.length === 0 || !phoneRegex.test(phone) || course.length === 0) {
        document.getElementById('course-modal-error').innerText = "Please fill out Name and a valid Phone number.";
        document.getElementById('course-modal-error').style.display = 'block';
        return;
    }
    
    document.getElementById('course-modal-error').style.display = 'none';
    
    // Change button text to show loading
    const submitBtn = document.querySelector('.modal-btn-primary');
    const originalText = submitBtn.innerText;
    submitBtn.innerText = "Submitting...";
    submitBtn.disabled = true;

    try {
        const response = await fetch(`${BACKEND_URL}/api/enroll`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, phone, email, selectedCourse: course, message })
        });
        
        if (response.ok) {
            alert("Thank you! Your enrollment request has been submitted successfully.");
            closeCourseModal();
        } else {
            const errData = await response.json();
            alert("Error submitting: " + (errData.error || "Unknown error"));
        }
    } catch(e) {
        console.error("Backend connection failed:", e);
        alert("Network error. Ensure the backend server is running.");
    } finally {
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
    }
}
