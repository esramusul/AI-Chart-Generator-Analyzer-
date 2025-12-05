import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2, Play, Download, ArrowLeft } from 'lucide-react';

export default function ChartPreviewPage() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [config, setConfig] = useState({ x: '', y: '', group: '' });
    const [chartUrl, setChartUrl] = useState(null);
    const [chartFilename, setChartFilename] = useState(null);
    const [loading, setLoading] = useState(false);
    const [videoLoading, setVideoLoading] = useState(false);

    if (!state) return <div>No state</div>;
    const { schema, chart } = state;
    const filePath = state.filePath || state.path;
    const columns = [...(schema.numericColumns || []), ...(schema.categoricalColumns || []), ...(schema.datetimeColumns || [])];

    const handleRender = async () => {
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:3000/api/charts/render', {
                scriptName: chart.pythonScriptSuggestion,
                args: {
                    input: filePath,
                    x: config.x,
                    y: config.y,
                    group: config.group
                }
            });
            setChartUrl(`http://localhost:3000${res.data.outputUrl}`);
            setChartFilename(res.data.outputPath);
        } catch (err) {
            alert('Failed to render chart');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateVideo = async () => {
        if (!chartFilename) return;
        setVideoLoading(true);
        try {
            const res = await axios.post('http://localhost:3000/api/charts/video', {
                imageFilename: chartFilename
            });
            navigate('/video', { state: { videoUrl: `http://localhost:3000${res.data.videoUrl}` } });
        } catch (err) {
            alert('Failed to generate video');
        } finally {
            setVideoLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Sidebar Controls */}
            <div className="w-full md:w-80 bg-white border-r border-gray-200 p-6 flex flex-col h-screen overflow-y-auto">
                <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-black mb-6 gap-2 text-sm">
                    <ArrowLeft size={16} /> Back
                </button>

                <h2 className="text-xl font-bold mb-1">{chart.chartType}</h2>
                <p className="text-xs text-gray-400 mb-6 uppercase tracking-wider">{chart.category}</p>

                <div className="space-y-4 mb-8">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">X Axis / Category</label>
                        <select
                            className="w-full border border-gray-300 rounded-md p-2 text-sm"
                            value={config.x}
                            onChange={e => setConfig({ ...config, x: e.target.value })}
                        >
                            <option value="">Select Column</option>
                            {columns.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Y Axis / Value</label>
                        <select
                            className="w-full border border-gray-300 rounded-md p-2 text-sm"
                            value={config.y}
                            onChange={e => setConfig({ ...config, y: e.target.value })}
                        >
                            <option value="">Select Column</option>
                            {columns.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Group By (Hue) <span className="font-normal text-gray-400">(Optional)</span></label>
                        <select
                            className="w-full border border-gray-300 rounded-md p-2 text-sm"
                            value={config.group}
                            onChange={e => setConfig({ ...config, group: e.target.value })}
                        >
                            <option value="">None</option>
                            {columns.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>

                <button
                    onClick={handleRender}
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 flex justify-center items-center gap-2 mb-4"
                >
                    {loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Render Chart'}
                </button>

                {chartUrl && (
                    <div className="bg-green-50 border border-green-100 p-4 rounded-lg mt-auto">
                        <p className="text-xs text-green-800 font-semibold mb-2">Ready to animate?</p>
                        <button
                            onClick={handleGenerateVideo}
                            disabled={videoLoading}
                            className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 flex justify-center items-center gap-2"
                        >
                            {videoLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <><Play className="w-4 h-4" /> Generate Video</>}
                        </button>
                    </div>
                )}
            </div>

            {/* Main View */}
            <div className="flex-1 p-10 flex items-center justify-center bg-gray-100">
                {chartUrl ? (
                    <img src={chartUrl} alt="Generated Chart" className="max-w-full max-h-[80vh] shadow-xl rounded-lg border border-gray-200" />
                ) : (
                    <div className="text-center text-gray-400">
                        <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p>Configure and render to preview</p>
                    </div>
                )}
            </div>
        </div>
    );
}
// Need to import BarChart3 for the placeholder
import { BarChart3 } from 'lucide-react';
