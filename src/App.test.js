import { render, screen } from '@testing-library/react';
import App from './App';

test('renders welcome heading', () => {
  render(<App />);
  expect(screen.getByText(/Добро пожаловать/i)).toBeInTheDocument();
  expect(screen.getByText(/Отзывы/i)).toBeInTheDocument();
});
