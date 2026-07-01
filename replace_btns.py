import sys

with open('d:/Rajnish 01/github_portfolio/RajnishThakur-main/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Make sure all are buttons first
html = html.replace('<a href="contect.html" class="pricing-btn">Enroll Now</a>', '<button class="pricing-btn">Enroll Now</button>')

lines = html.split('\n')
for i, line in enumerate(lines):
    if '<button class="pricing-btn">Enroll Now</button>' in line:
        context = ''.join(lines[i-15:i])
        if '1299' in context:
            lines[i] = line.replace('<button class="pricing-btn">Enroll Now</button>', '<button onclick="openCourseModal(\'Video Editing - Advance\')" class="pricing-btn">Enroll Now</button>')
        elif '899' in context and 'Photoshop' in context:
            lines[i] = line.replace('<button class="pricing-btn">Enroll Now</button>', '<button onclick="openCourseModal(\'Photoshop - Basics\')" class="pricing-btn">Enroll Now</button>')
        elif '1899' in context:
            lines[i] = line.replace('<button class="pricing-btn">Enroll Now</button>', '<button onclick="openCourseModal(\'Photoshop - Advance\')" class="pricing-btn">Enroll Now</button>')
        elif '899' in context:
            lines[i] = line.replace('<button class="pricing-btn">Enroll Now</button>', '<button onclick="openCourseModal(\'Video Editing - Moderate\')" class="pricing-btn">Enroll Now</button>')
        else:
            lines[i] = line.replace('<button class="pricing-btn">Enroll Now</button>', '<button onclick="openCourseModal(\'Video Editing - Basics\')" class="pricing-btn">Enroll Now</button>')

with open('d:/Rajnish 01/github_portfolio/RajnishThakur-main/index.html', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))
