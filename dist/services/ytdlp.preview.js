import { spawn } from "node:child_process";
export async function getVideoInfo(url) {
    let output = "";
    let errorOutput = "";
    await new Promise((resolve, reject) => {
        const ytdlp = spawn("yt-dlp", ["-J", url]);
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
    return output;
}
//# sourceMappingURL=ytdlp.preview.js.map