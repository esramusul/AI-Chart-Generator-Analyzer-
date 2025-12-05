# AI Chart Generator & Analyzer

A full-stack application that leverages DataViz knowledge to suggest, render, and animate charts, as well as identify charts from images.

## Project Structure
- `backend/`: Node.js Express server.
- `frontend/`: React + Vite + Tailwind application.
- `python_charts/`: Python scripts for generating visualizations.

## Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- FFmpeg (must be in system PATH for video generation)

## Setup

### 1. Backend
```bash
cd backend
npm install
npm start
```
Server runs on [http://localhost:3000](http://localhost:3000).

### 2. Python Environment
Install the required python packages:
```bash
pip install -r python_charts/requirements.txt
```
*Note: Ensure `python` command is available in your terminal.*

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
Open the URL shown (usually [http://localhost:5173](http://localhost:5173)).

## Usage
1. **Upload Data**: Go to home page, upload a CSV or Excel file.
2. **Select Chart**: Based on your data schema, suitable chart types (from `chartKnowledge.json`) are suggested.
3. **Configure**: Choose columns for X, Y, or Groupings.
4. **Render**: Click "Render Chart" to see the Python-generated PNG.
5. **Video**: Click "Generate Video" to create a short MP4 presentation of your chart.
6. **Analyzer**: Use the "Analyze an existing chart" link to upload an image and let the AI guess the chart type.

## Modifications
- Edit `backend/chartKnowledge.json` to adjust suggestion rules or descriptions.
- Edit scripts in `python_charts/` to customize visual styles.
