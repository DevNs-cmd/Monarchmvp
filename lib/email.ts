type OtpEmail = {
    to: string;
    code: string;
};

export async function sendOtpEmail({ to, code }: OtpEmail) {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM;

    if (!apiKey || !from) {
        return { delivered: false, configured: false } as const;
    }

    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "User-Agent": "monarch-platform/1.0",
        },
        body: JSON.stringify({
            from,
            to: [to],
            subject: "Your Monarch access code",
            html: `<div style="background:#050505;color:#f7f1e5;padding:32px;font-family:Arial,sans-serif"><p style="color:#c9a24d;letter-spacing:3px;font-size:12px">MONARCH PRIVATE OPPORTUNITIES</p><h1 style="font-size:24px;font-weight:400">Your secure access code</h1><p style="font-size:34px;letter-spacing:8px;margin:28px 0">${code}</p><p style="color:#a8a29e">This code expires in 10 minutes. If you did not request it, no action is required.</p></div>`,
        }),
    });

    if (!response.ok) {
        const detail = await response.text();
        throw new Error(`OTP email delivery failed (${response.status}): ${detail.slice(0, 240)}`);
    }

    return { delivered: true, configured: true } as const;
}
