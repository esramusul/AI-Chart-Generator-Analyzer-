import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, Info } from 'lucide-react';

export default function ChartSuggestionPage() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!state?.schema) return;

        axios.post('http://localhost:3000/api/charts/suggest', state.schema)
            .then(res => setSuggestions(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [state]);

    if (!state) return <div className="p-10">No state found, go back.</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-black mb-8 gap-2">
                    <ArrowLeft size={20} /> Back
                </button>

                <h2 className="text-3xl font-bold text-gray-900 mb-2">Recommended Charts</h2>
                <p className="text-gray-600 mb-10">Based on your data structure: {Object.keys(state.schema.numericColumns).length} numeric, {Object.keys(state.schema.categoricalColumns).length} categorical columns.</p>

                {loading ? (
                    <div className="text-center py-20">Loading suggestions...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {suggestions.map((chart, idx) => (
                            <div
                                key={idx}
                                onClick={() => navigate('/preview', { state: { ...state, chart } })}
                                className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-md cursor-pointer border transition-all hover:-translate-y-1 group relative overflow-hidden
                                    ${state.predictedChartType === chart.chartType
                                        ? 'border-green-500 ring-2 ring-green-500/20'
                                        : 'border-gray-100'}`}
                            >
                                {state.predictedChartType === chart.chartType && (
                                    <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-wide">
                                        Your Uploaded Style
                                    </div>
                                )}

                                <div className="flex items-center justify-between mb-4">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase rounded-full tracking-wider">
                                        {chart.category}
                                    </span>
                                    <BarChart3 className={`${state.predictedChartType === chart.chartType ? 'text-green-500' : 'text-gray-300'} group-hover:text-blue-500 transition-colors`} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{chart.chartType}</h3>
                                <p className="text-sm text-gray-500 mb-4 line-clamp-3">{chart.descriptionTR}</p>

                                <div className="text-xs text-gray-400 border-t pt-4 flex gap-2">
                                    <Info size={14} />
                                    <span>{chart.suitableDataTR}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
