import checkDiskSpace from "check-disk-space";
import os from "node:os";
export async function diskRoutes(server) {
    server.get("/disk", async (request, reply) => {
        try {
            const platform = os.platform();
            const path = platform === "win32" ? "C:" : "/";
            const disk = await checkDiskSpace(path);
            const toGB = (bytes) => (bytes / 1024 ** 3).toFixed(2);
            return {
                sistema: platform,
                caminho: path,
                totalGB: toGB(disk.size),
                livreGB: toGB(disk.free),
                usadoGB: toGB(disk.size - disk.free),
                percentualLivre: ((disk.free / disk.size) * 100).toFixed(2) + "%",
            };
        }
        catch (error) {
            server.log.error(error);
            reply.code(500).send({
                error: "Não foi possível obter o espaço em disco",
            });
        }
    });
}
//# sourceMappingURL=diskSpace.js.map