import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { QuizGenerator } from './components/quiz/QuizGenerator';
import { QuizResults } from './components/quiz/QuizResults';
import { DashboardHome } from './components/DashboardHome';
import { QuizPreview } from './components/quiz/QuizPreview';

const AppContent: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('home');
  const navigate = useNavigate();

  const handlePageChange = (pageId: string) => {
    setActivePage(pageId);
    switch (pageId) {
      case 'home':
        navigate('/dashboard');
        break;
      case 'generate':
        navigate('/create-quiz');
        break;
      case 'results':
        navigate('/results');
        break;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activePage={activePage}
        setActivePage={handlePageChange}
      />

      <div className="flex-1 overflow-auto">
        <header className="bg-white h-16 shadow-sm flex items-center px-6">
          <h2 className="text-2xl font-semibold">
            {activePage === 'home' ? 'Dashboard' :
              activePage === 'generate' ? 'Generate Quiz' : 'View Results'}
          </h2>
        </header>

        <main className="p-6">
          <Routes>
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/create-quiz" element={<QuizGenerator />} />
            <Route path="/edit-quiz/:quizId" element={<QuizGenerator />} />
            <Route path="/results" element={<QuizResults />} />
            <Route path="*" element={<DashboardHome />} />
            <Route path="/quiz/:quizId" element={<QuizPreview />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;