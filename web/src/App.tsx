import './App.css';
import { Router } from './AppRouter';
import { BrowserRouter } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Router />
      </BrowserRouter>
      <Analytics />
    </div>
  );
}

export default App;
