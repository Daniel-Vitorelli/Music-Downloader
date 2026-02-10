import { spawn } from "node:child_process";
export function downloadVideo(url, outputPath, format, resolution, onProgress) {
    return new Promise((resolve, reject) => {
        const formatString = format && resolution
            ? `bestvideo[height=${resolution}][ext=${format}]+bestaudio[ext=${format === "webm" ? "webm" : "m4a"}]/best[ext=${format}]/best`
            : "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best";
        const ytdlp = spawn("yt-dlp", [
            "-f",
            formatString,
            "-o",
            outputPath,
            "--newline",
            "--progress-template",
            "%(progress._percent_str)s|%(progress._speed_str)s|%(progress._eta_str)s",
            url,
        ]);
        ytdlp.stdout.on("data", (chunk) => {
            const lines = chunk.toString().split("\n");
            for (const line of lines) {
                if (!line.trim())
                    continue;
                const parts = line.split("|");
                if (parts.length === 3) {
                    const percent = parseFloat(parts[0].replace("%", "").trim());
                    onProgress?.({
                        percent,
                        speed: parts[1].trim(),
                        eta: parts[2].trim(),
                        raw: line,
                    });
                }
            }
        });
        ytdlp.stderr.on("data", (chunk) => {
            onProgress?.({ raw: chunk.toString() });
        });
        ytdlp.on("close", (code) => {
            if (code === 0)
                resolve();
            else
                reject(new Error("yt-dlp falhou"));
        });
    });
}
//# sourceMappingURL=ytdlp.download.js.map