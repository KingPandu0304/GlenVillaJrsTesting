from pathlib import Path
root = Path(r'c:\Users\Akshay\OneDrive\GV - Copy')
for path in root.glob('*.html'):
    text = path.read_text(encoding='utf-8')
    new = text.replace('class="nav-link "', 'class="nav-link"').replace('class="nav-link nav-link--join "', 'class="nav-link nav-link--join"')
    if new != text:
        path.write_text(new, encoding='utf-8')
        print('Updated', path.name)
