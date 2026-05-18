import React from 'react';

export function Swiper({ children }) {
  return React.createElement('div', { 'data-testid': 'swiper-mock' }, children);
}

export function SwiperSlide({ children }) {
  return React.createElement('div', { 'data-testid': 'swiper-slide-mock' }, children);
}
