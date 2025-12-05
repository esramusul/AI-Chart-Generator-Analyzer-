const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { identifyChartType } = require('../services/imageIdentifier');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, 'analyzer-' + Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });
const { chartKnowledge } = require('../services/chartKnowledge');

router.post('/image', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded' });
        }

        const imagePath = req.file.path;
        console.log('Analyzing image:', imagePath);

        // Call the service
        const analysis = await identifyChartType(imagePath);

        // Match with chart knowledge
        const matchedChart = chartKnowledge.flatMap(cat => cat.charts).find(c => c.chartType === analysis.predictedChartType);

        res.json({
            ...analysis,
            chartDetails: matchedChart || null
        });

    } catch (err) {
        console.error('Analyzer error:', err);
        res.status(500).json({ error: 'Analysis failed' });
    }
});

module.exports = router;
