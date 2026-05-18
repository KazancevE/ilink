# iLink Academy Landing

Одностраничный лендинг для тестового задания **Frontend-стажёр в Академию iLink**. Страница знакомит с кандидатом, показывает отзывы о компании и позволяет оставить свой отзыв через модальное окно.

**Демо:** [kazanceve.github.io/ilink](https://kazanceve.github.io/ilink)

## Возможности

- **Шапка** — аватар и имя, логотип iLink Academy, кнопка «Панель управления» с плавным скроллом к блоку профиля
- **Hero** — приветственный заголовок на фирменном фиолетовом фоне
- **О себе** — фото, дата рождения, город, пол, возраст, текст о кандидате
- **Отзывы** — карусель на Swiper (стрелки, loop, 1 слайд на mobile / 2 на desktop)
- **Форма отзыва** — имя, загрузка фото, текст до 200 символов со счётчиком, валидация полей, тост об успешной отправке
- **Адаптив** — вёрстка под desktop и mobile по макету

## Стек

| | |
|---|---|
| UI | React 17 (functional components) |
| Сборка | Create React App |
| Слайдер | [Swiper](https://swiperjs.com/) 11 |
| Стили | CSS (без UI-библиотек) |
| Деплой | GitHub Pages (`gh-pages`) |

## Быстрый старт

```bash
git clone https://github.com/KazancevE/ilink.git
cd ilink
npm install
npm start
```

Приложение откроется на [http://localhost:3000](http://localhost:3000).

## Скрипты

| Команда | Описание |
|---------|----------|
| `npm start` | Режим разработки с hot reload |
| `npm test` | Юнит-тесты (валидация формы, smoke App) |
| `npm run build` | Production-сборка в папку `build/` |
| `npm run deploy` | Сборка и публикация на GitHub Pages |

## Структура проекта

```
src/
├── components/       # Header, Hero, ProfileCard, Reviews*, ReviewModal, Toast, Footer
├── data/             # profile.js, seedReviews.js
├── utils/            # validation, formatDate, getAge
├── img/              # изображения и иконки
└── App.js            # корневой state: отзывы, модалка, тосты
```

## Деплой на GitHub Pages

1. Убедитесь, что в `package.json` указан корректный `homepage` (сейчас: `https://kazanceve.github.io/ilink`).
2. В настройках репозитория GitHub: **Pages → Source → Deploy from branch → `gh-pages` / root**.
3. Выполните:

```bash
npm run deploy
```

## Макет и ТЗ

- [Figma — Landing Design Academy](https://www.figma.com/design/Qw3CzQnQYI607ZGEUYOfDU/Landing-Design-Academy)
- Требования к заданию — файл `ТЗ.pdf` в корне репозитория

## Автор

**Егор Казанцев** — Томск  
Тестовое задание, Академия iLink
