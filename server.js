const express = require('express');
const ytdl = require('ytdl-core');
const app = express();

// Heroku පෝට් එකට ගැළපෙන විදියට සැකසීම
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY || "sasiya_md_premium_key";

app.get('/api/ytdl', async (req, res) => {
    const { apiKey, url, type, quality } = req.query;

    if (apiKey !== API_KEY) {
        return res.status(403).json({ status: false, message: "Invalid API Key" });
    }

    if (!url || !ytdl.validateURL(url)) {
        return res.status(400).json({ status: false, message: "Invalid URL" });
    }

    try {
        const info = await ytdl.getInfo(url);
        
        const formatOptions = (type === 'mp3') 
            ? { filter: 'audioonly', quality: 'highestaudio' } 
            : { quality: quality || 'highest' };

        const format = ytdl.chooseFormat(info.formats, formatOptions);

        res.json({
            status: true,
            creator: "Sasiya MD",
            title: info.videoDetails.title,
            thumbnail: info.videoDetails.thumbnails[0].url,
            downloadUrl: format.url
        });
    } catch (err) {
        res.status(500).json({ status: false, message: "Error processing request" });
    }
});

app.listen(PORT, () => console.log(`Sasiya MD API Live on port ${PORT}`));
