# Design Spec: iLink Academy Landing Page

**Date:** 2026-05-18  
**Status:** Approved pending user review  
**Goal:** Maximum score (~100 pts) per test assignment (ТЗ.pdf + Landing Design Academy.pdf)

## Scope

Implement a single-page React landing with pixel-accurate layout, responsive design, working review form with validation/toasts, and a reviews carousel. Deploy to GitHub Pages.

**Out of scope:** Captcha field ("Введите код с картинки") — omitted per decision B; not required by ТЗ.

## References

- [Figma: Landing Design Academy](https://www.figma.com/design/Qw3CzQnQYI607ZGEUYOfDU/Landing-Design-Academy?node-id=0-1)
- `ТЗ.pdf` — requirements and scoring
- `Landing Design Academy.pdf` — screen states and copy

## Constraints (from ТЗ)

| Rule | Implementation |
|------|----------------|
| React functional components | Refactor all class components |
| No UI libraries | No MUI, Ant, Chakra, etc. |
| Form/slider libs allowed | Swiper for carousel; optional lightweight form helpers only if needed |
| Cross-browser | Modern evergreen browsers; test Chrome/Firefox/Safari |
| Personal data | Fill "about me" with candidate info (Егор Казанцев) |
| GitHub Pages | Public repo + deployed build |

## Scoring Targets

| Criterion | Points | Approach |
|-----------|--------|----------|
| Full layout, cross-browser | 20 | Match PDF/Figma; polish existing CSS |
| Mobile + fluid layout | 15 | Breakpoints ~768px / ~375px; `clamp`, `%`, `max-width` |
| Form validation, submit, reset, toasts | 40 | Controlled form, custom rules, toast UI |
| Working slider, all buttons | 20 | Swiper + prev/next + "Add review" |
| Carousel behavior | 5 | Swiper loop/slidesPerView |
| Bonus | — | Custom validation messages, no captcha complexity |

## Page Structure

```
┌─────────────────────────────────────────┐
│ Header: avatar + name | logo | CTA btn  │
├─────────────────────────────────────────┤
│ Hero: "Добро пожаловать в академию!"    │  (#585CC6 background)
├─────────────────────────────────────────┤
│ ProfileCard (#profile)                  │
│   photo | name, DOB, city/gender/age    │
│   about, pet                            │
├─────────────────────────────────────────┤
│ ReviewsSection                          │
│   title | "+ Добавить отзыв"            │
│   [card][card] ...  ◀ ▶                 │
├─────────────────────────────────────────┤
│ Footer: © iLINK ACADEMY ... 2022        │
└─────────────────────────────────────────┘
        ReviewModal (overlay)
        ToastContainer (fixed)
```

## Component Architecture

| Component | Responsibility |
|-----------|----------------|
| `App` | Root state: reviews list, modal open, toasts queue |
| `Header` | Branding, user name/avatar, "Панель управления" → scroll to `#profile` |
| `Hero` | H1 welcome text |
| `ProfileCard` | Static profile content (Егор Казанцев) |
| `ReviewsSection` | Section title, open modal button, hosts slider |
| `ReviewsSlider` | Swiper wrapper, prev/next, review cards |
| `ReviewCard` | Avatar, name, date, text |
| `ReviewModal` | Controlled form, validation, submit handler |
| `Toast` / `ToastContainer` | Success and error messages per PDF |
| `Footer` | Copyright line |

**State location:** `App` with `useState` / `useReducer`. No DOM `classList` toggling for modal.

## Data

### Profile (static, `src/data/profile.js`)

Use existing copy from `AppBody.js`:

- Name: Егор Казанцев
- DOB: 27.05.1996
- City: Томск, Gender: Мужской, Age: computed from DOB (or 29 as of 2026)
- About / pet: existing paragraphs

### Seed reviews (static, `src/data/seedReviews.js`)

Four cards from design PDF:

1. Буба Бубенцов — 08.01.2022 — (long KPI text)
2. Илья Анташкевич — 08.01.2022 — (long text)
3. Юрина Маргарита — 26.12.2021 — (ilink cooperation text)
4. Дмитрий Иванов — 16.12.2021 — (HR text)

Use placeholder avatars or initials circle when no image URL.

### New reviews (dynamic)

On successful submit, prepend to `reviews` state with:

- `id`: `Date.now()`
- `name`, `text`, `date`: formatted today `DD.MM.YYYY`
- `avatarUrl`: object URL from file input (revoke on unmount) or null

Persist optional: `localStorage` for bonus — not required for max score if in-memory works for demo.

## Styling

- **Colors:** primary `#585CC6`, text `#333`, muted `#8A8A8A`, white cards, overlay `rgba(0,0,0,0.2)` + `backdrop-filter: blur(10px)`
- **Fonts:** Factor A (headings), Gilroy (body) — load via `@font-face` or CDN if files available; fallback to similar system stack
- **Files:** Keep section CSS (`header.css`, etc.) or migrate to CSS modules — match existing project style
- **Remove:** CRA boilerplate in `App.css`, inline styles in components
- **Add:** Footer styles, review card, toast, modal error states, responsive rules

### Breakpoints

| Breakpoint | Layout changes |
|------------|----------------|
| `> 1024px` | Desktop: side-by-side photo + card, 2 review cards visible if design allows |
| `768px – 1024px` | Tablet: tighter padding, slider 1–2 slides |
| `< 768px` | Mobile per PDF p.6–7: stacked hero, full-width card, single slide |

## Reviews Slider (Swiper)

- Dependency: `swiper` + `swiper/css` (and navigation module CSS)
- Config:
  - `slidesPerView: 1` below 768px
  - `slidesPerView: 2` (or per Figma measure) on desktop
  - `spaceBetween: 24`
  - `navigation`: custom prev/next buttons matching design (56×56px)
  - `loop: true` when `reviews.length >= 3`
- Wire external prev/next buttons to Swiper instance via refs or `navigation.prevEl` / `nextEl`

## Review Modal & Form

### Fields

1. **Имя** — text input, placeholder "Имя Фамилия"
2. **Фото** — hidden file input + label "Загрузить фото"; show filename after selection
3. **Отзыв** — textarea, max 200, live counter `N/200`

### Validation rules

| Field | Rules |
|-------|--------|
| Name | Required; min length 2; pattern `^[а-яА-ЯёЁa-zA-Z\s-]+$` (1–2 rules) |
| Photo | Optional; if set: `image/*` only; max size 5 MB — error: "Your file is too big!" (EN per design) or RU equivalent |
| Review | Required; min length 10; max length 200 |

Show inline errors below fields (red text per PDF input states p.15).

### Submit flow

1. Validate all fields; if invalid, show errors, do not submit
2. On valid:
   - `console.log({ name, review, fileName: file?.name })`
   - Add review to state
   - Show success toast: "Успешно! Спасибо за отзыв о нашей компании :)"
   - Reset form, close modal, revoke object URL if any
3. Optional simulated failure (e.g. random or dev flag) shows error toast: "Что-то не так... Не получилось отправить отзыв. Попробуйте еще раз!" — only if we want to demo error state; default path is success

### Modal UX

- Open: "+ Добавить отзыв" / "Добавить отзыв"
- Close: X button, click overlay (optional), Escape key
- Body scroll lock when open
- No captcha field

## Toasts

- Fixed position (top-right or per PDF placement)
- Types: `success` | `error`
- Auto-dismiss after ~4s; manual close optional
- Stack max 1–2 visible

## Header CTA

- Label: "Панель управления" (desktop PDF); keep consistent on mobile
- Action: `element.scrollIntoView({ behavior: 'smooth' })` on `#profile`

## Footer

- Text: `© iLINK ACADEMY. ALL RIGHTS RESERVED. 2022`
- Full width, appropriate padding, light background or on purple section per layout

## Refactor Plan (from current codebase)

| Current | Action |
|---------|--------|
| `App.js` class | → functional, compose sections |
| `header.js` class | → `Header.jsx` functional |
| `AppBody.js` class `general` | → split `Hero`, `ProfileCard`, `ReviewsSection` |
| `addReview.js` class `Modal` | → `ReviewModal.jsx`, React state |
| `IDB.js` empty | → remove or ignore; use React state |
| DOM `querySelector` modal toggle | → `isModalOpen` state |
| Missing footer | → add `Footer` |
| Empty `revSlider` | → `ReviewsSlider` with Swiper |

## Testing & Verification

- [ ] `npm start` — desktop layout matches PDF
- [ ] Resize to 375px — mobile layout matches PDF p.6–7
- [ ] Modal: validation errors, file too big, counter, submit, reset
- [ ] Toasts: success after submit
- [ ] Slider: arrows cycle through all reviews including new
- [ ] Header button scrolls to profile
- [ ] `npm run build` succeeds
- [ ] GitHub Pages deploy loads assets correctly

## Deployment

```json
// package.json
"homepage": "https://<github-user>.github.io/ilink"
```

- Add `gh-pages` devDependency
- Scripts: `"predeploy": "npm run build"`, `"deploy": "gh-pages -d build"`
- Ensure `public/index.html` title updated

## Dependencies to Add

- `swiper` (carousel)
- `gh-pages` (deploy, dev)

No UI kit. No captcha library.

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Fonts not in repo | Use closest web fonts + document in README |
| Figma measurements unknown | Use PDF + existing CSS values as source of truth |
| Swiper on GitHub Pages base path | Set `homepage` correctly; Swiper assets bundled by CRA |
| Age outdated | Compute from DOB in profile data |

## Decision Log

| Decision | Choice |
|----------|--------|
| Priority | A — maximum score |
| Architecture | Refactor to functional + Swiper |
| Captcha | B — skip |
| Review storage | In-memory state (+ optional localStorage bonus) |
