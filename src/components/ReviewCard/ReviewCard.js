import './reviewCard.css';

function getInitials(name) {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function ReviewCard({ review }) {
  return (
    <article className="review-card">
      <header className="review-card__head">
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
      </header>
      <p className="review-card__text">{review.text}</p>
    </article>
  );
}
