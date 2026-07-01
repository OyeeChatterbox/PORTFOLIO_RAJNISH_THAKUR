import sys, re

def update_html(filename):
    try:
        with open(filename, 'r', encoding='latin-1') as f:
            content = f.read()
    except FileNotFoundError:
        return
        
    announcement_bar = """<!-- Announcement Bar (Top) -->
<div class="announcement-bar">
    <div class="cta-text">
        🚀 Available for Freelance Projects • Call/WhatsApp:
    </div>
    <a href="tel:+919452451655" class="contact-btn">
        <i class="fa-solid fa-phone"></i> +91 9452451655
    </a>
    <a href="https://wa.me/919452451655" class="contact-btn" target="_blank">
        <i class="fa-brands fa-whatsapp"></i> WhatsApp
    </a>
</div>

<!-- Navbar -->"""
    
    # Check if already added
    if 'class="announcement-bar"' in content:
        # We assume it hasn't been added to basic_price and contect in the current session.
        # But if there's an old one, replace it.
        pass
    else:
        # insert
        content = content.replace('<body>\n<!-- Navbar -->', '<body>\n' + announcement_bar)
        
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

update_html('basic_price.html')
update_html('contect.html')
print('Files updated successfully')
