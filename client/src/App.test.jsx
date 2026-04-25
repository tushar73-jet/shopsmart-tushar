import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AppProvider } from './context/AppContext';
import { describe, it, expect } from 'vitest';

describe('App', () => {
    it('renders the layout and sidebar', () => {
        render(
            <BrowserRouter>
                <AppProvider>
                    <App />
                </AppProvider>
            </BrowserRouter>
        );
        const title = screen.getByText('ShopSmart Dashboard');
        expect(title).toBeInTheDocument();
    });
});
