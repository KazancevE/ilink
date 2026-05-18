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
