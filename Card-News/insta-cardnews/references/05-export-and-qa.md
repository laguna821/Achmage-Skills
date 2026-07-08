# 05 — Export & QA

Turn the built `cardnews-proof.html` into carousel-ready **1080×1440 PNGs**, and gate quality with DOM-eval (not screenshots).

## Export model

Chrome's CLI can't clip by selector, so it screenshots a *page*. `export-cards.ps1` therefore:

	1. Reads `cardnews-proof.html`, extracts the `<style>` block and every `<section class="card">…</section>` block.
	2. For each card, writes a temp doc **next to the proof** (so `cards/…` relative paths still resolve):
	   `<!doctype html><meta charset=utf-8><style>{style}\nbody{width:1080px;height:1440px;overflow:hidden;margin:0}</style>{card markup}`
	3. Screenshots each temp doc at `1080×1440`, deletes the temp.

Contract requirement (see `04`): a `.card` must be fully expressible from its classes + inline `--card-img` — no reliance on `.deck` or sibling order. **Cards must not nest a `<section>` tag** (the split regex ends at the first `</section>`).

## The Chrome command (inherited from consulting-chart, resized)

```powershell
& $chrome --headless=new --disable-gpu --hide-scrollbars `
  --force-device-scale-factor=1 `        # exact 1080×1440 device pixels
  --virtual-time-budget=3000 `           # let the Pretendard @import finish before capture
  --screenshot="$outPng" `
  --window-size=1080,1440 `
  "file:///$tempHtml"
```

- **Font loading:** `--virtual-time-budget=3000` advances virtual time so the CDN font loads before the shot. If exports still show system-fallback glyphs, either raise it or bundle Pretendard woff2 as a local `@font-face` (robust/offline).
- **Chrome path:** `C:\Program Files\Google\Chrome\Application\chrome.exe` (or `…(x86)…`, or Edge `msedge.exe` — same flags).

Output: `assets/export/card01.png … cardNN.png` at exactly 1080×1440, uploaded in order as the Instagram carousel. (Input photos stay in `assets/cards/`; exports go to `assets/export/` — no collision.)

## DOM-eval QA (run on the built proof, before export)

Screenshots time out on image-heavy pages (raw5-deck lesson) — inspect the DOM instead. Load `cardnews-proof.html` and eval:

```js
(() => {
  const cards = [...document.querySelectorAll('.card')];
  const bad = [];
  cards.forEach((c,i) => {
    const img = c.querySelector('.card-img');
    const cs = img && getComputedStyle(img).backgroundImage;
    if (!cs || cs === 'none') bad.push(`card ${i+1}: no --card-img bound`);
    if (c.offsetWidth !== 1080 || c.offsetHeight !== 1440) bad.push(`card ${i+1}: not 1080×1440`);
    const foot = c.querySelector('.card-foot');
    if (!foot) bad.push(`card ${i+1}: no footer`);
  });
  const toc = document.querySelector('#toc,.toc,.page-list');
  return { count: cards.length, over20: cards.length > 20, forbidden: !!toc, issues: bad };
})();
```

Pass = every card 1080×1440, `--card-img` bound, footer present, `count ≤ 20`, `forbidden:false`, `issues:[]`.

## Visual QA (checklist — judgement, per card)

	- Headline is white (A/B) or ink (C) — never gray — and pops off the photo. If not, the scrim is too weak in the headline zone → re-prompt that photo or move the text to the calmer third.
	- One accent only; no gradient-clipped text.
	- Content fills ≥ 70 %; no dead top/bottom band.
	- Safe zone 상하 ~135 px clear (nothing critical in the outer bands).
	- The series reads as ONE set (LUT doing its job). One clashing photo → fix in Stage-2 re-prompt, not per-card grading.
	- One filter per card; filters vary card-to-card for rhythm.

## Post-export legibility read-back

After export, **read 2–3 of the PNGs back (multimodal)** — especially the busiest photos — and confirm the Korean headline is legible over the image. This is the final gate before delivery. If a card fails, thicken its scrim (swap `fx-material`→`fx-tone-dark`, or add the headline to the calmer third) and re-export just that card.
