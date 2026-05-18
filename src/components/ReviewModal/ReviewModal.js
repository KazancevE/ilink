import { useState, useEffect } from 'react';
import reviewClose from '../../img/reviueClose.png';
import infoSign from '../../img/infoSign.png';
import { validateName, validateReview, validatePhoto } from '../../utils/validation';
import './reviewModal.css';

const EMPTY_FORM = { name: '', review: '', file: null, fileName: '' };

export default function ReviewModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) {
      setForm(EMPTY_FORM);
      setErrors({});
    }
  }, [isOpen]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', onKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, file, fileName: file?.name || '' }));
    setErrors((prev) => ({ ...prev, photo: validatePhoto(file) }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
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
      <div
        className="modalFrame"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-modal-title"
      >
        <div className="modalHeader">
          <h2 id="review-modal-title">Отзыв</h2>
          <button type="button" onClick={onClose}>
            <img src={reviewClose} alt="Закрыть" />
          </button>
        </div>
        <form className="modalFormWrap" onSubmit={handleSubmit}>
          <p>
            <strong>Как Вас зовут?</strong>
          </p>
          <input
            className="modalInputName"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            placeholder="Имя Фамилия"
          />
          {errors.name && <span className="field-error">{errors.name}</span>}

          <div className="modalForm">
            <input
              id="modalBtnAdd"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <label className="modalBtn" htmlFor="modalBtnAdd">
              {form.fileName || '+ Загрузите фото'}
            </label>
          </div>
          {errors.photo && <span className="field-error">{errors.photo}</span>}

          <p>
            <strong>Все ли Вам понравилось?</strong>
          </p>
          <textarea
            className="modalInputReview"
            value={form.review}
            maxLength={200}
            onChange={(event) => setForm({ ...form, review: event.target.value })}
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
