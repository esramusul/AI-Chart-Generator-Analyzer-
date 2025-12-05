import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';

export default function VideoResultPage() {
    const { state } = useLocation();
    const navigate = useNavigate();

    if (!state || !state.videoUrl) return <div>No video URL</div>;

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
            <button
                onClick={() => navigate('/')}
                className="absolute top-6 left-6 text-white/50 hover:text-white flex items-center gap-2"
            >
                <ArrowLeft /> Start Over
            </button>

            <div className="w-full max-w-4xl">
                <video controls autoPlay className="w-full rounded-xl shadow-2xl border border-gray-800">
                    <source src={state.videoUrl} type="video/mp4" />
                </video>

                <div className="flex justify-between items-center mt-6">
                    <h1 className="text-white text-xl font-medium">Generated Presentation</h1>
                    <a
                        href={state.videoUrl}
                        download
                        className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200 flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" /> Download Video
                    </a>
                </div>
            </div>
        </div>
    );
}
