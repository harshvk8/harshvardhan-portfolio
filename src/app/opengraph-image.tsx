import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.name} — ${siteConfig.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px",
        background: "linear-gradient(135deg, #05070d 0%, #0b0f1a 60%, #14122b 100%)",
        color: "#e9ecf5",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", fontSize: 28, color: "#8b7cff", letterSpacing: 4 }}>
        {siteConfig.shortName.toUpperCase()}.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ fontSize: 40, color: "#8b7cff" }}>{siteConfig.role}</div>
        <div style={{ fontSize: 66, fontWeight: 600, lineHeight: 1.05 }}>{siteConfig.name}</div>
        <div style={{ fontSize: 30, color: "#99a2bd", maxWidth: 900 }}>{siteConfig.tagline}</div>
      </div>
      <div style={{ display: "flex", fontSize: 24, color: "#99a2bd" }}>
        Observe → Question → Design → Build → Test → Improve
      </div>
    </div>,
    size,
  );
}
