import React from 'react';
import { render, queries } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import App from './App';
import { Note } from './Staff.tsx';

it('should place an A note on the right place', () => {
    const { getByText, getByTestId } = render(<App/>, {queries: {...queries}});
    expect( getByTestId('x:50,pos:5')).toBeInTheDocument();
});

