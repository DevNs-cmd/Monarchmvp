const EICAR = "X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*";

export function scanBuffer(buffer: Buffer) {
    const sample = buffer.toString("utf8");
    if (sample.includes(EICAR)) {
        return { clean: false, reason: "EICAR test signature detected" };
    }
    return { clean: true };
}
