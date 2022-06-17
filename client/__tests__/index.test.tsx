import { render, screen } from '@testing-library/react';
import Home from '@pages/index';

describe('Home', () => {
  it('renders a title', () => {
    render(<Home />);

    const title = screen.getByRole('heading', { name: /Fibonacci Calculator/i });

    expect(title).toBeInTheDocument();
  });
});