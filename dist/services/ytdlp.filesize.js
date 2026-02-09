import { spawn } from "node:child_process";
export async function getVideoSize(url, format, resolution) {
    let output = "";
    let errorOutput = "";
    await new Promise((resolve, reject) => {
        const ytdlp = spawn("yt-dlp", [
            "--simulate",
            "--print",
            "%(filesize,filesize_approx)r",
            "-f",
            format && resolution
                ? `bestvideo[height=${resolution}][ext=${format}]+bestaudio[ext=${format === "webm" ? "webm" : "m4a"}]/best[ext=${format}]/best`
                : "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best",
            url,
        ]);
        ytdlp.stdout.on("data", (data) => {
            output += data.toString();
        });
        ytdlp.stderr.on("data", (data) => {
            errorOutput += data.toString();
        });
        ytdlp.on("close", (code) => {
            if (code === 0) {
                resolve();
            }
            else {
                reject(new Error(errorOutput || "yt-dlp falhou"));
            }
        });
    });
    return Number(output);
}
//ytdlp --simulate --print "%(filesize,filesize_approx)r" -f "bestvideo[height<=1080]+bestaudio" --merge-output-format mp4 https://youtu.be/apK2jCrfnsk
//# sourceMappingURL=ytdlp.filesize.js.map