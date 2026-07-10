import './globals.css';

export const metadata = {
  title: 'SMARI Institute — Apply Online',
  description: 'Apply for Level 1 courses at SMARI Institute, Kampala. Digital Marketing, Film Production, AI, Hospitality and more.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
