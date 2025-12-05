const express = require('express');
const router = express.Router();
const path = require('path');
const { suggestChartsFromSchema } = require('../services/chartKnowledge');
const { runPythonScript } = require('../services/pythonRunner');
const { generateVideoFromImage } = require('../services/videoGenerator');

router.post('/suggest', (req, res) => {
    // Expected input: { numericColumns: [], categoricalColumns: [], ... }
    try {
        const schema = req.body;
        const suggestions = suggestChartsFromSchema(schema);
        res.json(suggestions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/render', async (req, res) => {
    // Input: { scriptName: 'histogram.py', args: { input: '...', x: '...' } }
    try {
        const { scriptName, args } = req.body;
        if (!scriptName) return res.status(400).json({ error: 'scriptName is required' });

        // Generate output filename
        const outputFilename = `chart-${Date.now()}.png`;
        const outputPath = path.join(__dirname, '..', 'outputs', outputFilename);

        const fullArgs = {
            ...args,
            output: outputPath
        };

        // If input path is provided, it might be relative to uploads or absolute logic.
        // Frontend should likely pass the full path returned by dataRoutes, or filename
        // If filename, we resolve it to uploads path.
        if (fullArgs.input && !path.isAbsolute(fullArgs.input)) {
            // Fix: Check if file exists in uploads and use absolute path
            const potentialPath = path.join(__dirname, '..', 'uploads', path.basename(fullArgs.input));
            fullArgs.input = potentialPath;
        }

        const result = await runPythonScript(scriptName, fullArgs);

        res.json({
            message: 'Chart generated successfully',
            outputUrl: `/outputs/${outputFilename}`,
            outputPath: outputFilename, // filename for video gen reference
            logs: result
        });

    } catch (err) {
        console.error('Render error:', err);
        res.status(500).json({ error: err.message, details: err.toString() });
    }
});

router.post('/video', async (req, res) => {
    try {
        const { imageFilename } = req.body;
        if (!imageFilename) return res.status(400).json({ error: 'imageFilename is required' });

        // Resolve absolute path
        const imagePath = path.join(__dirname, '..', 'outputs', imageFilename);
        const outputVideoName = `video-${Date.now()}.mp4`;

        const videoName = await generateVideoFromImage(imagePath, outputVideoName);

        res.json({
            message: 'Video generated successfully',
            videoUrl: `/outputs/${videoName}`
        });
    } catch (err) {
        console.error('Video error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
