import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Upload, ArrowLeft } from 'lucide-react';

export default function AnalyzerPage() {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const navigate = useNavigate();

    const handleAnalyze = async () => {
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file);
        try {
            const res = await axios.post('http://localhost:3000/api/analyzer/image', formData);
            setResult(res.data);
        } catch (e) {
            alert('Analysis failed');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-6 flex flex-col items-center justify-center text-white">
            <button onClick={() => navigate('/')} className="absolute top-6 left-6 text-gray-400 hover:text-white flex items-center gap-2">
                <ArrowLeft /> Back
            </button>

            <div className="max-w-2xl w-full text-center">
                <h1 className="text-3xl font-bold mb-8">AI Chart Analyzer</h1>

                <div className="border border-gray-700 bg-gray-800/50 rounded-xl p-8 mb-8">
                    <input
                        type="file"
                        onChange={e => setFile(e.target.files[0])}
                        className="mb-4 block w-full text-sm text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-violet-50 file:text-violet-700
                hover:file:bg-violet-100"
                        accept="image/*"
                    />
                    <button
                        onClick={handleAnalyze}
                        className="bg-violet-600 hover:bg-violet-700 px-8 py-3 rounded-lg font-bold w-full transition-colors"
                    >
                        Identify Chart
                    </button>
                </div>

                {result && (
                    <div className="bg-green-900/20 border border-green-500/30 p-6 rounded-xl text-left animate-in fade-in slide-in-from-bottom-4">
                        <h3 className="text-xl font-bold text-green-400 mb-2">Analysis Result</h3>
                        <p className="text-lg mb-1">Predicted Type: <span className="font-bold text-white uppercase">{result.predictedChartType}</span></p>
                        <p className="text-sm text-gray-400 mb-4">Confidence: {result.confidence}</p>
                        <p className="italic text-gray-300 border-l-4 border-green-500 pl-4 mb-6">{result.reasonTR}</p>

                        {result.chartDetails && localStorage.getItem('uploadedData') && (
                            <button
                                onClick={() => {
                                    const data = JSON.parse(localStorage.getItem('uploadedData'));
                                    navigate('/preview', {
                                        state: {
                                            ...data,
                                            chart: result.chartDetails
                                        }
                                    });
                                }}
                                className="w-full bg-white text-green-900 font-bold py-3 rounded-lg hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
                            >
                                Visualize with my Data
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
