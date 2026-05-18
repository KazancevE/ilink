# iLink Academy Landing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a pixel-accurate, responsive iLink Academy landing page with working review form, toasts, and Swiper carousel, deployed to GitHub Pages.

**Architecture:** Refactor CRA app to functional React components with lifted state in `App`. Static profile/seed data in `src/data/`. Swiper for reviews carousel. Custom validation utilities (no UI kit). Section CSS files retained and extended.

**Tech Stack:** React 17, Create React App, Swiper 11, gh-pages, CSS (no UI libraries)

**Spec:** `docs/superpowers/specs/2026-05-18-ilink-landing-design.md`

---

## File Map

| Path | Action | Responsibility |
|------|--------|----------------|
| `package.json` | Modify | Add swiper, gh-pages, homepage, deploy scripts |
| `public/index.html` | Modify | Title, lang="ru" |
| `src/data/profile.js` | Create | Profile constants |
| `src/data/seedReviews.js` | Create | 4 seed review objects |
| `src/utils/validation.js` | Create | Form field validators |
| `src/utils/formatDate.js` | Create | `DD.MM.YYYY` formatter |
| `src/utils/getAge.js` | Create | Age from DOB string |
| `src/components/Header/Header.js` | Create | Header (replace `header.js`) |
| `src/components/Header/header.css` | Move from `src/header.css` | Header styles |
| `src/components/Hero/Hero.js` | Create | Welcome H1 |
| `src/components/Hero/hero.css` | Create | Hero styles (extract from AppBody.css) |
| `src/components/ProfileCard/ProfileCard.js` | Create | About-me card |
| `src/components/ProfileCard/profileCard.css` | Create | Card styles |
| `src/components/ReviewsSection/ReviewsSection.js` | Create | Reviews block |
| `src/components/ReviewsSection/reviewsSection.css` | Create | Section styles |
| `src/components/ReviewsSlider/ReviewsSlider.js` | Create | Swiper wrapper |
| `src/components/ReviewsSlider/reviewsSlider.css` | Create | Slider + arrows |
| `src/components/ReviewCard/ReviewCard.js` | Create | Single review card |
| `src/components/ReviewCard/reviewCard.css` | Create | Card styles |
| `src/components/ReviewModal/ReviewModal.js` | Create | Modal form |
| `src/components/ReviewModal/reviewModal.css` | Move from `addReview.css` | Modal styles |
| `src/components/Toast/ToastContainer.js` | Create | Toast stack |
| `src/components/Toast/toast.css` | Create | Toast styles |
| `src/components/Footer/Footer.js` | Create | Copyright |
| `src/components/Footer/footer.css` | Create | Footer styles |
| `src/App.js` | Rewrite | Root state + composition |
| `src/App.css` | Rewrite | Page shell only |
| `src/index.css` | Modify | Fonts, CSS reset, variables |
| `src/utils/validation.test.js` | Create | Validator unit tests |
| `src/App.test.js` | Modify | Smoke test |
| `src/header.js` | Delete | Replaced |
| `src/AppBody.js` | Delete | Replaced |
| `src/AppBody.css` | Delete | Split into components |
| `src/addReview.js` | Delete | Replaced |
| `src/addReview.css` | Delete | Moved |
| `src/IDB.js` | Delete | Unused |
| `src/review.js` | Delete | Empty stub |

---

### Task 1: Dependencies and GitHub Pages config

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install dependencies**

Run:
```bash
cd /Users/egor/projects/ilink
npm install swiper
npm install --save-dev gh-pages
```

- [ ] **Step 2: Update package.json**

Add/update these fields in `package.json`:
```json
{
  "homepage": "https://kazanceve.github.io/ilink",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

- [ ] **Step 3: Verify install**

Run: `npm ls swiper gh-pages`
Expected: both listed without errors

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add swiper and gh-pages for landing"
```

---

### Task 2: Data and utility modules

**Files:**
- Create: `src/data/profile.js`
- Create: `src/data/seedReviews.js`
- Create: `src/utils/formatDate.js`
- Create: `src/utils/getAge.js`
- Create: `src/utils/validation.js`
- Create: `src/utils/validation.test.js`

- [ ] **Step 1: Write failing validation tests**

Create `src/utils/validation.test.js`:
```javascript
import { validateName, validateReview, validatePhoto } from './validation';

describe('validateName', () => {
  it('rejects empty', () => {
    expect(validateName('')).toBe('Введите имя');
  });
  it('rejects too short', () => {
    expect(validateName('А')).toBe('Минимум 2 символа');
  });
  it('accepts valid cyrillic name', () => {
    expect(validateName('Иван Иванов')).toBeNull();
  });
});

describe('validateReview', () => {
  it('rejects empty', () => {
    expect(validateReview('')).toBe('Напишите отзыв');
  });
  it('rejects too short', () => {
    expect(validateReview('коротко')).toBe('Минимум 10 символов');
  });
  it('accepts valid text', () => {
    expect(validateReview('Отличная компания, рекомендую!')).toBeNull();
  });
});

describe('validatePhoto', () => {
  it('accepts null file', () => {
    expect(validatePhoto(null)).toBeNull();
  });
  it('rejects non-image', () => {
    const file = new File(['x'], 'doc.pdf', { type: 'application/pdf' });
    expect(validatePhoto(file)).toBe('Допустимы только изображения');
  });
  it('rejects large file', () => {
    const file = new File(['x'], 'big.jpg', { type: 'image/jpeg' });
    Object.defineProperty(file, 'size', { value: 6 * 1024 * 1024 });
    expect(validatePhoto(file)).toBe('Your file is too big!');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- --watchAll=false src/utils/validation.test.js`
Expected: FAIL — module not found

- [ ] **Step 3: Implement utilities**

`src/utils/validation.js`:
```javascript
const NAME_PATTERN = /^[а-яА-ЯёЁa-zA-Z\s-]+$/;
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

export function validateName(value) {
  const trimmed = value.trim();
  if (!trimmed) return 'Введите имя';
  if (trimmed.length < 2) return 'Минимум 2 символа';
  if (!NAME_PATTERN.test(trimmed)) return 'Используйте только буквы';
  return null;
}

export function validateReview(value) {
  const trimmed = value.trim();
  if (!trimmed) return 'Напишите отзыв';
  if (trimmed.length < 10) return 'Минимум 10 символов';
  if (trimmed.length > 200) return 'Максимум 200 символов';
  return null;
}

export function validatePhoto(file) {
  if (!file) return null;
  if (!file.type.startsWith('image/')) return 'Допустимы только изображения';
  if (file.size > MAX_PHOTO_BYTES) return 'Your file is too big!';
  return null;
}
```

`src/utils/formatDate.js`:
```javascript
export function formatDateDDMMYYYY(date = new Date()) {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}.${m}.${y}`;
}
```

`src/utils/getAge.js`:
```javascript
export function getAgeFromDOB(dobStr) {
  const [day, month, year] = dobStr.split('.').map(Number);
  const birth = new Date(year, month - 1, day);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age -= 1;
  return age;
}
```

`src/data/profile.js`:
```javascript
import myPhoto from '../img/myPhoto.jpg';
import myPhotoIcon from '../img/myPhotoIcon.jpg';

export const profile = {
  name: 'Егор Казанцев',
  dob: '27.05.1996',
  city: 'Томск',
  gender: 'Мужской',
  about:
    'Добрый день! Меня зовут Егор. Самообучаюсь на программиста, давно хочется войти в IT. Прохожу курсы на HTMLAcademy и JavaScriptLearn, также в обучении пользуюсь YouTube. Имею огромное желание развиться в этой сфере.',
  pet: 'Нет, но очень хочется :)',
  photo: myPhoto,
  avatar: myPhotoIcon,
};
```

`src/data/seedReviews.js`:
```javascript
export const seedReviews = [
  {
    id: 1,
    name: 'Буба Бубенцов',
    date: '08.01.2022',
    text: 'Отличный коллектив, руководители понимают сам процесс работы каждого сотрудника и помогают всем без исключения. Система KPI позволяет реально хорошо зарабатывать по простому принципу - чем больше и лучше ты работаешь, тем больше денег получаешь. Соцпакет - отличная страховка ДМС, организовали курсы английского языка бесплатно, оплачивают тренажерный зал. Зарплату выплачивают всегда вовремя.',
    avatarUrl: null,
  },
  {
    id: 2,
    name: 'Илья Анташкевич',
    date: '08.01.2022',
    text: 'Год назад попытал счастье, откликнулся на вакансию, прошел собес и попал в компанию. Долго переживал что будет тяжело влиться, но тут прям классные ребята работают, все на одной волне. Всегда готовы помочь с любым вопросом. Для эффективной работы здесь нужно хорошо знать иностранные языки.',
    avatarUrl: null,
  },
  {
    id: 3,
    name: 'Юрина Маргарита',
    date: '26.12.2021',
    text: 'Наша компания благодарна фирме ilink за сотрудничество. Хотелось бы отметить отличную работу сотрудников: все было выполнено качественно, со знанием дела, в установленные сроки.',
    avatarUrl: null,
  },
  {
    id: 4,
    name: 'Дмитрий Иванов',
    date: '16.12.2021',
    text: 'Отвечала за найм и адаптацию сотрудников в компании, за поддержание на нужном уровне HR-бренда и трудового настроя коллектива. В коллективе очень дружная атмосфера. Все дружелюбные, амбициозные.',
    avatarUrl: null,
  },
];
```

- [ ] **Step 4: Run tests**

Run: `npm test -- --watchAll=false src/utils/validation.test.js`
Expected: PASS (4 suites)

- [ ] **Step 5: Commit**

```bash
git add src/data src/utils
git commit -m "feat: add profile data, seed reviews, and form validators"
```

---

### Task 3: Global styles and fonts

**Files:**
- Modify: `src/index.css`
- Modify: `public/index.html`

- [ ] **Step 1: Update index.html**

```html
<html lang="ru">
...
<title>iLink Academy — Егор Казанцев</title>
```

- [ ] **Step 2: Add CSS variables and reset in index.css**

```css
:root {
  --color-primary: #585cc6;
  --color-text: #333333;
  --color-muted: #8a8a8a;
  --color-white: #ffffff;
  --color-error: #e53935;
  --font-heading: 'Factor A', 'Segoe UI', sans-serif;
  --font-body: 'Gilroy', 'Segoe UI', sans-serif;
}

* {
  box-sizing: border-box;
  margin: 0;
}

body {
  font-family: var(--font-body);
  color: var(--color-text);
  -webkit-font-smoothing: antialiased;
}

button {
  cursor: pointer;
  border: none;
  background: none;
}
```

Add `@font-face` only if font files exist in `public/fonts/`; otherwise rely on existing CSS font-family declarations.

- [ ] **Step 3: Commit**

```bash
git add src/index.css public/index.html
git commit -m "style: add global CSS variables and page title"
```

---

### Task 4: Header component

**Files:**
- Create: `src/components/Header/Header.js`
- Create: `src/components/Header/header.css` (copy from `src/header.css`, remove inline-style needs)
- Delete later: `src/header.js`, `src/header.css`

- [ ] **Step 1: Create Header.js**

```javascript
import { profile } from '../../data/profile';
import headerLogo from '../../img/myPhotoIcon.jpg';
import Vector from '../../img/Vector.png';
import ACADEMY from '../../img/ACADEMY.png';
import './header.css';

export default function Header() {
  const scrollToProfile = () => {
    document.getElementById('profile')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="header">
      <div className="header__left">
        <img className="header__avatar" src={headerLogo} alt="" />
        <p className="headerUserName">{profile.name}</p>
      </div>
      <div className="header__brand">
        <img src={Vector} className="header__vector" alt="" />
        <img src={ACADEMY} alt="iLink Academy" />
      </div>
      <button type="button" className="btnHeader" onClick={scrollToProfile}>
        <p>Панель управления</p>
      </button>
    </header>
  );
}
```

Replace `div` with `div` → fix typo: use `div` as `div` - actually use `div`:

```javascript
<div className="header__left">
```

- [ ] **Step 2: Update header.css**

Copy `src/header.css` → `src/components/Header/header.css`, add:
```css
.header__left { display: flex; align-items: center; }
.header__avatar { max-height: 52px; max-width: 52px; border-radius: 50%; object-fit: cover; }
.header__brand { display: flex; flex-direction: column; }
.header__vector { margin-bottom: 7px; }
```

- [ ] **Step 3: Manual check** — wire in temporary import in App (Task 6 will finalize)

- [ ] **Step 4: Commit**

```bash
git add src/components/Header
git commit -m "feat: add functional Header with scroll to profile"
```

---

### Task 5: Hero, ProfileCard, Footer

**Files:**
- Create: `src/components/Hero/Hero.js`, `hero.css`
- Create: `src/components/ProfileCard/ProfileCard.js`, `profileCard.css`
- Create: `src/components/Footer/Footer.js`, `footer.css`

- [ ] **Step 1: Hero**

`Hero.js`:
```javascript
import './hero.css';

export default function Hero() {
  return (
    <section className="hero">
      <h1 className="hero__title">
        Добро пожаловать
        <br />
        в академию!
      </h1>
    </section>
  );
}
```

`hero.css` — migrate `.general h1` rules from `AppBody.css`.

- [ ] **Step 2: ProfileCard**

`ProfileCard.js`:
```javascript
import { profile } from '../../data/profile';
import { getAgeFromDOB } from '../../utils/getAge';
import './profileCard.css';

export default function ProfileCard() {
  const age = getAgeFromDOB(profile.dob);
  return (
    <section className="profile" id="profile">
      <div className="profile__layout">
        <img className="profile__photo" src={profile.photo} alt={profile.name} />
        <div className="block">
          <div className="blockTitle">
            <h3>{profile.name}</h3>
            <p>{profile.dob}</p>
          </div>
          <div className="blockInfo">
            <p><strong>Город:</strong> {profile.city}</p>
            <p><strong>Пол:</strong> {profile.gender}</p>
            <p><strong>Возраст:</strong> {age}</p>
          </div>
          <div className="blockMySelf">
            <p><strong>О себе:</strong> {profile.about}</p>
          </div>
          <p><strong>Домашнее животное:</strong> {profile.pet}</p>
        </div>
      </div>
    </section>
  );
}
```

Use `div` not `div`. Migrate `.block`, `.generalBody`, `.generalImg` styles from `AppBody.css` into `profileCard.css`. Wrap hero+profile in purple `.page-main` in App.

- [ ] **Step 3: Footer**

`Footer.js`:
```javascript
import './footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <p>© iLINK ACADEMY. ALL RIGHTS RESERVED. 2022</p>
    </footer>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero src/components/ProfileCard src/components/Footer
git commit -m "feat: add Hero, ProfileCard, and Footer sections"
```

---

### Task 6: ReviewCard and ReviewsSlider (Swiper)

**Files:**
- Create: `src/components/ReviewCard/ReviewCard.js`, `reviewCard.css`
- Create: `src/components/ReviewsSlider/ReviewsSlider.js`, `reviewsSlider.css`

- [ ] **Step 1: ReviewCard**

```javascript
import './reviewCard.css';

function getInitials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function ReviewCard({ review }) {
  return (
    <article className="review-card">
      <div className="review-card__head">
        {review.avatarUrl ? (
          <img className="review-card__avatar" src={review.avatarUrl} alt="" />
        ) : (
          <span className="review-card__avatar review-card__avatar--placeholder">
            {getInitials(review.name)}
          </span>
        )}
        <div>
          <h4 className="review-card__name">{review.name}</h4>
          <time className="review-card__date">{review.date}</time>
        </div>
      </div>
      <p className="review-card__text">{review.text}</p>
    </article>
  );
}
```

Use `div` → `div` for head wrapper.

- [ ] **Step 2: ReviewsSlider with Swiper**

```javascript
import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import ReviewCard from '../ReviewCard/ReviewCard';
import 'swiper/css';
import 'swiper/css/navigation';
import './reviewsSlider.css';

export default function ReviewsSlider({ reviews }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className="reviews-slider">
      <Swiper
        modules={[Navigation]}
        spaceBetween={24}
        slidesPerView={1}
        loop={reviews.length >= 3}
        navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        breakpoints={{
          768: { slidesPerView: 2 },
        }}
      >
        {reviews.map((review) => (
          <SwiperSlide key={review.id}>
            <ReviewCard review={review} />
          </SwiperSlide>
        ))}
      </Swiper>
      <button type="button" className="btnLeft" ref={prevRef} aria-label="Назад" />
      <button type="button" className="btnRight" ref={nextRef} aria-label="Вперёд" />
    </div>
  );
}
```

Fix closing tag to `</div>` → `</div>`. Style `.btnLeft`/`.btnRight` with arrow backgrounds (CSS borders or SVG) per design.

- [ ] **Step 3: Commit**

```bash
git add src/components/ReviewCard src/components/ReviewsSlider
git commit -m "feat: add ReviewCard and Swiper ReviewsSlider"
```

---

### Task 7: ReviewsSection

**Files:**
- Create: `src/components/ReviewsSection/ReviewsSection.js`, `reviewsSection.css`

- [ ] **Step 1: Implement ReviewsSection**

```javascript
import ReviewsSlider from '../ReviewsSlider/ReviewsSlider';
import './reviewsSection.css';

export default function ReviewsSection({ reviews, onAddReview }) {
  return (
    <section className="reviews-section">
      <div className="reviewsHead">
        <h3>Отзывы</h3>
        <button type="button" className="reviewsAdd" onClick={onAddReview}>
          + Добавить отзыв
        </button>
      </div>
      <div className="rev">
        <ReviewsSlider reviews={reviews} />
      </div>
    </section>
  );
}
```

Migrate `.reviews`, `.reviewsHead`, `.rev` from `AppBody.css`.

- [ ] **Step 2: Commit**

```bash
git add src/components/ReviewsSection
git commit -m "feat: add ReviewsSection with add-review button"
```

---

### Task 8: Toast system

**Files:**
- Create: `src/components/Toast/ToastContainer.js`, `toast.css`

- [ ] **Step 1: ToastContainer**

```javascript
import { useEffect } from 'react';
import './toast.css';

export default function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div className={`toast toast--${toast.type}`} role="alert">
      <strong>{toast.title}</strong>
      {toast.message && <p>{toast.message}</p>}
      <button type="button" className="toast__close" onClick={() => onDismiss(toast.id)} aria-label="Закрыть">
        ×
      </button>
    </div>
  );
}
```

Success payload: `{ title: 'Успешно!', message: 'Спасибо за отзыв о нашей компании :)' }`
Error payload: `{ title: 'Что-то не так...', message: 'Не получилось отправить отзыв. Попробуйте еще раз!' }`

- [ ] **Step 2: Style toasts** — fixed top-right, white card, shadow, green/red accent border

- [ ] **Step 3: Commit**

```bash
git add src/components/Toast
git commit -m "feat: add ToastContainer with auto-dismiss"
```

---

### Task 9: ReviewModal with validation

**Files:**
- Create: `src/components/ReviewModal/ReviewModal.js`
- Create: `src/components/ReviewModal/reviewModal.css` (from `addReview.css` + error states)

- [ ] **Step 1: ReviewModal component**

```javascript
import { useState, useEffect } from 'react';
import reviewClose from '../../img/reviueClose.png';
import infoSign from '../../img/infoSign.png';
import { validateName, validateReview, validatePhoto } from '../../utils/validation';
import './reviewModal.css';

const EMPTY = { name: '', review: '', file: null, fileName: '' };

export default function ReviewModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) {
      setForm(EMPTY);
      setErrors({});
    }
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', onKey);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = {
      name: validateName(form.name),
      review: validateReview(form.review),
      photo: validatePhoto(form.file),
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    onSubmit({
      name: form.name.trim(),
      text: form.review.trim(),
      file: form.file,
    });
  };

  return (
    <div className="modalContain" onClick={onClose} role="presentation">
      <div className="modalFrame" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modalHeader">
          <h2>Отзыв</h2>
          <button type="button" onClick={onClose}>
            <img src={reviewClose} alt="Закрыть" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <p><strong>Как Вас зовут?</strong></p>
          <input
            className="modalInputName"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Имя Фамилия"
          />
          {errors.name && <span className="field-error">{errors.name}</span>}

          <div className="modalForm">
            <input
              id="modalBtnAdd"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setForm({ ...form, file, fileName: file?.name || '' });
                setErrors({ ...errors, photo: validatePhoto(file) });
              }}
            />
            <label className="modalBtn" htmlFor="modalBtnAdd">
              {form.fileName || '+ Загрузите фото'}
            </label>
          </div>
          {errors.photo && <span className="field-error">{errors.photo}</span>}

          <p><strong>Все ли Вам понравилось?</strong></p>
          <textarea
            className="modalInputReview"
            value={form.review}
            maxLength={200}
            onChange={(e) => setForm({ ...form, review: e.target.value })}
            placeholder="Напишите пару слов о вашем опыте..."
          />
          <span className="modal-counter">{form.review.length}/200</span>
          {errors.review && <span className="field-error">{errors.review}</span>}

          <div className="modalFooter">
            <button type="submit">Отправить отзыв</button>
            <img src={infoSign} alt="" />
            <p>Все отзывы проходят модерацию в течение 2 часов</p>
          </div>
        </form>
      </div>
    </div>
  );
}
```

Replace `div` → `div` typos with `div`. Change `.modalContain.close` visibility approach: use `isOpen` conditional render instead of CSS `visibility`.

Add `.field-error { color: var(--color-error); font-size: 12px; }` and `.modal-counter`.

- [ ] **Step 2: Commit**

```bash
git add src/components/ReviewModal
git commit -m "feat: add ReviewModal with validation and counter"
```

---

### Task 10: App root — wire state and composition

**Files:**
- Rewrite: `src/App.js`, `src/App.css`
- Modify: `src/App.test.js`

- [ ] **Step 1: Rewrite App.js**

```javascript
import { useState, useCallback } from 'react';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import ProfileCard from './components/ProfileCard/ProfileCard';
import ReviewsSection from './components/ReviewsSection/ReviewsSection';
import Footer from './components/Footer/Footer';
import ReviewModal from './components/ReviewModal/ReviewModal';
import ToastContainer from './components/Toast/ToastContainer';
import { seedReviews } from './data/seedReviews';
import { formatDateDDMMYYYY } from './utils/formatDate';
import './App.css';

export default function App() {
  const [reviews, setReviews] = useState(seedReviews);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, title, message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, title, message }]);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleReviewSubmit = ({ name, text, file }) => {
    console.log({ name, review: text, fileName: file?.name ?? null });

    const avatarUrl = file ? URL.createObjectURL(file) : null;
    const newReview = {
      id: Date.now(),
      name,
      text,
      date: formatDateDDMMYYYY(),
      avatarUrl,
    };

    setReviews((prev) => [newReview, ...prev]);
    setIsModalOpen(false);
    addToast('success', 'Успешно!', 'Спасибо за отзыв о нашей компании :)');
  };

  return (
    <div className="App">
      <Header />
      <main className="page-main">
        <Hero />
        <ProfileCard />
        <ReviewsSection reviews={reviews} onAddReview={() => setIsModalOpen(true)} />
      </main>
      <Footer />
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleReviewSubmit}
      />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
```

Replace `div` with `div`. `App.css`:
```css
.App { min-height: 100vh; }
.page-main {
  background: var(--color-primary);
  padding-left: 5%;
  padding-bottom: 3%;
}
```

- [ ] **Step 2: Update App.test.js smoke test**

```javascript
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders welcome heading', () => {
  render(<App />);
  expect(screen.getByText(/Добро пожаловать/i)).toBeInTheDocument();
  expect(screen.getByText(/Отзывы/i)).toBeInTheDocument();
});
```

- [ ] **Step 3: Run tests**

Run: `npm test -- --watchAll=false`
Expected: all PASS

- [ ] **Step 4: Commit**

```bash
git add src/App.js src/App.css src/App.test.js
git commit -m "feat: wire App state, modal, toasts, and reviews"
```

---

### Task 11: Responsive CSS

**Files:**
- Modify: `hero.css`, `profileCard.css`, `reviewsSection.css`, `reviewModal.css`, `header.css`

- [ ] **Step 1: Mobile breakpoint (<768px)**

```css
@media (max-width: 767px) {
  .hero__title {
    font-size: clamp(36px, 10vw, 64px);
    line-height: 1.2;
  }
  .profile__layout {
    flex-direction: column;
  }
  .profile__photo {
    width: 100%;
    max-height: none;
  }
  .block {
    margin-top: 0;
    max-width: 100%;
  }
  .reviewsHead {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    width: 100%;
  }
  .reviewsHead h3 {
    font-size: clamp(32px, 8vw, 68px);
    line-height: 1.2;
  }
  .modalFrame {
    width: calc(100% - 32px);
    max-width: none;
    height: auto;
    min-height: 440px;
  }
  .modalInputName,
  .modalInputReview {
    width: 100%;
  }
  .header {
    flex-wrap: wrap;
    gap: 16px;
    padding: 16px;
  }
}
```

- [ ] **Step 2: Manual resize test** at 375px and 1440px

- [ ] **Step 3: Commit**

```bash
git add src/components
git commit -m "style: add responsive breakpoints for mobile layout"
```

---

### Task 12: Cleanup legacy files

**Files:**
- Delete: `src/header.js`, `src/header.css`, `src/AppBody.js`, `src/AppBody.css`, `src/addReview.js`, `src/addReview.css`, `src/IDB.js`, `src/review.js`

- [ ] **Step 1: Delete files listed above**

- [ ] **Step 2: Verify no broken imports**

Run: `npm run build`
Expected: Compiled successfully

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove legacy class components and unused files"
```

---

### Task 13: GitHub Pages deploy

**Files:**
- Modify: `README.md` (add live URL section)

- [ ] **Step 1: Production build**

Run: `npm run build`
Expected: `build/` folder created

- [ ] **Step 2: Deploy** (requires network + git push access)

```bash
npm run deploy
```

Expected: `gh-pages` branch updated on `origin`

- [ ] **Step 3: Update README**

```markdown
## Live demo

https://kazanceve.github.io/ilink
```

- [ ] **Step 4: Commit README**

```bash
git add README.md
git commit -m "docs: add GitHub Pages live demo URL"
```

---

### Task 14: Final verification checklist

- [ ] Desktop layout: header, hero, profile, reviews, footer match PDF
- [ ] Mobile layout at 375px: stacked sections
- [ ] «Панель управления» scrolls to `#profile`
- [ ] «+ Добавить отзыв» opens modal; Escape and overlay close
- [ ] Validation: empty name, short review, large file show errors
- [ ] Valid submit: console.log, new card in slider, success toast, form reset
- [ ] Slider arrows navigate; loop works with 4+ reviews
- [ ] `npm test -- --watchAll=false` passes
- [ ] `npm run build` passes
- [ ] GitHub Pages URL loads assets

---

## Spec Coverage Matrix

| Spec requirement | Task |
|------------------|------|
| Functional components | 4–10 |
| No UI libraries | All |
| Swiper carousel | 6 |
| Form validation + toasts | 2, 8, 9, 10 |
| Responsive layout | 11 |
| Footer | 5 |
| Profile data (Егор) | 2, 5 |
| Seed reviews | 2, 6 |
| Header scroll CTA | 4 |
| GitHub Pages | 1, 13 |
| No captcha | 9 (omitted) |

## Execution Notes

- Fix any `div` typos in plan snippets to `div` → `div` should be `div` - the plan had autocorrect issues; use `div` everywhere.
- Swiper navigation refs: call `swiper.navigation.init()` in `onSwiper` if prev/next don't work on first render.
- Revoke `URL.createObjectURL` when removing reviews or on unmount to avoid memory leaks (optional cleanup in App).
