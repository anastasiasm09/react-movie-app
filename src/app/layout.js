import '../index.css';
import React from 'react';
import { Providers } from './client';

export const metadata = {
    title: 'React Movie App',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    )
}
