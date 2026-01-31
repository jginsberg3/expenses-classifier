import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';

// Mock the global fetch
global.fetch = vi.fn();

describe('App Component', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    it('renders the header and input area', () => {
        render(<App />);
        expect(screen.getByText(/Budget Classifier/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter one or more budget entries/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Classify Entries/i })).toBeDisabled();
    });

    it('enables the button when text is entered', () => {
        render(<App />);
        const textarea = screen.getByPlaceholderText(/Enter one or more budget entries/i);
        fireEvent.change(textarea, { target: { value: '- 1/20 $10 coffee' } });
        expect(screen.getByRole('button', { name: /Classify Entries/i })).not.toBeDisabled();
    });

    it('shows loading state and results after classification', async () => {
        const mockResponse = {
            items: [
                { date: '1/20', category: 'Dining Out', cost: 10.00, desc: 'coffee' }
            ]
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        render(<App />);
        const textarea = screen.getByPlaceholderText(/Enter one or more budget entries/i);
        const button = screen.getByRole('button', { name: /Classify Entries/i });

        fireEvent.change(textarea, { target: { value: '- 1/20 $10 coffee' } });
        fireEvent.click(button);

        expect(screen.getByText(/Classifying.../i)).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText(/Categorized Results/i)).toBeInTheDocument();
        });

        expect(screen.getByText('coffee')).toBeInTheDocument();
        expect(screen.getByText('$10.00')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Dining Out')).toBeInTheDocument();
    });

    it('handles API errors gracefully', async () => {
        // Spy on console.error and mock it to stay silent during the expected error
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        fetch.mockRejectedValueOnce(new Error('Network error'));

        render(<App />);
        const textarea = screen.getByPlaceholderText(/Enter one or more budget entries/i);
        const button = screen.getByRole('button', { name: /Classify Entries/i });

        fireEvent.change(textarea, { target: { value: '- 1/20 $10 coffee' } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText(/Error connecting to backend: Network error/i)).toBeInTheDocument();
        });

        // Verify console.error was indeed called, then restore it
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    });

    it('clears results when "Clear Entries" is clicked', async () => {
        const mockResponse = {
            items: [{ date: '1/20', category: 'Dining Out', cost: 10.00, desc: 'coffee' }]
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        render(<App />);
        const textarea = screen.getByPlaceholderText(/Enter one or more budget entries/i);
        const button = screen.getByRole('button', { name: /Classify Entries/i });

        fireEvent.change(textarea, { target: { value: '- 1/20 $10 coffee' } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText('coffee')).toBeInTheDocument();
        });

        const clearButton = screen.getByRole('button', { name: /Clear Entries/i });
        fireEvent.click(clearButton);

        expect(screen.queryByText('coffee')).not.toBeInTheDocument();
        expect(textarea.value).toBe('');
    });
});
