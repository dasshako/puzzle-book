import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home.jsx';
import BookPage from './pages/BookPage.jsx';
import PuzzlePage from './pages/PuzzlePage.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book" element={<BookPage />} />
        <Route path="/puzzle/:id" element={<PuzzlePage />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}
