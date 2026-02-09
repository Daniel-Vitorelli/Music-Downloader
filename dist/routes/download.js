import {} from "fastify";
import path from "node:path";
import { downloadVideo } from "../services/ytdlp.download.js";
import { freeDiskSpace, toGB } from "../utils/diskSpace.js";
import { getVideoSize } from "../services/ytdlp.filesize.js";
export async function downloadRoute(server) {
    server.get("/download", async (request, reply) => {
        const { url, format, resolution } = request.query;
        if (!url) {
            return reply.status(400).send({ error: "Envie ?url=" });
        }
        try {
            const diskSpace = await freeDiskSpace();
            const filesize = await getVideoSize(url, format, resolution);
            if (filesize > diskSpace) {
                return reply.status(400).send({
                    error: "Espaço insuficiente em disco",
                    filesize: toGB(filesize),
                    diskSpace: toGB(diskSpace)
                });
            }
            const output = path.join(server.downloadsDir, "%(title)s.%(ext)s");
            await downloadVideo(url, output, format, resolution);
            return reply.send({ message: "Download concluído" });
        }
        catch (error) {
            console.error(error);
            return reply.status(500).send({ error: "Erro ao baixar" });
        }
    });
}
//# sourceMappingURL=download.js.map