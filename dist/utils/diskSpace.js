import os from "node:os";
import checkDiskSpace from "check-disk-space";
export async function freeDiskSpace() {
    const platform = os.platform();
    const path = platform === "win32" ? "C:" : "/";
    const disk = await checkDiskSpace(path);
    return disk.free;
}
export function toGB(byte) {
    return (byte / 1024 ** 3).toFixed(2);
}
//# sourceMappingURL=diskSpace.js.map