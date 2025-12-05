const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
ffmpeg.setFfmpegPath(ffmpegPath);
const path = require('path');
const fs = require('fs');

function generateVideoFromImage(imagePath, outputFilename) {
    return new Promise((resolve, reject) => {
        // Output path
        const outputPath = path.join(__dirname, '..', 'outputs', outputFilename);

        // delete if exists
        if (fs.existsSync(outputPath)) {
            fs.unlinkSync(outputPath);
        }

        // Create a 10 second video from the image
        ffmpeg(imagePath)
            .loop(10) // 10 seconds
            .fps(25)
            .videoFilters([
                {
                    filter: 'zoompan',
                    options: 'z=\'min(zoom+0.0015,1.5)\':d=250:x=\'iw/2-(iw/zoom/2)\':y=\'ih/2-(ih/zoom/2)\''
                }
            ])
            .on('end', () => {
                console.log('Video generation finished:', outputPath);
                resolve(outputFilename);
            })
            .on('error', (err) => {
                console.error('Error generating video:', err);
                reject(err);
            })
            .save(outputPath);
    });
}

module.exports = { generateVideoFromImage };
