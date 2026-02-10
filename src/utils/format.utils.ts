import type { FormatsByExt, VideoFormat } from "../types/previewTypes.js";

export function groupFormatsByExtension(formats: VideoFormat[]): FormatsByExt {
  return formats
    .filter((f) => f.vcodec !== "none")
    .filter((f) => !(f.ext === "mp4" && f.vcodec.startsWith("avc")))
    .map((f) => ({
      ext: f.ext,
      format_id: f.format_id,
      label: f.format_note || "N/A",
      resolution: f.resolution,
      filesize: f.filesize,
      filesize_approx: f.filesize_approx,
    }))
    .reduce<FormatsByExt>((acc, cur) => {
      if (!cur.ext) return acc;

      const ext = cur.ext;
      acc[ext] = acc[ext] ?? [];
      const list = acc[ext];

      const alreadyExists = list.some(
        (item) => item.format_id === cur.format_id,
      );

      if (!alreadyExists) {
        list.push({
          format_id: cur.format_id,
          resolution: cur.resolution,
          filesize:
            cur.filesize === "NA" ||
            cur.filesize === null ||
            cur.filesize === undefined
              ? cur.filesize_approx
              : cur.filesize,
        });
      }

      return acc;
    }, {});
}
