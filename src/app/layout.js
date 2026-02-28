import "./globals.css";

export const metadata = {
  title: 'Bhai.com',
  description: 'Book you Bhai',
  icons: { icon: '/logo.png' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}