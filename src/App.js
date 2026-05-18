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
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
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
