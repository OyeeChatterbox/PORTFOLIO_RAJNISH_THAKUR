import sys

with open('d:/Rajnish 01/github_portfolio/RajnishThakur-main/app.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Remove the old Webhooks logic
if '// 5. Data Collection & Webhooks Logic' in js:
    js = js.split('// 5. Data Collection & Webhooks Logic')[0]

if '// 5. Node.js Backend Integration' in js:
    js = js.split('// 5. Node.js Backend Integration')[0]

new_js = """
// ----------------------------------------------------
// 5. Node.js Backend Integration
// ----------------------------------------------------
const BACKEND_URL = "http://localhost:3000";

// Override Entry Modal Logic
const visitorName = document.getElementById('visitor-name');
window.handleEntry = async function(targetUrl) {
    const phoneVal = document.getElementById('visitor-phone').value.trim();
    const nameVal = visitorName ? visitorName.value.trim() : "Unknown";
    
    const phoneRegex = /^[0-9+\\-\\s()]{10,15}$/;
    
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
    
    const phoneRegex = /^[0-9+\\-\\s()]{10,15}$/;
    
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
"""

with open('d:/Rajnish 01/github_portfolio/RajnishThakur-main/app.js', 'w', encoding='utf-8') as f:
    f.write(js + new_js)
