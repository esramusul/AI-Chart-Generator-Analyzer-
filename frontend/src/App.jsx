import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import ChartSuggestionPage from './pages/ChartSuggestionPage';
import ChartPreviewPage from './pages/ChartPreviewPage';
import VideoResultPage from './pages/VideoResultPage';
import AnalyzerPage from './pages/AnalyzerPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/suggestions" element={<ChartSuggestionPage />} />
        <Route path="/preview" element={<ChartPreviewPage />} />
        <Route path="/video" element={<VideoResultPage />} />
        <Route path="/analyzer" element={<AnalyzerPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
