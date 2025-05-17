import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import App from './App'

jest.setTimeout(30000);

test('Should render page', async () => {
    render(<App />);

    expect(screen.getByText('Number Frequency Calculator')).toBeInTheDocument();
});

test('Should handle frequency input', async () => {
    render(<App />);

    await userEvent.type(screen.getByRole('spinbutton'), '5');
    await userEvent.click(screen.getByRole('button', {name: /set frequency/i}));

    expect(screen.getByText('Please enter the first number')).toBeInTheDocument();
});

test('Should display number frequency', async () => {
    render(<App />);

    await userEvent.type(screen.getByRole('spinbutton'), '5');
    await userEvent.click(screen.getByRole('button', {name: /set frequency/i}));

    await userEvent.type(screen.getByRole('spinbutton'), '5');
    await userEvent.click(screen.getByRole('button', {name: /submit/i}));

    await new Promise((r) => setTimeout(r, 5000));

    expect(screen.getByText('5:1')).toBeInTheDocument();
});

test('should handle pause and resume', async () => {
    render(<App />);

    await userEvent.type(screen.getByRole('spinbutton'), '3');
    await userEvent.click(screen.getByRole('button', {name: /set frequency/i}));

    await userEvent.type(screen.getByRole('spinbutton'), '5');
    await userEvent.click(screen.getByRole('button', {name: /submit/i}));

    await new Promise((r) => setTimeout(r, 3000));

    expect(screen.getByText('5:1')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', {name: /halt/i}));
    await userEvent.click(screen.getByRole('button', {name: /submit/i}));

    await new Promise((r) => setTimeout(r, 3000));

    expect(screen.queryByText('5:2')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {name: /resume/i}));
    
    await new Promise((r) => setTimeout(r, 3000));
    expect(screen.getByText('5:2')).toBeInTheDocument();
});

test('Should handle quit', async () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation();
    render(<App />);

    await userEvent.type(screen.getByRole('spinbutton'), '5');
    await userEvent.click(screen.getByRole('button', {name: /set frequency/i}));

    await userEvent.click(screen.getByRole('button', {name: /quit/i}));
    expect(alertMock).toHaveBeenCalled();
});