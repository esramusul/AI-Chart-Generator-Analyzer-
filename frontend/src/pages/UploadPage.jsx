import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Upload, FileUp, Loader2 } from 'lucide-react';

export default function UploadPage() {
    const [file, setFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        try {
            // 1. Upload Data
            const dataFormData = new FormData();
            dataFormData.append('file', file);
            const dataRes = await axios.post('http://localhost:3000/api/data/upload', dataFormData);
            const dataState = dataRes.data; // { schema, filename, path, ... }
            localStorage.setItem('uploadedData', JSON.stringify(dataState));

            // 2. If Image provided, identify chart type
            let matchedChart = null;
            if (imageFile) {
                try {
                    const imageFormData = new FormData();
                    imageFormData.append('image', imageFile);
                    const imageRes = await axios.post('http://localhost:3000/api/analyzer/image', imageFormData);
                    const { predictedChartType, chartDetails } = imageRes.data;

                    // 3. Compatibility Check (Simple: Just check if chartDetails exists and matches data?)
                    // For now, if we have a predicted type and it's in our system, we try to use it.
                    // Ideally check dataState.schema against chartDetails.suitableDataSchema

                    if (chartDetails) {
                        matchedChart = chartDetails;
                    }

                } catch (imgErr) {
                    console.error("Image analysis failed", imgErr);
                    // Continue without chart suggestion
                }
            }

            // 4. Navigate
            if (matchedChart) {
                navigate('/preview', {
                    state: {
                        ...dataState,
                        filePath: dataState.path, // ensure consistency
                        chart: matchedChart
                    }
                });
            } else {
                navigate('/suggestions', { state: dataState });
            }

        } catch (err) {
            console.error(err);
            alert('Upload failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
            <div className="max-w-4xl w-full text-center">
                <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                    AI Chart Generator
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Data Upload */}
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-blue-500 transition-colors bg-gray-50">
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">1. Upload Data</h3>
                        <input
                            type="file"
                            id="fileInput"
                            className="hidden"
                            accept=".csv,.xlsx"
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                        <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                {file ? <FileUp className="w-8 h-8 text-blue-600" /> : <Upload className="w-8 h-8 text-blue-600" />}
                            </div>
                            <span className="text-gray-600 font-medium">
                                {file ? file.name : 'Upload CSV or Excel'}
                            </span>
                        </label>
                    </div>

                    {/* Image Upload (Optional) */}
                    <div className={`border-2 border-dashed rounded-xl p-8 transition-colors bg-gray-50 ${imageFile ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-violet-500'}`}>
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">2. Reference Chart (Optional)</h3>
                        <input
                            type="file"
                            id="imageInput"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files[0])}
                        />
                        <label htmlFor="imageInput" className="cursor-pointer flex flex-col items-center">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${imageFile ? 'bg-green-100' : 'bg-violet-100'}`}>
                                {imageFile ? <FileUp className="w-8 h-8 text-green-600" /> : <Upload className="w-8 h-8 text-violet-600" />}
                            </div>
                            <span className="text-gray-600 font-medium">
                                {imageFile ? imageFile.name : 'Upload Chart Image'}
                            </span>
                            <span className="text-sm text-gray-400 mt-2">
                                We'll try to match this style
                            </span>
                        </label>
                    </div>
                </div>

                <button
                    onClick={handleUpload}
                    disabled={!file || loading}
                    className="mt-8 w-full max-w-md mx-auto bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                    {loading ? <Loader2 className="animate-spin" /> : 'Analyze & Generate'}
                </button>

                <div className="mt-8 pt-8 border-t border-gray-100">
                    <button onClick={() => navigate('/analyzer')} className="text-sm text-gray-500 hover:text-blue-600 underline">
                        Or just analyze an image without data
                    </button>
                </div>
            </div>
        </div>
    );
}
