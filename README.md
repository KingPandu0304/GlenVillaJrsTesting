# Glen Villa Juniors FC — Website

Club website for Glen Villa Juniors FC, Great Glen, Leicestershire.

## Pages
- `index.html` — Homepage
- `teams.html` — Teams (loads from `teams.json`)
- `fixtures.html` — Fixtures & results (loads from `fixtures.json`)
- `join.html` — How to join
- `sponsors.html` — Sponsorship info
- `kit.html` — Club kit
- `documents.html` — Club documents (PDFs in `/docs/`)
- `contact.html` — Contact details

## Updating content
- **Teams:** Edit `teams.json`
- **Fixtures/results:** Edit `fixtures.json`
- **News:** Edit `news.json`
- **PDFs:** Drop files into `/docs/` and add links in `documents.html`

## Running locally
```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Contact
- Secretary: secretary@glenvillajuniors.co.uk
- Chair: chair@glenvillajuniors.co.uk