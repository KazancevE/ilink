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
      <ReviewsSlider reviews={reviews} />
    </section>
  );
}
