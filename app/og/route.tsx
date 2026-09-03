import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export async function GET() {
  const logo = await readFile(join(process.cwd(), "public/brand/whatbytes-logo.png"));
  return new ImageResponse(
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "100%", height: "100%", background: "#0f2a5c", color: "white", padding: "70px 88px", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        {/* Satori renders the image into a PNG; next/image is for browser HTML. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`data:image/png;base64,${logo.toString("base64")}`} width={136} height={136} alt="" />
        <span style={{ fontSize: 88, fontWeight: 700, letterSpacing: -3 }}>WhatBytes</span>
      </div>
      <div style={{ display: "flex", marginTop: 40, maxWidth: 920, fontSize: 48, lineHeight: 1.2 }}>Electronics, clothing &amp; home essentials</div>
      <div style={{ display: "flex", marginTop: 32, color: "#ccd7eb", fontSize: 26 }}>Explore the WhatBytes demo storefront</div>
    </div>,
    { width: 1200, height: 630 },
  );
}
