import fs from 'node:fs';
export function ensureDir(path) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
}
//# sourceMappingURL=ensureDir.js.map