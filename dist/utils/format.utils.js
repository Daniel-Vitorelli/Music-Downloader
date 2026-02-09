export function groupFormatsByExtension(formats) {
    return formats
        .filter((f) => f.vcodec !== "none")
        .map((f) => ({
        ext: f.ext,
        label: f.format_note || "N/A",
    }))
        .reduce((acc, cur) => {
        if (!cur.ext)
            return acc;
        const ext = cur.ext;
        acc[ext] = acc[ext] ?? [];
        const list = acc[ext];
        if (!list.includes(cur.label)) {
            list.push(cur.label);
        }
        return acc;
    }, {});
}
//# sourceMappingURL=format.utils.js.map