import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { ArticlesPage } from './pages/ArticlesPage';
import { ArticlePage } from './pages/ArticlePage';
import { CreateArticlePage } from './pages/CreateArticlePage';
import { EditArticlePage } from './pages/EditArticlePage';
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/articles/create" element={<CreateArticlePage />} />
        <Route path="/articles/:id" element={<ArticlePage />} />
        <Route path="/articles/:id/edit" element={<EditArticlePage />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
