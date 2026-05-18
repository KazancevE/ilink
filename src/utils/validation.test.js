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
