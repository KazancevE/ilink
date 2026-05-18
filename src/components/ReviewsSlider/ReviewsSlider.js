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
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        onSwiper={(swiper) => {
          setTimeout(() => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          });
        }}
        breakpoints={{
          768: { slidesPerView: 2 },
        }}
        className="reviews-slider__swiper"
      >
        {reviews.map((review) => (
          <SwiperSlide key={review.id}>
            <ReviewCard review={review} />
          </SwiperSlide>
        ))}
      </Swiper>
      <button
        type="button"
        className="btnLeft"
        ref={prevRef}
        aria-label="Предыдущий отзыв"
      />
      <button
        type="button"
        className="btnRight"
        ref={nextRef}
        aria-label="Следующий отзыв"
      />
    </div>
  );
}
