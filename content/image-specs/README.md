# TestPsychometric — Image Generation Spec (Higgsfield-ready)

This folder contains paste-ready image prompts + SEO metadata for every blog and
location page. Generate in Higgsfield (or any photorealistic generator), export,
and drop into `/public/blog/<slug>/` or `/public/locations/<slug>/`.

> **Note:** Higgsfield MCP is **not** connected to the build session, so these
> prompts were authored for manual/Higgsfield-UI generation. Once the Higgsfield
> MCP is connected, the same prompts can be fed to it programmatically.

---

## Global style (applies to EVERY image)

**Style:** Photorealistic, editorial, magazine-quality documentary photography. Natural light, shallow depth of field, authentic candid moments.

**People:** Real, relatable **Indian** people appropriate to the audience — students (Class 9–12), parents, teachers, school counsellors, HR professionals, employees. Natural Indian clothing, settings, and skin tones. Warm, hopeful, trustworthy expressions.

**Environments:** Real Indian contexts — Indian schools and classrooms, middle-class Indian homes, modern Indian offices, computer labs, counselling rooms. Punjab / North India flavour where relevant.

**Mood (Google Discover):** Emotional, human, strong visual storytelling, aspirational but grounded.

**NEGATIVE PROMPT (always include):**
`cartoon, illustration, anime, 3D render, CGI, robot, AI-looking faces, distorted hands, extra fingers, deformed, plastic skin, stock-photo cliché, watermark, logo artifacts, text errors, gibberish text, oversaturated, lowres, blurry`

---

## Sizes & format

| Image type | Size | Format |
|---|---|---|
| Featured image | 1600×900 | WebP |
| Content images | 1200×800 | WebP |
| Social sharing image | 1200×630 | WebP |

---

## Branding & text overlay

- **Featured image** must include, as a clean editorial text overlay:
  - The **exact blog/page title** (top or lower-third, high-contrast, modern sans-serif)
  - Brand badge: **TestPsychometric.com**
  - Small footer line: **Powered by AMG Educational Charitable Society**
- **Social image (1200×630)** overlay: the **blog title** + **TestPsychometric.com** (no footer needed).
- **Content images:** no text overlay (clean documentary photos).

> Tip: AI text rendering is unreliable. Generate the photo *clean* in Higgsfield, then add the title/brand text in Canva/Figma/Photoshop for crisp, correct typography. Each spec gives the overlay text to apply.

---

## SEO metadata convention

For every image we provide **Filename · ALT · Caption**. To avoid four near-identical strings per image:
- **Image Title** = the ALT text (use as the `title` attribute / Higgsfield title).
- **Description** = the Caption, optionally expanded with "— TestPsychometric.com, powered by AMG Educational Charitable Society."

**Filename rule:** lowercase, hyphenated, keyword-first, `.webp`, prefixed by page slug for content images (e.g. `career-guidance-after-10th-counsellor.webp`).

---

## In-page placement order

1. **Featured image** — top of article (already supported via frontmatter `image`).
2. **Content Image 1** — after the introduction.
3. **Content Image 2** — after Section 1–2.
4. **Content Image 3** — mid-article (after a benefits/how-it-works section).
5. **(Optional 4–5)** — before FAQ / before conclusion.
6. **Social image** — not shown in-page; used for OG/Twitter/WhatsApp sharing.

> To auto-place these, ask me to "wire auto-placement" — I'll extend the template so images dropped into `/public/blog/<slug>/` insert automatically with ALT pulled from a frontmatter `images:` array.

---

## Folder layout to create

```
public/
  blog/
    what-is-a-psychometric-test/
      featured.webp
      content-1.webp
      content-2.webp
      content-3.webp
      social.webp
    how-psychometric-testing-helps-students-choose-careers/
      ...
  locations/
    chandigarh/
      featured.webp
      ...
```

---

## Spec files

- [01-students.md](01-students.md) — student-audience blogs
- [02-parents.md](02-parents.md) — parent-audience blogs
- [03-schools.md](03-schools.md) — school-audience blogs
- [04-company-hr.md](04-company-hr.md) — company / HR blogs
- [05-awareness.md](05-awareness.md) — general awareness blogs
- [06-locations.md](06-locations.md) — city location pages

Each page entry includes: **Featured**, **Social**, and **3 content images** (expand to 5 by adding section-specific shots — extra prompt ideas noted per page).
