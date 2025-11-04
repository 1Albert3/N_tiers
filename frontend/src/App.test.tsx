import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders TodoPro landing page', () => {
  render(<App />);
  const titleElement = screen.getByText(/Gérez vos tâches comme un pro/i);
  expect(titleElement).toBeInTheDocument();
});
