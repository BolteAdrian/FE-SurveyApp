import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SurveyPage from './pages/public/SurveyPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/s/:slug" element={<SurveyPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;