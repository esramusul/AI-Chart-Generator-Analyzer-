const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { detectSchema } = require('../services/schemaDetector');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const filePath = req.file.path;
        const schema = await detectSchema(filePath, req.file.mimetype);

        res.json({
            message: 'File uploaded successfully',
            filename: req.file.filename,
            originalName: req.file.originalname,
            path: filePath,
            schema
        });
    } catch (err) {
        console.error('Upload Error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
