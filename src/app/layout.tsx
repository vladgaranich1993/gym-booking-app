import '../styles/global.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ReactQueryProvider from '../providers/ReactQueryProvider';
import { SearchProvider } from '../providers/SearchProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-80 min-h-screen">
        <ReactQueryProvider>
          <SearchProvider>
            <Navbar />
            <main className="container mx-auto p-6">{children}</main>
            <Footer />
          </SearchProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
