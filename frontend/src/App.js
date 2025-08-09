import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { CustomThemeProvider } from './contexts/ThemeContext';
import BhimLayout from './components/layout/BhimLayout';
import BhimDashboard from './pages/BhimDashboard';
import Transactions from './pages/Transactions';
import Analytics from './pages/Analytics';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import DatasetManager from './components/dataset/DatasetManager';
import VoiceMode from './components/VoiceMode';
import './App.css';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CustomThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<BhimLayout />}>
              <Route index element={<BhimDashboard />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Profile />} />
              <Route path="help" element={<Profile />} />
              <Route path="dataset" element={<DatasetManager />} />
              <Route path="voice" element={<VoiceMode />} />
            </Route>
          </Routes>
        </Router>
      </CustomThemeProvider>
    </QueryClientProvider>
  );
}

export default App;