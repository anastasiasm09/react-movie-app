import '../index.css';
import React from 'react';

export const metadata = {
    title: 'React Movie App',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    )
}
