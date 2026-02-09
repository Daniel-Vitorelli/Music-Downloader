export type VideoFormat = {
  format_id: string;
  ext: string;
  resolution?: string;
  format_note?: string;
  vcodec: string;
};

export type FormatsByExt = {
  [ext: string]: string[];
};

export type ReplyPayload = {
  message: string;
  title: string;
  thumbnail: string;
  size: number;
  formats: FormatsByExt;
};