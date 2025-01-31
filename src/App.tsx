import React, { useState} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { Sidebar } from './components/layout/Sidebar';
import { QuizGenerator } from './components/quiz/QuizGenerator';
import { QuizResults } from './components/quiz/QuizResults';
import { DashboardHome } from './components/DashboardHome';
import { QuizPreview } from './components/quiz/QuizPreview';
import { TakeQuiz } from './components/quiz/TakeQuiz';

// Protected Route wrapper component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentUser = localStorage.getItem('token'); // Check for token

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('home');
  const location = useLocation();
  const navigate = useNavigate();

  const handlePageChange = (pageId: string) => {
    setActivePage(pageId);
    if (pageId === 'home') {
      navigate('/dashboard');
    } else if (pageId === 'generate') {
      navigate('/create-quiz');
    } else if (pageId === 'results') {
      navigate('/results');
    }
  };

  const isQuizTakingRoute = location.pathname.startsWith('/take-quiz/');
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Only render Sidebar for non-auth and non-quiz-taking routes */}
      {!isQuizTakingRoute && !isAuthRoute && (
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          activePage={activePage}
          setActivePage={handlePageChange}
        />
      )}

      <div className={`${isQuizTakingRoute || isAuthRoute ? 'w-full' : 'flex-1'} overflow-auto`}>
        {!isQuizTakingRoute && !isAuthRoute && (
          <header className="bg-white h-16 shadow-sm flex items-center px-6">
            <h2 className="text-2xl font-semibold">
              {activePage === 'home' ? 'Dashboard' :
                activePage === 'generate' ? 'Generate Quiz' : 'View Results'}
            </h2>
          </header>
        )}

        <main className={isAuthRoute ? '' : 'p-6'}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/take-quiz/:quizId" element={<TakeQuiz />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardHome />
              </ProtectedRoute>
            } />
            <Route path="/create-quiz" element={
              <ProtectedRoute>
                <QuizGenerator />
              </ProtectedRoute>
            } />
            <Route path="/edit-quiz/:quizId" element={
              <ProtectedRoute>
                <QuizGenerator />
              </ProtectedRoute>
            } />
            <Route path="/results" element={
              <ProtectedRoute>
                <QuizResults />
              </ProtectedRoute>
            } />
            <Route path="/quiz/:quizId" element={
              <ProtectedRoute>
                <QuizPreview />
              </ProtectedRoute>
            } />

            {/* Root route redirects to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
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
