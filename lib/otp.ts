import crypto from "crypto";

function otpSecret() {
    return process.env.JWT_SECRET || "fallback-secret-for-local-development-only";
}

export function hashOtp(email: string, code: string) {
    return crypto
        .createHmac("sha256", otpSecret())
        .update(`${email.trim().toLowerCase()}:${code}`)
        .digest("hex");
}
