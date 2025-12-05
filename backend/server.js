const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded images, generated charts, videos)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/outputs', express.static(path.join(__dirname, 'outputs')));

// Routes
const dataRoutes = require('./routes/dataRoutes');
const chartRoutes = require('./routes/chartRoutes');
const analyzerRoutes = require('./routes/analyzerRoutes');

app.use('/api/data', dataRoutes);
app.use('/api/charts', chartRoutes);
app.use('/api/analyzer', analyzerRoutes);

// Ensure directories exist
const dirs = ['uploads', 'outputs'];
dirs.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }
});

app.get('/', (req, res) => {
    res.send('AI Chart Generator Backend is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
