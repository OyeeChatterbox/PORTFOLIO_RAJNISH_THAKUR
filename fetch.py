import urllib.request, urllib.error
import re, json

def get_html(url):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        return urllib.request.urlopen(req).read().decode('utf-8')
    except: return ""

def get_yt_avatar(url):
    html = get_html(url)
    m = re.search(r'"avatar":{"thumbnails":\[{"url":"(.*?)"', html)
    if m: return m.group(1).replace('\\u0026', '&')
    m2 = re.search(r'property="og:image" content="(.*?)"', html)
    return m2.group(1) if m2 else None

def get_website_logo(url):
    html = get_html(f'https://api.microlink.io/?url={url}')
    if not html: return None
    try:
        data = json.loads(html)
        return data.get('data', {}).get('logo', {}).get('url')
    except: return None

def search_google_image(query):
    query = query.replace(' ', '+')
    html = get_html(f"https://html.duckduckgo.com/html/?q={query}")
    m2 = re.search(r'<img.*?src="(https://external-content\.duckduckgo\.com/iu/\?u=.*?)"', html)
    return m2.group(1) if m2 else None

def download(url, filename):
    if not url: return False
    try:
        if url.startswith('//'): url = 'https:' + url
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        data = urllib.request.urlopen(req).read()
        with open(filename, 'wb') as f:
            f.write(data)
        return True
    except Exception as e:
        print("Error downloading", url, e)
        return False

print('StudyIQ:', download(get_website_logo('https://www.studyiq.com/'), 'studyiq.png'))
print('GenZTech07:', download(get_yt_avatar('https://www.youtube.com/@GenZTech07'), 'genztech07.jpg'))
print('TejasNCC:', download(get_yt_avatar('https://www.youtube.com/@TejasNCCArmy'), 'tejasncc.jpg'))

ig1 = search_google_image("site:instagram.com classicalshubha profile picture")
print('ClassicalShubha:', download(ig1, 'classicalshubha.jpg') if ig1 else False)

ig2 = search_google_image("site:instagram.com photographycliclucknow profile picture")
print('PhotographyClic:', download(ig2, 'photographyclic.jpg') if ig2 else False)
