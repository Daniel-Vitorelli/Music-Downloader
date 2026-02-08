import {} from "fastify";
import path from 'node:path';
import { downloadVideo } from "../services/ytdlp.js";
export async function downloadRoute(server) {
    server.get('/download', async (request, reply) => {
        const { url } = request.query;
        if (!url) {
            return reply.status(400).send({ error: 'Envie ?Url=' });
        }
        const output = path.join(server.downloadsDir, '%(title)s.%(ext)s');
        try {
            await downloadVideo(url, output);
            reply.send({ message: 'Download concluído' });
        }
        catch {
            reply.status(500).send({ error: 'Erro ao baixar' });
        }
    });
}
//# sourceMappingURL=download.js.map