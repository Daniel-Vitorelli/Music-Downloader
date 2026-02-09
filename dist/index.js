import fastify from "fastify";
import path from "node:path";
import { ensureDir } from "./utils/ensureDir.js";
import { fileURLToPath } from "url";
import { downloadRoute } from "./routes/download.js";
import { previewRoute } from "./routes/preview.js";
const server = fastify();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
server.downloadsDir = path.join(__dirname, "..", "downloads");
ensureDir(server.downloadsDir);
server.register(downloadRoute);
server.register(previewRoute);
const port = process.env.PORT || 8080;
server.listen({ port: +port, host: "0.0.0.0" }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
//# sourceMappingURL=index.js.map