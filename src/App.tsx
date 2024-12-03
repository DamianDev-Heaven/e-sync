import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const Welcome = lazy(() => import('./components/Welcome'));
const AccountDashboard = lazy(() => import('./components/AccountControl'));
const EventsList = lazy(() => import('./components/EventList'));
const BuyTickets = lazy(() => import('./components/BuyTickets'));
const LoginPage = lazy(() => import('./components/LoginPage'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Cargando...</div>}>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/AccountControl" element={<AccountDashboard />} />
          <Route path="/EventList" element={<EventsList />} />
          <Route path="/BuyTickets" element={<BuyTickets />} />
          <Route path="/LoginPage" element={<LoginPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;