import { type FastifyInstance } from "fastify";
import path from "node:path";
import { downloadVideo } from "../services/ytdlp.download.js";
import { freeDiskSpace, toGB } from "../utils/diskSpace.js";
import { getVideoSize } from "../services/ytdlp.filesize.js";

interface DownloadQuery {
  url?: string;
  format?: string;
  resolution?: string;
}

export async function downloadRoute(server: FastifyInstance) {
  server.get<{ Querystring: DownloadQuery }>(
    "/download", { sse: true },
    async (request, reply) => {
      const { url, format, resolution } = request.query;

      if (!url) {
        return reply.status(400).send({ error: "Envie ?url=" });
      }

      // 👇 MUITO IMPORTANTE
      reply.sse.send({ event: "start", data: "Iniciando..." });

      try {
        const diskSpace = await freeDiskSpace();
        const filesize = await getVideoSize(url, format, resolution);

        if (filesize > diskSpace) {
          reply.sse.send({
            event: "error",
            data: {
              error: "Espaço insuficiente em disco",
              filesize: toGB(filesize),
              diskSpace: toGB(diskSpace),
            },
          });
          return reply.raw.end();
        }

        const output = path.join(server.downloadsDir, "%(title)s.%(ext)s");

        await downloadVideo(url, output, format, resolution, (progress) => {
          reply.sse.send({
            event: "progress",
            data: progress,
          });
        });

        reply.sse.send({
          event: "complete",
          data: "Download concluído",
        });

        reply.raw.end();
      } catch (error) {
        console.error(error);

        reply.sse.send({
          event: "error",
          data: "Erro ao baixar",
        });

        reply.raw.end();
      }
    },
  );
}
