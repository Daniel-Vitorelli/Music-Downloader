import { spawn } from "node:child_process";
export function downloadVideo(url, outputPath) {
    return new Promise((resolve, reject) => {
        const ytdlp = spawn('yt-dlp', [
            '-f',
            'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
            '-o',
            outputPath,
            url
        ]);
        ytdlp.on('close', (code) => {
            if (code === 0) {
                resolve();
            }
            else {
                reject(new Error('yt-dlp falhou'));
            }
        });
    });
}
//# sourceMappingURL=ytdlp.js.map